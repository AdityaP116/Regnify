import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase';
import { initialsOf } from '../lib/format';
import type { UserAccount } from '../lib/types';

// Auth abstraction. When Firebase is configured we use real Firebase Auth
// (email/password + Google, with persisted sessions). Otherwise we keep a
// locally persisted demo session so every protected route remains reachable.

import { api } from '../lib/api';

interface AuthState {
  user: UserAccount | null;
  loading: boolean;
  configured: boolean;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (name: string, email: string, password: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  completeOnboarding: () => void;
  updateUserProfile: (updates: Partial<UserAccount>) => Promise<UserAccount>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);
const LS_KEY = 'regnify.demo.session';

function demoAccount(email: string, name?: string): UserAccount {
  const display = name || email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    uid: `demo-${btoa(email).replace(/=/g, '')}`,
    name: display,
    email,
    role: 'Compliance Lead',
    initials: initialsOf(display),
    provider: 'password',
    businessId: 'biz-precision-fab-pune',
    onboarded: true,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync profile from backend
  const syncProfile = useCallback(async (baseUser: UserAccount) => {
    try {
      const profile = await api.getUserProfile();
      
      // Workaround: If the backend returned the dummy seed data (or it was previously
      // saved to Firestore due to a bug), we should prefer the real Firebase user data.
      const isDummyBackend = profile.email === 'elena.vance@precisionfab.in' && baseUser.email && baseUser.email !== 'elena.vance@precisionfab.in';
      
      const merged: UserAccount = {
        ...baseUser,
        name: isDummyBackend ? baseUser.name : (profile.name || baseUser.name),
        email: isDummyBackend ? baseUser.email : (profile.email || baseUser.email),
        role: profile.role || baseUser.role,
        initials: isDummyBackend ? baseUser.initials : initialsOf(profile.name || baseUser.name),
        businessId: profile.businessId || baseUser.businessId,
        onboarded: profile.onboarded ?? baseUser.onboarded,
      };
      
      // If we recovered real data from a dummy state, update the backend so it's correct next time
      if (isDummyBackend && baseUser.name && baseUser.email) {
         void api.updateUserProfile({ name: baseUser.name, email: baseUser.email, initials: baseUser.initials });
      }

      setUser(merged);
      if (!isFirebaseConfigured) localStorage.setItem(LS_KEY, JSON.stringify(merged));
    } catch {
      setUser(baseUser);
    }
  }, []);

  // Restore session on mount.
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsub = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          const display = fbUser.displayName || fbUser.email?.split('@')[0] || 'Compliance Lead';
          const base: UserAccount = {
            uid: fbUser.uid,
            name: display,
            email: fbUser.email ?? '',
            role: 'Compliance Lead',
            initials: initialsOf(display),
            provider: fbUser.providerData[0]?.providerId ?? 'password',
            businessId: 'biz-precision-fab-pune',
            onboarded: true,
          };
          void syncProfile(base).finally(() => setLoading(false));
        } else {
          setUser(null);
          setLoading(false);
        }
      });
      return unsub;
    }
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UserAccount;
        setUser(parsed);
        void syncProfile(parsed).finally(() => setLoading(false));
        return;
      }
    } catch {
      /* ignore corrupt session */
    }
    setLoading(false);
  }, [syncProfile]);

  const persistDemo = useCallback((account: UserAccount) => {
    localStorage.setItem(LS_KEY, JSON.stringify(account));
    setUser(account);
    void syncProfile(account);
  }, [syncProfile]);

  const signInEmail = useCallback(
    async (email: string, password: string) => {
      if (isFirebaseConfigured && auth) {
        await signInWithEmailAndPassword(auth, email, password);
        return;
      }
      await new Promise((r) => setTimeout(r, 500));
      if (!email || !password) throw new Error('Email and password are required.');
      persistDemo(demoAccount(email));
    },
    [persistDemo],
  );

  const signUpEmail = useCallback(
    async (name: string, email: string, password: string) => {
      if (isFirebaseConfigured && auth) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (name) await updateProfile(cred.user, { displayName: name });
        await api.updateUserProfile({ name, email });
        return;
      }
      await new Promise((r) => setTimeout(r, 500));
      persistDemo({ ...demoAccount(email, name), onboarded: false });
    },
    [persistDemo],
  );

  const signInGoogle = useCallback(async () => {
    if (isFirebaseConfigured && auth) {
      await signInWithPopup(auth, googleProvider);
      return;
    }
    await new Promise((r) => setTimeout(r, 500));
    persistDemo({ ...demoAccount('elena.vance@precisionfab.in', 'Elena Vance'), provider: 'google.com' });
  }, [persistDemo]);

  const signOutUser = useCallback(async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    localStorage.removeItem(LS_KEY);
    setUser(null);
  }, []);

  const completeOnboarding = useCallback(() => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, onboarded: true };
      if (!isFirebaseConfigured) localStorage.setItem(LS_KEY, JSON.stringify(next));
      void api.updateUserProfile({ onboarded: true });
      return next;
    });
  }, []);

  const updateUserProfile = useCallback(async (updates: Partial<UserAccount>) => {
    const res = await api.updateUserProfile(updates);
    if (isFirebaseConfigured && auth?.currentUser && updates.name) {
      try {
        await updateProfile(auth.currentUser, { displayName: updates.name });
      } catch {
        /* best-effort auth profile update */
      }
    }
    setUser((prev) => {
      const next: UserAccount = {
        ...(prev || res),
        ...res,
        name: updates.name ?? prev?.name ?? res.name,
        email: updates.email ?? prev?.email ?? res.email,
        role: updates.role ?? prev?.role ?? res.role,
        initials: initialsOf(updates.name ?? prev?.name ?? res.name),
      };
      if (!isFirebaseConfigured) localStorage.setItem(LS_KEY, JSON.stringify(next));
      return next;
    });
    return res;
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      configured: isFirebaseConfigured,
      signInEmail,
      signUpEmail,
      signInGoogle,
      signOutUser,
      completeOnboarding,
      updateUserProfile,
    }),
    [user, loading, signInEmail, signUpEmail, signInGoogle, signOutUser, completeOnboarding, updateUserProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

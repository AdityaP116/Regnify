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

interface AuthState {
  user: UserAccount | null;
  loading: boolean;
  configured: boolean;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (name: string, email: string, password: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  completeOnboarding: () => void;
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

  // Restore session on mount.
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsub = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          const display = fbUser.displayName || fbUser.email?.split('@')[0] || 'Compliance Lead';
          setUser({
            uid: fbUser.uid,
            name: display,
            email: fbUser.email ?? '',
            role: 'Compliance Lead',
            initials: initialsOf(display),
            provider: fbUser.providerData[0]?.providerId ?? 'password',
            businessId: 'biz-precision-fab-pune',
            onboarded: true,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return unsub;
    }
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setUser(JSON.parse(raw) as UserAccount);
    } catch {
      /* ignore corrupt session */
    }
    setLoading(false);
  }, []);

  const persistDemo = useCallback((account: UserAccount) => {
    localStorage.setItem(LS_KEY, JSON.stringify(account));
    setUser(account);
  }, []);

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
      return next;
    });
  }, []);

  const value = useMemo<AuthState>(
    () => ({ user, loading, configured: isFirebaseConfigured, signInEmail, signUpEmail, signInGoogle, signOutUser, completeOnboarding }),
    [user, loading, signInEmail, signUpEmail, signInGoogle, signOutUser, completeOnboarding],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

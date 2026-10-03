import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
  type Auth,
} from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// Firebase is initialised lazily from VITE_* public config. When the config is
// absent (the default for a fresh clone) `isFirebaseConfigured` stays false and
// the app runs in local demo mode — AuthContext and the API client both fall
// back to deterministic behaviour. No secret is ever bundled: only the public
// web config, which Firebase explicitly designs to be shipped to clients.

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

export const isFirebaseConfigured = Boolean(config.apiKey && config.projectId && config.appId);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(config as Record<string, string>);
    auth = getAuth(app);
    db = getFirestore(app);
    // Session persistence across reloads.
    void setPersistence(auth, browserLocalPersistence).catch(() => undefined);
  } catch (err) {
    // Misconfiguration should never crash the app — degrade to demo mode.
    console.warn('[regnify] Firebase init failed, falling back to demo mode:', err);
    app = null;
    auth = null;
    db = null;
  }
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { app, auth, db };

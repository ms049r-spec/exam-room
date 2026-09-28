import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import appletConfig from '../../firebase-applet-config.json';

const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : (process.env as any) || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || appletConfig.apiKey || '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || appletConfig.authDomain || '',
  projectId: env.VITE_FIREBASE_PROJECT_ID || appletConfig.projectId || '',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || appletConfig.storageBucket || '',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || appletConfig.messagingSenderId || '',
  appId: env.VITE_FIREBASE_APP_ID || appletConfig.appId || ''
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (err) {
    console.warn('Firebase initialization warning:', err);
  }
}

export { app, auth, db, firebaseConfig };

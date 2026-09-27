import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './firebase';
import { createOrUpdateUserProfile } from './firestore';
import { examDefinitions } from '../data/questions/sampleExams';

export function formatAuthError(error: unknown): string {
  if (!error || typeof error !== 'object') {
    return 'An unexpected authentication error occurred.';
  }

  const err = error as { code?: string; message?: string };
  switch (err.code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled. Please contact support.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Please try again later or reset your password.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    default:
      return err.message || 'Authentication failed. Please try again.';
  }
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName?: string,
  leaderboardOptIn: boolean = false
): Promise<User> {
  if (!auth || !isFirebaseConfigured) {
    throw new Error('Authentication is unavailable. Please verify your connection.');
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const user = userCredential.user;
  const cleanName = displayName?.trim() || email.split('@')[0];

  if (cleanName) {
    try {
      await updateProfile(user, { displayName: cleanName });
    } catch {
      // Profile update non-fatal
    }
  }

  // Create initial user document in Firestore with canonical leaderboardOptIn preference
  try {
    await createOrUpdateUserProfile(user.uid, {
      email: user.email || email,
      displayName: cleanName,
      leaderboardOptIn: Boolean(leaderboardOptIn),
      leaderboardDisplayName: cleanName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Initial profile doc sync deferred:', err);
  }

  return user;
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  if (!auth || !isFirebaseConfigured) {
    throw new Error('Firebase configuration missing. Please verify your environment variables.');
  }

  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
  const user = userCredential.user;

  // Touch updatedAt
  try {
    await createOrUpdateUserProfile(user.uid, {
      email: user.email || email,
      displayName: user.displayName || email.split('@')[0],
      updatedAt: new Date().toISOString()
    });
  } catch {
    // Non-fatal
  }

  return user;
}

export async function signOutUser(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  if (!auth || !isFirebaseConfigured) {
    throw new Error('Firebase configuration missing. Please verify your environment variables.');
  }
  await sendPasswordResetEmail(auth, email.trim());
}

export async function updateUserDisplayName(
  user: User,
  newDisplayName: string
): Promise<void> {
  const cleanName = newDisplayName.trim();
  if (!cleanName) return;

  // 1. Update Firebase Auth profile
  await updateProfile(user, { displayName: cleanName });

  // 2. Update Firestore user profile
  await createOrUpdateUserProfile(user.uid, {
    displayName: cleanName,
    updatedAt: new Date().toISOString()
  });

  // 3. If opted into leaderboard, update existing leaderboard entries & settings
  try {
    if (db && isFirebaseConfigured) {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists() && userSnap.data().leaderboardOptIn) {
        await setDoc(userRef, { leaderboardDisplayName: cleanName }, { merge: true });

        const allExamIds = Array.from(
          new Set([...examDefinitions.map((e) => e.id), 'exam-excretory-34', 'exam-cell-cycle-5'])
        );
        for (const examId of allExamIds) {
          const entryRef = doc(db, 'leaderboards', examId, 'entries', user.uid);
          const snap = await getDoc(entryRef);
          if (snap.exists()) {
            await setDoc(entryRef, { displayName: cleanName }, { merge: true });
          }
        }
      }
    }
  } catch (err) {
    console.warn('Non-fatal leaderboard name update notice:', err);
  }
}


import {
  doc,
  collection,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { ExamResult, MistakeEntry, Question } from '../types/exam';
import { calculateAuraPoints } from '../utils/aura';
import { localStore } from '../storage/localStore';

export interface UserProfileData {
  email: string;
  displayName?: string;
  leaderboardOptIn?: boolean;
  leaderboardDisplayName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FirestoreAttemptData {
  id?: string;
  examId: string;
  examTitle: string;
  subject: string;
  score: number;
  maxScore?: number;
  percentage: number;
  correct: number;
  wrong: number;
  unattempted: number;
  accuracy: number;
  timeTaken: number;
  auraPoints: number;
  completedAt: number;
  answers: string | Record<string, number | number[]>;
  questions?: any[];
  incorrectQuestionIds?: string[];
  isTimed?: boolean;
}

export interface FirestoreBookmarkData {
  questionId: string;
  savedAt: number;
}

export interface FirestoreMistakeData {
  questionId: string;
  examId: string;
  savedAt: number;
  attempts: number;
  questionData?: any;
}

export interface FirestoreSavedQuestionData {
  questionId: string;
  savedAt: number;
}

/**
 * Standard parser to convert a raw Firestore attempt document to ExamResult.
 */
export function parseFirestoreAttempt(docId: string, data: FirestoreAttemptData): ExamResult {
  let parsedAnswers: Record<string, number | number[]> = {};
  try {
    parsedAnswers = typeof data.answers === 'string' ? JSON.parse(data.answers) : (data.answers || {});
  } catch {
    parsedAnswers = {};
  }

  const totalQuestions = (data.correct || 0) + (data.wrong || 0) + (data.unattempted || 0);

  return {
    id: docId,
    examId: data.examId,
    examTitle: data.examTitle,
    subject: data.subject,
    timestamp: data.completedAt || Date.now(),
    totalQuestions: totalQuestions || (data.questions ? data.questions.length : 0),
    attemptedCount: (data.correct || 0) + (data.wrong || 0),
    correctCount: data.correct || 0,
    wrongCount: data.wrong || 0,
    unattemptedCount: data.unattempted || 0,
    score: data.score || 0,
    maxScore: data.maxScore || (totalQuestions * 4),
    percentage: typeof data.percentage === 'number' ? data.percentage : 0,
    accuracy: typeof data.accuracy === 'number' ? data.accuracy : 0,
    timeTakenSeconds: data.timeTaken || 0,
    totalTimeSeconds: null,
    isTimed: data.isTimed || false,
    answers: parsedAnswers,
    questions: data.questions || [],
    incorrectQuestionIds: data.incorrectQuestionIds || [],
    topicBreakdown: {}
  };
}

// 1. User Profile Document
export async function createOrUpdateUserProfile(
  uid: string,
  data: Partial<UserProfileData>
): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  const userRef = doc(db, 'users', uid);
  const now = new Date().toISOString();
  const updatePayload: Record<string, any> = {
    ...data,
    updatedAt: now
  };
  if (data.createdAt) {
    updatePayload.createdAt = data.createdAt;
  }
  await setDoc(userRef, updatePayload, { merge: true });
}

export async function getUserProfile(uid: string): Promise<UserProfileData | null> {
  if (!db || !isFirebaseConfigured) return null;
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? (snap.data() as UserProfileData) : null;
}

// 2. Exam Attempts Subcollection: users/{uid}/attempts/{attemptId}
export async function saveAttemptToFirestore(
  uid: string,
  result: ExamResult,
  customAuraPoints?: number
): Promise<string> {
  if (!db || !isFirebaseConfigured) return result.id;

  const attemptId = result.id || `attempt_${Date.now()}`;
  const attemptRef = doc(db, 'users', uid, 'attempts', attemptId);

  const aura = calculateAuraPoints(result.percentage, result.score);
  const auraPointsValue = customAuraPoints !== undefined ? customAuraPoints : aura.points;

  const attemptDoc: FirestoreAttemptData = {
    id: attemptId,
    examId: result.examId,
    examTitle: result.examTitle,
    subject: result.subject,
    score: result.score,
    maxScore: result.maxScore,
    percentage: result.percentage,
    correct: result.correctCount,
    wrong: result.wrongCount,
    unattempted: result.unattemptedCount,
    accuracy: result.accuracy,
    timeTaken: result.timeTakenSeconds,
    auraPoints: auraPointsValue,
    completedAt: result.timestamp || Date.now(),
    answers: JSON.stringify(result.answers || {}),
    questions: result.questions || [],
    incorrectQuestionIds: result.incorrectQuestionIds || [],
    isTimed: result.isTimed
  };

  await setDoc(attemptRef, attemptDoc);

  // Sync mistakes in Firestore subcollection users/{uid}/mistakes
  if (result.incorrectQuestionIds && result.incorrectQuestionIds.length > 0) {
    const incorrectSet = new Set(result.incorrectQuestionIds);
    for (const q of result.questions) {
      if (incorrectSet.has(q.id)) {
        await saveMistakeToFirestore(uid, q.id, result.examId, 1, q);
      }
    }
  }

  // If question was answered correctly in this attempt, decrement or remove from mistakes
  if (result.answers) {
    const incorrectSet = new Set(result.incorrectQuestionIds || []);
    for (const q of result.questions) {
      if (!incorrectSet.has(q.id) && result.answers[q.id] !== undefined) {
        await decrementOrRemoveMistakeFromFirestore(uid, q.id);
      }
    }
  }

  return attemptId;
}

export async function getUserAttemptsFromFirestore(uid: string): Promise<ExamResult[]> {
  if (!db || !isFirebaseConfigured) return [];
  try {
    const attemptsCol = collection(db, 'users', uid, 'attempts');
    const snapshot = await getDocs(attemptsCol);

    const results = snapshot.docs.map((docSnap) => {
      return parseFirestoreAttempt(docSnap.id, docSnap.data() as FirestoreAttemptData);
    });
    results.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    return results;
  } catch (err) {
    console.warn('Failed to load attempts from Firestore:', err);
    return [];
  }
}

/**
 * Real-time listener for user attempts.
 * Returns unsubscribe function.
 */
export function listenToUserAttempts(
  uid: string,
  onUpdate: (attempts: ExamResult[]) => void,
  onError?: (err: Error) => void
): () => void {
  if (!db || !isFirebaseConfigured) {
    onUpdate([]);
    return () => {};
  }
  const attemptsCol = collection(db, 'users', uid, 'attempts');
  return onSnapshot(
    attemptsCol,
    (snapshot) => {
      const results = snapshot.docs.map((docSnap) => {
        return parseFirestoreAttempt(docSnap.id, docSnap.data() as FirestoreAttemptData);
      });
      results.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      onUpdate(results);
    },
    (err) => {
      console.warn('Realtime attempts listener error:', err);
      if (onError) onError(err);
    }
  );
}

// 3. Bookmarks & Saved Questions: users/{uid}/bookmarks/{questionId} & users/{uid}/savedQuestions/{questionId}
export async function saveBookmarkToFirestore(uid: string, questionId: string): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  const bookmarkRef = doc(db, 'users', uid, 'bookmarks', questionId);
  const savedRef = doc(db, 'users', uid, 'savedQuestions', questionId);
  const data: FirestoreBookmarkData = {
    questionId,
    savedAt: Date.now()
  };
  await Promise.all([
    setDoc(bookmarkRef, data),
    setDoc(savedRef, data)
  ]);
}

export async function removeBookmarkFromFirestore(uid: string, questionId: string): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  const bookmarkRef = doc(db, 'users', uid, 'bookmarks', questionId);
  const savedRef = doc(db, 'users', uid, 'savedQuestions', questionId);
  await Promise.all([
    deleteDoc(bookmarkRef),
    deleteDoc(savedRef)
  ]);
}

export async function getUserBookmarksFromFirestore(uid: string): Promise<string[]> {
  if (!db || !isFirebaseConfigured) return [];
  try {
    const colRef = collection(db, 'users', uid, 'bookmarks');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((docSnap) => docSnap.id);
  } catch (err) {
    console.warn('Failed to load bookmarks from Firestore:', err);
    return [];
  }
}

export function listenToUserBookmarks(
  uid: string,
  onUpdate: (bookmarks: string[]) => void,
  onError?: (err: Error) => void
): () => void {
  if (!db || !isFirebaseConfigured) {
    onUpdate([]);
    return () => {};
  }
  const colRef = collection(db, 'users', uid, 'bookmarks');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const ids = snapshot.docs.map((docSnap) => docSnap.id);
      onUpdate(ids);
    },
    (err) => {
      console.warn('Realtime bookmarks listener error:', err);
      if (onError) onError(err);
    }
  );
}

// 4. Saved Questions (synced with bookmarks)
export async function saveSavedQuestionToFirestore(uid: string, questionId: string): Promise<void> {
  return saveBookmarkToFirestore(uid, questionId);
}

export async function removeSavedQuestionFromFirestore(uid: string, questionId: string): Promise<void> {
  return removeBookmarkFromFirestore(uid, questionId);
}

export async function getUserSavedQuestionsFromFirestore(uid: string): Promise<string[]> {
  return getUserBookmarksFromFirestore(uid);
}

export function listenToUserSavedQuestions(
  uid: string,
  onUpdate: (saved: string[]) => void,
  onError?: (err: Error) => void
): () => void {
  return listenToUserBookmarks(uid, onUpdate, onError);
}

// 5. Mistakes: users/{uid}/mistakes/{questionId}
export async function saveMistakeToFirestore(
  uid: string,
  questionId: string,
  examId: string,
  attemptsCount: number = 1,
  questionData?: any
): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  const mistakeRef = doc(db, 'users', uid, 'mistakes', questionId);
  const existing = await getDoc(mistakeRef);
  const currentAttempts = existing.exists() ? (existing.data().attempts || 1) + 1 : attemptsCount;

  const data: FirestoreMistakeData = {
    questionId,
    examId,
    savedAt: Date.now(),
    attempts: currentAttempts,
    ...(questionData ? { questionData } : {})
  };
  await setDoc(mistakeRef, data, { merge: true });
}

export async function decrementOrRemoveMistakeFromFirestore(
  uid: string,
  questionId: string
): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  try {
    const mistakeRef = doc(db, 'users', uid, 'mistakes', questionId);
    const snap = await getDoc(mistakeRef);
    if (snap.exists()) {
      const data = snap.data();
      const attempts = data.attempts || 1;
      if (attempts <= 1) {
        await deleteDoc(mistakeRef);
      } else {
        await setDoc(mistakeRef, { attempts: attempts - 1 }, { merge: true });
      }
    }
  } catch (err) {
    console.warn('Failed to decrement mistake:', err);
  }
}

export async function removeMistakeFromFirestore(uid: string, questionId: string): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  const mistakeRef = doc(db, 'users', uid, 'mistakes', questionId);
  await deleteDoc(mistakeRef);
}

export async function clearUserMistakesFromFirestore(uid: string): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  try {
    const colRef = collection(db, 'users', uid, 'mistakes');
    const snapshot = await getDocs(colRef);
    const deletions = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
    await Promise.all(deletions);
  } catch (err) {
    console.warn('Failed to clear mistakes in Firestore:', err);
  }
}

export async function getUserMistakesFromFirestore(uid: string): Promise<Record<string, FirestoreMistakeData>> {
  if (!db || !isFirebaseConfigured) return {};
  try {
    const colRef = collection(db, 'users', uid, 'mistakes');
    const snapshot = await getDocs(colRef);
    const result: Record<string, FirestoreMistakeData> = {};
    snapshot.docs.forEach((docSnap) => {
      result[docSnap.id] = docSnap.data() as FirestoreMistakeData;
    });
    return result;
  } catch (err) {
    console.warn('Failed to load mistakes from Firestore:', err);
    return {};
  }
}

export function listenToUserMistakes(
  uid: string,
  onUpdate: (mistakes: Record<string, MistakeEntry>) => void,
  onError?: (err: Error) => void
): () => void {
  if (!db || !isFirebaseConfigured) {
    onUpdate({});
    return () => {};
  }
  const mistakesCol = collection(db, 'users', uid, 'mistakes');
  return onSnapshot(
    mistakesCol,
    (snapshot) => {
      const mistakesMap: Record<string, MistakeEntry> = {};
      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data() as FirestoreMistakeData;
        mistakesMap[docSnap.id] = {
          questionId: docSnap.id,
          wrongCount: data.attempts || 1,
          lastAttempt: data.savedAt || Date.now(),
          question: data.questionData || { id: docSnap.id, question: 'Question' }
        };
      });
      onUpdate(mistakesMap);
    },
    (err) => {
      console.warn('Realtime mistakes listener error:', err);
      if (onError) onError(err);
    }
  );
}

// 6. AUTOMATIC CLOUD SYNC & OFFLINE QUEUE
export async function saveAttemptAutomatically(
  uid: string,
  result: ExamResult,
  customAuraPoints?: number
): Promise<string> {
  const attemptId = result.id || `attempt_${Date.now()}`;

  if (!db || !isFirebaseConfigured || !navigator.onLine) {
    // Offline or DB not initialized: stage in user's scoped local pending queue
    localStore.addPendingAttempt(result, uid);
    return attemptId;
  }

  try {
    const savedId = await saveAttemptToFirestore(uid, result, customAuraPoints);
    localStore.removePendingAttempt(savedId, uid);
    return savedId;
  } catch (err) {
    console.warn('Network / Firestore write deferred to offline queue:', err);
    localStore.addPendingAttempt(result, uid);
    return attemptId;
  }
}

export async function flushPendingSyncs(uid: string): Promise<void> {
  if (!db || !isFirebaseConfigured || !navigator.onLine) return;

  try {
    const pendingAttempts = localStore.getPendingAttempts(uid);
    for (const attempt of pendingAttempts) {
      try {
        await saveAttemptToFirestore(uid, attempt);
        localStore.removePendingAttempt(attempt.id, uid);
      } catch (err) {
        console.warn(`Failed to flush pending attempt ${attempt.id}:`, err);
      }
    }

    const pendingBookmarks = localStore.getPendingBookmarks(uid);
    for (const b of pendingBookmarks) {
      try {
        if (b.action === 'add') {
          await saveBookmarkToFirestore(uid, b.questionId);
        } else {
          await removeBookmarkFromFirestore(uid, b.questionId);
        }
        localStore.removePendingBookmark(b.questionId, uid);
      } catch (err) {
        console.warn(`Failed to flush pending bookmark ${b.questionId}:`, err);
      }
    }
  } catch (err) {
    console.warn('Error during pending sync flush:', err);
  }
}

export async function syncBookmarkAction(
  uid: string | undefined,
  questionId: string,
  isBookmarked: boolean
): Promise<void> {
  if (!uid) return;

  if (!db || !isFirebaseConfigured || !navigator.onLine) {
    localStore.addPendingBookmark(questionId, isBookmarked ? 'add' : 'remove', uid);
    return;
  }

  try {
    if (isBookmarked) {
      await saveBookmarkToFirestore(uid, questionId);
    } else {
      await removeBookmarkFromFirestore(uid, questionId);
    }
    localStore.removePendingBookmark(questionId, uid);
  } catch (err) {
    console.warn('Bookmark sync deferred to offline queue:', err);
    localStore.addPendingBookmark(questionId, isBookmarked ? 'add' : 'remove', uid);
  }
}

// 7. USER CLOUD DATA SYNCHRONIZATION
export interface MigrationSummary {
  attemptsMigrated: number;
  bookmarksMigrated: number;
  mistakesMigrated: number;
}

/**
 * Backward-compatible wrapper for user data sync.
 * Does NOT perform unsafe cross-account migrations.
 */
export async function syncUserData(uid: string): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  try {
    await flushPendingSyncs(uid);
  } catch (err) {
    console.warn('Error during pending sync flush:', err);
  }
}

export async function autoSyncUserData(uid: string): Promise<MigrationSummary | null> {
  await syncUserData(uid);
  return null;
}

export function hasUnmigratedLocalData(_uid: string): boolean {
  return false;
}



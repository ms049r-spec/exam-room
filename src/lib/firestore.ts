import {
  doc,
  collection,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { ExamResult } from '../types/exam';
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

  // Sync mistakes in Firestore
  if (result.incorrectQuestionIds && result.incorrectQuestionIds.length > 0) {
    const incorrectSet = new Set(result.incorrectQuestionIds);
    for (const q of result.questions) {
      if (incorrectSet.has(q.id)) {
        await saveMistakeToFirestore(uid, q.id, result.examId, 1, q);
      }
    }
  }

  return attemptId;
}

export async function getUserAttemptsFromFirestore(uid: string): Promise<ExamResult[]> {
  if (!db || !isFirebaseConfigured) return [];
  try {
    const attemptsCol = collection(db, 'users', uid, 'attempts');
    const q = query(attemptsCol, orderBy('completedAt', 'desc'), limit(100));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as FirestoreAttemptData;
      let parsedAnswers: Record<string, number | number[]> = {};
      try {
        parsedAnswers = typeof data.answers === 'string' ? JSON.parse(data.answers) : (data.answers || {});
      } catch {
        parsedAnswers = {};
      }

      const totalQuestions = (data.correct || 0) + (data.wrong || 0) + (data.unattempted || 0);

      const examResult: ExamResult = {
        id: docSnap.id,
        examId: data.examId,
        examTitle: data.examTitle,
        subject: data.subject,
        timestamp: data.completedAt,
        totalQuestions: totalQuestions || (data.questions ? data.questions.length : 0),
        attemptedCount: (data.correct || 0) + (data.wrong || 0),
        correctCount: data.correct,
        wrongCount: data.wrong,
        unattemptedCount: data.unattempted,
        score: data.score,
        maxScore: data.maxScore || (totalQuestions * 4),
        percentage: data.percentage,
        accuracy: data.accuracy,
        timeTakenSeconds: data.timeTaken,
        totalTimeSeconds: null,
        isTimed: data.isTimed || false,
        answers: parsedAnswers,
        questions: data.questions || [],
        incorrectQuestionIds: data.incorrectQuestionIds || [],
        topicBreakdown: {}
      };
      return examResult;
    });
  } catch (err) {
    console.warn('Failed to load attempts from Firestore:', err);
    return [];
  }
}

// 3. Bookmarks: users/{uid}/bookmarks/{questionId}
export async function saveBookmarkToFirestore(uid: string, questionId: string): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  const bookmarkRef = doc(db, 'users', uid, 'bookmarks', questionId);
  const data: FirestoreBookmarkData = {
    questionId,
    savedAt: Date.now()
  };
  await setDoc(bookmarkRef, data);
}

export async function removeBookmarkFromFirestore(uid: string, questionId: string): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  const bookmarkRef = doc(db, 'users', uid, 'bookmarks', questionId);
  await deleteDoc(bookmarkRef);
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

// 4. Mistakes: users/{uid}/mistakes/{questionId}
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

export async function removeMistakeFromFirestore(uid: string, questionId: string): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  const mistakeRef = doc(db, 'users', uid, 'mistakes', questionId);
  await deleteDoc(mistakeRef);
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

// 5. Saved Questions: users/{uid}/savedQuestions/{questionId}
export async function saveSavedQuestionToFirestore(uid: string, questionId: string): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  const ref = doc(db, 'users', uid, 'savedQuestions', questionId);
  const data: FirestoreSavedQuestionData = {
    questionId,
    savedAt: Date.now()
  };
  await setDoc(ref, data);
}

export async function removeSavedQuestionFromFirestore(uid: string, questionId: string): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  const ref = doc(db, 'users', uid, 'savedQuestions', questionId);
  await deleteDoc(ref);
}

export async function getUserSavedQuestionsFromFirestore(uid: string): Promise<string[]> {
  if (!db || !isFirebaseConfigured) return [];
  try {
    const colRef = collection(db, 'users', uid, 'savedQuestions');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((docSnap) => docSnap.id);
  } catch (err) {
    console.warn('Failed to load saved questions from Firestore:', err);
    return [];
  }
}

// 6. AUTOMATIC CLOUD SYNC & OFFLINE QUEUE
export async function saveAttemptAutomatically(
  uid: string,
  result: ExamResult,
  customAuraPoints?: number
): Promise<string> {
  // Always ensure it's saved locally first (already performed in exam engine)
  const attemptId = result.id || `attempt_${Date.now()}`;

  if (!db || !isFirebaseConfigured || !navigator.onLine) {
    // Offline or DB not initialized: stage in local pending queue
    localStore.addPendingAttempt(result);
    return attemptId;
  }

  try {
    const savedId = await saveAttemptToFirestore(uid, result, customAuraPoints);
    // Successfully saved to Firestore: remove from pending offline queue
    localStore.removePendingAttempt(savedId);
    return savedId;
  } catch (err) {
    console.warn('Network / Firestore write deferred to offline queue:', err);
    localStore.addPendingAttempt(result);
    return attemptId;
  }
}

export async function flushPendingSyncs(uid: string): Promise<void> {
  if (!db || !isFirebaseConfigured || !navigator.onLine) return;

  try {
    // Flush pending attempts
    const pendingAttempts = localStore.getPendingAttempts();
    for (const attempt of pendingAttempts) {
      try {
        await saveAttemptToFirestore(uid, attempt);
        localStore.removePendingAttempt(attempt.id);
      } catch (err) {
        console.warn(`Failed to flush pending attempt ${attempt.id}:`, err);
      }
    }

    // Flush pending bookmarks
    const pendingBookmarks = localStore.getPendingBookmarks();
    for (const b of pendingBookmarks) {
      try {
        if (b.action === 'add') {
          await saveBookmarkToFirestore(uid, b.questionId);
        } else {
          await removeBookmarkFromFirestore(uid, b.questionId);
        }
        localStore.removePendingBookmark(b.questionId);
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
    localStore.addPendingBookmark(questionId, isBookmarked ? 'add' : 'remove');
    return;
  }

  try {
    if (isBookmarked) {
      await saveBookmarkToFirestore(uid, questionId);
    } else {
      await removeBookmarkFromFirestore(uid, questionId);
    }
    localStore.removePendingBookmark(questionId);
  } catch (err) {
    console.warn('Bookmark sync deferred to offline queue:', err);
    localStore.addPendingBookmark(questionId, isBookmarked ? 'add' : 'remove');
  }
}

// 7. SYNC / MIGRATION: Local Storage -> Firestore
export interface MigrationSummary {
  attemptsMigrated: number;
  bookmarksMigrated: number;
  mistakesMigrated: number;
}

export async function migrateLocalDataToFirestore(uid: string): Promise<MigrationSummary> {
  const summary: MigrationSummary = {
    attemptsMigrated: 0,
    bookmarksMigrated: 0,
    mistakesMigrated: 0
  };

  if (!db || !isFirebaseConfigured) return summary;

  try {
    // 1. Migrate Local Exam History
    const localHistory = localStore.getHistory();
    if (localHistory.length > 0) {
      // Fetch existing cloud attempts to prevent duplicates
      const cloudAttempts = await getUserAttemptsFromFirestore(uid);
      const existingTimestamps = new Set(cloudAttempts.map((a) => a.timestamp));
      const existingIds = new Set(cloudAttempts.map((a) => a.id));

      for (const attempt of localHistory) {
        // Skip if already in Firestore
        if (existingIds.has(attempt.id) || existingTimestamps.has(attempt.timestamp)) {
          continue;
        }
        await saveAttemptToFirestore(uid, attempt);
        summary.attemptsMigrated++;
      }
    }

    // 2. Migrate Bookmarks
    const localBookmarks = localStore.getBookmarks();
    if (localBookmarks.length > 0) {
      const cloudBookmarks = await getUserBookmarksFromFirestore(uid);
      const cloudSet = new Set(cloudBookmarks);
      for (const qId of localBookmarks) {
        if (!cloudSet.has(qId)) {
          await saveBookmarkToFirestore(uid, qId);
          summary.bookmarksMigrated++;
        }
      }
    }

    // 3. Migrate Mistakes
    const localMistakes = localStore.getMistakesList();
    if (localMistakes.length > 0) {
      const cloudMistakes = await getUserMistakesFromFirestore(uid);
      for (const m of localMistakes) {
        if (!cloudMistakes[m.questionId]) {
          await saveMistakeToFirestore(uid, m.questionId, 'local-migrated', m.wrongCount, m.question);
          summary.mistakesMigrated++;
        }
      }
    }

    // Flush any pending sync queue items as well
    await flushPendingSyncs(uid);

    // Mark migration completed in local storage for this UID so we don't repeat
    localStorage.setItem(`exam_room_migrated_${uid}`, 'true');
  } catch (err) {
    console.error('Migration to Firestore error:', err);
  }

  return summary;
}

export async function autoSyncUserData(uid: string): Promise<MigrationSummary | null> {
  if (hasUnmigratedLocalData(uid)) {
    return await migrateLocalDataToFirestore(uid);
  }
  await flushPendingSyncs(uid);
  return null;
}

export function hasUnmigratedLocalData(uid: string): boolean {
  if (localStorage.getItem(`exam_room_migrated_${uid}`) === 'true') {
    return false;
  }
  const history = localStore.getHistory();
  const bookmarks = localStore.getBookmarks();
  const mistakes = localStore.getMistakesList();
  return history.length > 0 || bookmarks.length > 0 || mistakes.length > 0;
}

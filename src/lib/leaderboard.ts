import {
  doc,
  collection,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { getUserAttemptsFromFirestore } from './firestore';
import { ExamResult } from '../types/exam';
import { calculateAuraPoints } from '../utils/aura';
import { examDefinitions } from '../data/questions/sampleExams';

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  bestScore: number;
  maxScore: number;
  bestPercentage: number;
  timeTaken: number;
  auraPoints: number;
  updatedAt: number;
  rank?: number;
}

export interface UserLeaderboardSettings {
  leaderboardOptIn: boolean;
  leaderboardEnabled: boolean;
  leaderboardDisplayName: string;
}

/**
 * Fetch leaderboard entries for a specific exam.
 * Publicly readable by anonymous and signed-in users.
 */
export async function getLeaderboardEntries(examId: string): Promise<LeaderboardEntry[]> {
  if (!db || !isFirebaseConfigured) return [];

  try {
    const entriesCol = collection(db, 'leaderboards', examId, 'entries');
    const snapshot = await getDocs(entriesCol);

    const entries: LeaderboardEntry[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        uid: docSnap.id,
        displayName: data.displayName || 'Anonymous Student',
        bestScore: typeof data.bestScore === 'number' ? data.bestScore : 0,
        maxScore: typeof data.maxScore === 'number' ? data.maxScore : 0,
        bestPercentage: typeof data.bestPercentage === 'number' ? data.bestPercentage : 0,
        timeTaken: typeof data.timeTaken === 'number' ? data.timeTaken : 0,
        auraPoints: typeof data.auraPoints === 'number' ? data.auraPoints : 0,
        updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : 0
      };
    });

    // Ranking algorithm:
    // 1. Highest percentage
    // 2. Highest raw score (Tie breaker 1)
    // 3. Lower time taken (Tie breaker 2)
    // 4. Earliest completion (Tie breaker 3)
    entries.sort((a, b) => {
      if (b.bestPercentage !== a.bestPercentage) {
        return b.bestPercentage - a.bestPercentage;
      }
      if (b.bestScore !== a.bestScore) {
        return b.bestScore - a.bestScore;
      }
      if (a.timeTaken > 0 && b.timeTaken > 0 && a.timeTaken !== b.timeTaken) {
        return a.timeTaken - b.timeTaken;
      }
      return a.updatedAt - b.updatedAt;
    });

    // Assign 1-based rank
    return entries.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
  } catch (err: any) {
    console.warn('Error fetching leaderboard entries:', {
      code: err?.code,
      message: err?.message
    });
    return [];
  }
}

/**
 * Get user's current leaderboard privacy settings.
 */
export async function getUserLeaderboardSettings(uid: string): Promise<UserLeaderboardSettings> {
  if (!db || !isFirebaseConfigured) {
    return { leaderboardOptIn: false, leaderboardEnabled: false, leaderboardDisplayName: '' };
  }

  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      const isOptedIn = data.leaderboardEnabled !== undefined
        ? Boolean(data.leaderboardEnabled)
        : Boolean(data.leaderboardOptIn);

      return {
        leaderboardOptIn: isOptedIn,
        leaderboardEnabled: isOptedIn,
        leaderboardDisplayName: data.leaderboardDisplayName || data.displayName || ''
      };
    }
  } catch (err: any) {
    console.warn('Error fetching user leaderboard settings:', {
      code: err?.code,
      message: err?.message
    });
  }

  return { leaderboardOptIn: false, leaderboardEnabled: false, leaderboardDisplayName: '' };
}

/**
 * Update leaderboard opt-in status and public display name.
 * Stores both `leaderboardOptIn` and `leaderboardEnabled` for maximum compatibility.
 * Step 1: Persist user preference on `users/{uid}`.
 * Step 2: Safely update or remove public entries without failing profile setting.
 */
export async function updateLeaderboardSettings(
  uid: string,
  optIn: boolean,
  displayName: string,
  userAttempts?: ExamResult[]
): Promise<void> {
  if (!db || !isFirebaseConfigured) return;

  const cleanName = displayName.trim() || 'Student';
  const userRef = doc(db, 'users', uid);

  // Step 1: Update primary user profile preference (MUST succeed)
  try {
    await setDoc(
      userRef,
      {
        leaderboardOptIn: Boolean(optIn),
        leaderboardEnabled: Boolean(optIn),
        leaderboardDisplayName: cleanName,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (err: any) {
    console.error('Firestore user profile preference write failed:', {
      code: err?.code,
      message: err?.message,
      uid
    });
    throw err;
  }

  // Step 2: Synchronize public leaderboard entries (Secondary - completely non-fatal)
  try {
    const allExamIds = Array.from(
      new Set([...examDefinitions.map((e) => e.id), 'exam-excretory-34', 'exam-cell-cycle-5'])
    );

    if (!optIn) {
      // Turned OFF: Safely remove entries across public leaderboards
      for (const examId of allExamIds) {
        try {
          const entryRef = doc(db, 'leaderboards', examId, 'entries', uid);
          await deleteDoc(entryRef);
        } catch (err: any) {
          console.warn(`Non-fatal: could not remove leaderboard entry for ${examId}:`, {
            code: err?.code,
            message: err?.message
          });
        }
      }
    } else {
      // Turned ON: Publish eligible best exam attempts if user has any
      const attempts = userAttempts !== undefined ? userAttempts : await getUserAttemptsFromFirestore(uid);

      if (attempts && attempts.length > 0 && cleanName) {
        const bestByExam = new Map<string, ExamResult>();
        for (const attempt of attempts) {
          if (!attempt.examId) continue;
          const currentBest = bestByExam.get(attempt.examId);
          if (!currentBest) {
            bestByExam.set(attempt.examId, attempt);
          } else {
            const isBetter =
              attempt.percentage > currentBest.percentage ||
              (attempt.percentage === currentBest.percentage && attempt.score > currentBest.score) ||
              (attempt.percentage === currentBest.percentage &&
                attempt.score === currentBest.score &&
                attempt.timeTakenSeconds < currentBest.timeTakenSeconds);
            if (isBetter) {
              bestByExam.set(attempt.examId, attempt);
            }
          }
        }

        for (const [examId, bestAttempt] of bestByExam.entries()) {
          try {
            const aura = calculateAuraPoints(bestAttempt.percentage, bestAttempt.score);
            const entryRef = doc(db, 'leaderboards', examId, 'entries', uid);
            await setDoc(entryRef, {
              displayName: cleanName,
              bestScore: bestAttempt.score,
              maxScore: bestAttempt.maxScore || 0,
              bestPercentage: bestAttempt.percentage,
              timeTaken: bestAttempt.timeTakenSeconds || 0,
              auraPoints: aura.points,
              updatedAt: Date.now()
            });
          } catch (err: any) {
            console.warn(`Non-fatal: could not write leaderboard entry for ${examId}:`, {
              code: err?.code,
              message: err?.message
            });
          }
        }
      }
    }
  } catch (syncErr: any) {
    console.warn('Non-fatal error in secondary leaderboard entries sync:', {
      code: syncErr?.code,
      message: syncErr?.message
    });
  }
}

/**
 * Called after exam completion.
 * If user has opted in to leaderboards, checks their existing best score for this exam
 * and updates only if the new attempt is strictly better.
 * Leaderboard synchronization is secondary and will NEVER throw or block exam results.
 */
export async function maybeUpdateLeaderboardOnExamComplete(
  uid: string,
  result: ExamResult,
  customAuraPoints?: number
): Promise<boolean> {
  if (!db || !isFirebaseConfigured || !result.examId) return false;

  try {
    const settings = await getUserLeaderboardSettings(uid);
    if (!settings.leaderboardOptIn || !settings.leaderboardDisplayName) {
      return false;
    }

    const aura = calculateAuraPoints(result.percentage, result.score);
    const auraPointsValue = customAuraPoints !== undefined ? customAuraPoints : aura.points;

    const entryRef = doc(db, 'leaderboards', result.examId, 'entries', uid);
    const existingSnap = await getDoc(entryRef);

    if (existingSnap.exists()) {
      const existing = existingSnap.data() as LeaderboardEntry;
      const prevPercentage = existing.bestPercentage || 0;
      const prevScore = existing.bestScore || 0;
      const prevTime = existing.timeTaken || Infinity;

      // Determine if current attempt is better:
      const isHigherPercentage = result.percentage > prevPercentage;
      const isSamePercentageHigherScore =
        result.percentage === prevPercentage && result.score > prevScore;
      const isSamePercentageAndScoreFaster =
        result.percentage === prevPercentage &&
        result.score === prevScore &&
        result.timeTakenSeconds < prevTime;

      if (!isHigherPercentage && !isSamePercentageHigherScore && !isSamePercentageAndScoreFaster) {
        // Existing score is better or identical; keep best result
        return false;
      }
    }

    // Write / update best entry
    const entryData = {
      displayName: settings.leaderboardDisplayName,
      bestScore: result.score,
      maxScore: result.maxScore || 0,
      bestPercentage: result.percentage,
      timeTaken: result.timeTakenSeconds || 0,
      auraPoints: auraPointsValue,
      updatedAt: Date.now()
    };

    await setDoc(entryRef, entryData);
    return true;
  } catch (err) {
    console.warn('Leaderboard background sync notice (non-fatal):', err);
    return false;
  }
}

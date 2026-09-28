import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { ExamResult, MistakeEntry } from '../types/exam';
import {
  listenToUserAttempts,
  listenToUserBookmarks,
  listenToUserMistakes,
  saveAttemptToFirestore,
  saveBookmarkToFirestore,
  removeBookmarkFromFirestore,
  clearUserMistakesFromFirestore
} from '../lib/firestore';
import { maybeUpdateLeaderboardOnExamComplete } from '../lib/leaderboard';
import { localStore } from '../storage/localStore';

export interface AnalyticsStats {
  totalAttempts: number;
  averageScorePercent: number;
  bestScorePercent: number;
  averageAccuracy: number;
  totalQuestionsAnswered: number;
  totalTimeSpentMinutes: number;
  subjectStats: Record<string, { attempts: number; avgPercentage: number; accuracy: number }>;
  chapterStats: Record<string, { attempts: number; avgPercentage: number; accuracy: number }>;
  recentAttempts: ExamResult[];
}

export function computeAnalytics(history: ExamResult[]): AnalyticsStats {
  if (!history || history.length === 0) {
    return {
      totalAttempts: 0,
      averageScorePercent: 0,
      bestScorePercent: 0,
      averageAccuracy: 0,
      totalQuestionsAnswered: 0,
      totalTimeSpentMinutes: 0,
      subjectStats: {},
      chapterStats: {},
      recentAttempts: []
    };
  }

  const totalAttempts = history.length;
  const totalPercentage = history.reduce((sum, h) => sum + (h.percentage || 0), 0);
  const averageScorePercent = Math.round((totalPercentage / totalAttempts) * 10) / 10;
  const bestScorePercent = Math.round(Math.max(...history.map((h) => h.percentage || 0)) * 10) / 10;

  const totalAttempted = history.reduce((sum, h) => sum + (h.attemptedCount || 0), 0);
  const totalCorrect = history.reduce((sum, h) => sum + (h.correctCount || 0), 0);
  const averageAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 1000) / 10 : 0;

  const totalQuestionsAnswered = totalAttempted;
  const totalTimeSpentSeconds = history.reduce((sum, h) => sum + (h.timeTakenSeconds || 0), 0);
  const totalTimeSpentMinutes = Math.round(totalTimeSpentSeconds / 60);

  const subjectMap: Record<string, { count: number; totalPct: number; correct: number; attempted: number }> = {};
  const chapterMap: Record<string, { count: number; totalPct: number; correct: number; attempted: number }> = {};

  history.forEach((h) => {
    if (!subjectMap[h.subject]) {
      subjectMap[h.subject] = { count: 0, totalPct: 0, correct: 0, attempted: 0 };
    }
    subjectMap[h.subject].count += 1;
    subjectMap[h.subject].totalPct += (h.percentage || 0);
    subjectMap[h.subject].correct += (h.correctCount || 0);
    subjectMap[h.subject].attempted += (h.attemptedCount || 0);

    const chap = h.chapter || h.examTitle;
    if (!chapterMap[chap]) {
      chapterMap[chap] = { count: 0, totalPct: 0, correct: 0, attempted: 0 };
    }
    chapterMap[chap].count += 1;
    chapterMap[chap].totalPct += (h.percentage || 0);
    chapterMap[chap].correct += (h.correctCount || 0);
    chapterMap[chap].attempted += (h.attemptedCount || 0);
  });

  const subjectStats: Record<string, { attempts: number; avgPercentage: number; accuracy: number }> = {};
  Object.keys(subjectMap).forEach((subj) => {
    const data = subjectMap[subj];
    subjectStats[subj] = {
      attempts: data.count,
      avgPercentage: Math.round((data.totalPct / data.count) * 10) / 10,
      accuracy: data.attempted > 0 ? Math.round((data.correct / data.attempted) * 100) : 0
    };
  });

  const chapterStats: Record<string, { attempts: number; avgPercentage: number; accuracy: number }> = {};
  Object.keys(chapterMap).forEach((chap) => {
    const data = chapterMap[chap];
    chapterStats[chap] = {
      attempts: data.count,
      avgPercentage: Math.round((data.totalPct / data.count) * 10) / 10,
      accuracy: data.attempted > 0 ? Math.round((data.correct / data.attempted) * 100) : 0
    };
  });

  return {
    totalAttempts,
    averageScorePercent,
    bestScorePercent,
    averageAccuracy,
    totalQuestionsAnswered,
    totalTimeSpentMinutes,
    subjectStats,
    chapterStats,
    recentAttempts: history.slice(0, 10)
  };
}

interface UserDataContextType {
  attempts: ExamResult[];
  bookmarks: string[];
  mistakes: Record<string, MistakeEntry>;
  mistakesList: MistakeEntry[];
  stats: AnalyticsStats;
  loading: boolean;
  isBookmarked: (questionId: string) => boolean;
  toggleBookmark: (questionId: string) => Promise<boolean>;
  recordExamResult: (result: ExamResult) => Promise<string>;
  clearMistakes: () => Promise<void>;
  getExamBestScore: (examId: string) => number | null;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();

  // Firestore-backed state for authenticated users
  const [cloudAttempts, setCloudAttempts] = useState<ExamResult[]>([]);
  const [cloudBookmarks, setCloudBookmarks] = useState<string[]>([]);
  const [cloudMistakes, setCloudMistakes] = useState<Record<string, MistakeEntry>>({});
  const [cloudLoading, setCloudLoading] = useState<boolean>(true);

  // Local state for anonymous users
  const [anonVersion, setAnonVersion] = useState<number>(0);

  // Subscribe to changes when authenticated vs anonymous
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      // Clear authenticated state immediately on logout / anonymous
      setCloudAttempts([]);
      setCloudBookmarks([]);
      setCloudMistakes({});
      setCloudLoading(false);

      // Listen to local store events for anonymous users
      const unsub = localStore.subscribe(() => {
        setAnonVersion((v) => v + 1);
      });
      return () => unsub();
    }

    // Authenticated: establish direct real-time Firestore listeners for this specific UID
    setCloudLoading(true);

    const unsubAttempts = listenToUserAttempts(
      user.uid,
      (attempts) => {
        setCloudAttempts(attempts);
        setCloudLoading(false);
      },
      () => setCloudLoading(false)
    );

    const unsubBookmarks = listenToUserBookmarks(
      user.uid,
      (bookmarks) => {
        setCloudBookmarks(bookmarks);
      }
    );

    const unsubMistakes = listenToUserMistakes(
      user.uid,
      (mistakes) => {
        setCloudMistakes(mistakes);
      }
    );

    return () => {
      unsubAttempts();
      unsubBookmarks();
      unsubMistakes();
    };
  }, [user, authLoading]);

  // Read current active attempts based strictly on auth state
  const attempts = useMemo(() => {
    if (user) {
      // Authenticated: Firestore is the SINGLE source of truth.
      // Zero Firestore records means ZERO records! Never fall back to local storage.
      return cloudAttempts;
    }
    // Anonymous user: reads from anonymous store
    return localStore.getHistory(null);
  }, [user, cloudAttempts, anonVersion]);

  // Read active bookmarks
  const bookmarks = useMemo(() => {
    if (user) {
      return cloudBookmarks;
    }
    return localStore.getBookmarks(null);
  }, [user, cloudBookmarks, anonVersion]);

  // Read active mistakes
  const mistakes = useMemo(() => {
    if (user) {
      return cloudMistakes;
    }
    return localStore.getMistakes(null);
  }, [user, cloudMistakes, anonVersion]);

  const mistakesList = useMemo(() => {
    return Object.values(mistakes);
  }, [mistakes]);

  // Compute analytics dynamically from active attempts
  const stats = useMemo(() => {
    return computeAnalytics(attempts);
  }, [attempts]);

  const isBookmarked = useCallback(
    (questionId: string) => {
      return bookmarks.includes(questionId);
    },
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    async (questionId: string): Promise<boolean> => {
      if (user) {
        // Authenticated: Write directly to Firestore paths /users/{uid}/bookmarks and /users/{uid}/savedQuestions
        const currentlyBookmarked = cloudBookmarks.includes(questionId);
        if (currentlyBookmarked) {
          await removeBookmarkFromFirestore(user.uid, questionId);
          return false;
        } else {
          await saveBookmarkToFirestore(user.uid, questionId);
          return true;
        }
      } else {
        // Anonymous user: toggle in anonymous local storage
        const result = localStore.toggleBookmark(questionId, null);
        setAnonVersion((v) => v + 1);
        return result;
      }
    },
    [user, cloudBookmarks]
  );

  const recordExamResult = useCallback(
    async (result: ExamResult): Promise<string> => {
      const attemptId = result.id || `attempt_${Date.now()}`;
      const examResultWithId = { ...result, id: attemptId };

      if (user) {
        // Authenticated: Write directly to Firestore /users/{uid}/attempts/{attemptId}
        const savedId = await saveAttemptToFirestore(user.uid, examResultWithId);

        // Background leaderboard update if opted in
        maybeUpdateLeaderboardOnExamComplete(user.uid, examResultWithId).catch((err) => {
          console.warn('Leaderboard submission notice:', err);
        });

        return savedId;
      } else {
        // Anonymous user: save to anonymous local store
        localStore.saveResult(examResultWithId, null);
        setAnonVersion((v) => v + 1);
        return attemptId;
      }
    },
    [user]
  );

  const clearMistakes = useCallback(async (): Promise<void> => {
    if (user) {
      await clearUserMistakesFromFirestore(user.uid);
    } else {
      localStore.clearMistakes(null);
      setAnonVersion((v) => v + 1);
    }
  }, [user]);

  const getExamBestScore = useCallback(
    (examId: string): number | null => {
      const matching = attempts.filter((h) => h.examId === examId);
      if (matching.length === 0) return null;
      return Math.round(Math.max(...matching.map((h) => h.percentage || 0)) * 10) / 10;
    },
    [attempts]
  );

  const value: UserDataContextType = {
    attempts,
    bookmarks,
    mistakes,
    mistakesList,
    stats,
    loading: authLoading || (user ? cloudLoading : false),
    isBookmarked,
    toggleBookmark,
    recordExamResult,
    clearMistakes,
    getExamBestScore
  };

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
};

export function useUserData(): UserDataContextType {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
}

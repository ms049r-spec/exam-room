import { ExamResult, ActiveExamSession, MistakeEntry, Question } from '../types/exam';

const STORAGE_KEYS = {
  HISTORY: 'exam_room_history_v1',
  BOOKMARKS: 'exam_room_bookmarks_v1',
  MISTAKES: 'exam_room_mistakes_v1',
  ACTIVE_SESSION: 'exam_room_active_session_v1',
  CUSTOM_EXAMS: 'exam_room_custom_exams_v1',
  PENDING_SYNC_ATTEMPTS: 'exam_room_pending_attempts_v1',
  PENDING_SYNC_BOOKMARKS: 'exam_room_pending_bookmarks_v1'
};

export const localStore = {
  // Offline Sync Queue
  getPendingAttempts(): ExamResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PENDING_SYNC_ATTEMPTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addPendingAttempt(result: ExamResult): void {
    try {
      const current = this.getPendingAttempts();
      if (!current.some((a) => a.id === result.id)) {
        localStorage.setItem(
          STORAGE_KEYS.PENDING_SYNC_ATTEMPTS,
          JSON.stringify([...current, result])
        );
      }
    } catch (err) {
      console.error('Failed to add pending attempt to offline queue', err);
    }
  },

  removePendingAttempt(attemptId: string): void {
    try {
      const current = this.getPendingAttempts();
      const filtered = current.filter((a) => a.id !== attemptId);
      localStorage.setItem(STORAGE_KEYS.PENDING_SYNC_ATTEMPTS, JSON.stringify(filtered));
    } catch (err) {
      console.error('Failed to remove pending attempt', err);
    }
  },

  getPendingBookmarks(): { questionId: string; action: 'add' | 'remove' }[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PENDING_SYNC_BOOKMARKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addPendingBookmark(questionId: string, action: 'add' | 'remove'): void {
    try {
      const current = this.getPendingBookmarks().filter((b) => b.questionId !== questionId);
      localStorage.setItem(
        STORAGE_KEYS.PENDING_SYNC_BOOKMARKS,
        JSON.stringify([...current, { questionId, action }])
      );
    } catch (err) {
      console.error('Failed to add pending bookmark', err);
    }
  },

  removePendingBookmark(questionId: string): void {
    try {
      const current = this.getPendingBookmarks().filter((b) => b.questionId !== questionId);
      localStorage.setItem(STORAGE_KEYS.PENDING_SYNC_BOOKMARKS, JSON.stringify(current));
    } catch (err) {
      console.error('Failed to remove pending bookmark', err);
    }
  },

  // Exam History
  getHistory(): ExamResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveResult(result: ExamResult): void {
    try {
      const history = this.getHistory();
      const updated = [result, ...history].slice(0, 100); // keep last 100
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));

      // Also update mistakes pool
      this.recordMistakes(result);
    } catch (err) {
      console.error('Failed to save exam result locally', err);
    }
  },

  // Active Session (Accidental refresh protection)
  getActiveSession(): ActiveExamSession | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
      if (!data) return null;
      const session: ActiveExamSession = JSON.parse(data);
      // If timed and target end time already expired significantly (> 1 hr), clear it
      if (session.targetEndTime && Date.now() > session.targetEndTime + 3600000) {
        this.clearActiveSession();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  },

  saveActiveSession(session: ActiveExamSession): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
    } catch (err) {
      console.error('Failed to persist active session', err);
    }
  },

  clearActiveSession(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    } catch (err) {
      console.error('Failed to clear active session', err);
    }
  },

  // Bookmarks
  getBookmarks(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleBookmark(questionId: string): boolean {
    try {
      const bookmarks = this.getBookmarks();
      const exists = bookmarks.includes(questionId);
      const updated = exists
        ? bookmarks.filter((id) => id !== questionId)
        : [...bookmarks, questionId];
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
      return !exists;
    } catch {
      return false;
    }
  },

  isBookmarked(questionId: string): boolean {
    return this.getBookmarks().includes(questionId);
  },

  // Mistakes Pool
  getMistakes(): Record<string, MistakeEntry> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MISTAKES);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  getMistakesList(): MistakeEntry[] {
    return Object.values(this.getMistakes());
  },

  getExamBestScore(examId: string): number | null {
    const history = this.getHistory().filter((h) => h.examId === examId);
    if (history.length === 0) return null;
    return Math.round(Math.max(...history.map((h) => h.percentage)) * 10) / 10;
  },

  recordMistakes(result: ExamResult): void {
    try {
      const mistakes = this.getMistakes();
      const incorrectSet = new Set(result.incorrectQuestionIds);

      // For every incorrect question, record or increment
      result.questions.forEach((q) => {
        if (incorrectSet.has(q.id)) {
          const existing = mistakes[q.id];
          mistakes[q.id] = {
            questionId: q.id,
            wrongCount: (existing?.wrongCount || 0) + 1,
            lastAttempt: Date.now(),
            question: q
          };
        } else if (result.answers[q.id] !== undefined) {
          // If the user answered it correctly in this attempt, decrement wrong count or clear if mastered
          if (mistakes[q.id]) {
            mistakes[q.id].wrongCount = Math.max(0, mistakes[q.id].wrongCount - 1);
            if (mistakes[q.id].wrongCount === 0) {
              delete mistakes[q.id];
            }
          }
        }
      });

      localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(mistakes));
    } catch (err) {
      console.error('Failed to update mistakes store', err);
    }
  },

  clearMistakes(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.MISTAKES);
    } catch (err) {
      console.error('Failed to clear mistakes', err);
    }
  },

  // Analytics Computation
  getAnalytics() {
    const history = this.getHistory();
    if (history.length === 0) {
      return {
        totalAttempts: 0,
        averageScorePercent: 0,
        bestScorePercent: 0,
        averageAccuracy: 0,
        totalQuestionsAnswered: 0,
        totalTimeSpentMinutes: 0,
        subjectStats: {} as Record<string, { attempts: number; avgPercentage: number; accuracy: number }>,
        chapterStats: {} as Record<string, { attempts: number; avgPercentage: number; accuracy: number }>,
        recentAttempts: []
      };
    }

    const totalAttempts = history.length;
    const totalPercentage = history.reduce((sum, h) => sum + h.percentage, 0);
    const averageScorePercent = Math.round((totalPercentage / totalAttempts) * 10) / 10;
    const bestScorePercent = Math.round(Math.max(...history.map((h) => h.percentage)) * 10) / 10;

    const totalAttempted = history.reduce((sum, h) => sum + h.attemptedCount, 0);
    const totalCorrect = history.reduce((sum, h) => sum + h.correctCount, 0);
    const averageAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 1000) / 10 : 0;

    const totalQuestionsAnswered = totalAttempted;
    const totalTimeSpentSeconds = history.reduce((sum, h) => sum + h.timeTakenSeconds, 0);
    const totalTimeSpentMinutes = Math.round(totalTimeSpentSeconds / 60);

    // Subject breakdown
    const subjectMap: Record<string, { count: number; totalPct: number; correct: number; attempted: number }> = {};
    const chapterMap: Record<string, { count: number; totalPct: number; correct: number; attempted: number }> = {};

    history.forEach((h) => {
      // Subject
      if (!subjectMap[h.subject]) {
        subjectMap[h.subject] = { count: 0, totalPct: 0, correct: 0, attempted: 0 };
      }
      subjectMap[h.subject].count += 1;
      subjectMap[h.subject].totalPct += h.percentage;
      subjectMap[h.subject].correct += h.correctCount;
      subjectMap[h.subject].attempted += h.attemptedCount;

      // Chapter
      const chap = h.chapter || h.examTitle;
      if (!chapterMap[chap]) {
        chapterMap[chap] = { count: 0, totalPct: 0, correct: 0, attempted: 0 };
      }
      chapterMap[chap].count += 1;
      chapterMap[chap].totalPct += h.percentage;
      chapterMap[chap].correct += h.correctCount;
      chapterMap[chap].attempted += h.attemptedCount;
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
};

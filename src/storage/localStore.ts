import { ExamResult, ActiveExamSession, MistakeEntry, Question } from '../types/exam';

// Active user ID for namespacing (null = anonymous session)
let currentUserId: string | null = null;
const listeners = new Set<() => void>();

function resolveUid(overrideUid?: string | null): string | null {
  return overrideUid !== undefined ? overrideUid : currentUserId;
}

function getScopedKey(subKey: string, uid: string | null): string {
  if (uid) {
    return `exam_room_user_${uid}_${subKey}`;
  }
  return `exam_room_anon_${subKey}`;
}

function readStorage(subKey: string, overrideUid?: string | null): string | null {
  const uid = resolveUid(overrideUid);
  if (uid) {
    // Authenticated user: STRICTLY isolated, only read their own key!
    return localStorage.getItem(`exam_room_user_${uid}_${subKey}`);
  }

  // Anonymous user: check anon key first
  const anonKey = `exam_room_anon_${subKey}`;
  const data = localStorage.getItem(anonKey);
  if (data !== null) return data;

  // Fallback map for anonymous legacy data to preserve pre-existing anonymous attempts
  const legacyMap: Record<string, string> = {
    history: 'exam_room_history_v1',
    bookmarks: 'exam_room_bookmarks_v1',
    mistakes: 'exam_room_mistakes_v1',
    active_session: 'exam_room_active_session_v1',
    custom_exams: 'exam_room_custom_exams_v1',
    pending_attempts: 'exam_room_pending_attempts_v1',
    pending_bookmarks: 'exam_room_pending_bookmarks_v1'
  };
  const legacyKey = legacyMap[subKey];
  return legacyKey ? localStorage.getItem(legacyKey) : null;
}

function writeStorage(subKey: string, value: string, overrideUid?: string | null): void {
  const uid = resolveUid(overrideUid);
  const key = getScopedKey(subKey, uid);
  localStorage.setItem(key, value);
}

function removeStorage(subKey: string, overrideUid?: string | null): void {
  const uid = resolveUid(overrideUid);
  const key = getScopedKey(subKey, uid);
  localStorage.removeItem(key);
}

export const localStore = {
  /**
   * Sets the active user namespace.
   * Passing a UID scopes all storage reads/writes to that specific authenticated account.
   * Passing null sets the store to the anonymous/local device namespace.
   */
  setUser(uid: string | null): void {
    if (currentUserId !== uid) {
      currentUserId = uid;
      this.notify();
    }
  },

  getCurrentUserId(): string | null {
    return currentUserId;
  },

  /**
   * Subscribe to storage / active namespace changes across the app.
   */
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  notify(): void {
    listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error in localStore subscriber:', err);
      }
    });
  },

  // Offline Sync Queue
  getPendingAttempts(uid?: string | null): ExamResult[] {
    try {
      const data = readStorage('pending_attempts', uid);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addPendingAttempt(result: ExamResult, uid?: string | null): void {
    try {
      const current = this.getPendingAttempts(uid);
      if (!current.some((a) => a.id === result.id)) {
        writeStorage('pending_attempts', JSON.stringify([...current, result]), uid);
      }
    } catch (err) {
      console.error('Failed to add pending attempt to offline queue', err);
    }
  },

  removePendingAttempt(attemptId: string, uid?: string | null): void {
    try {
      const current = this.getPendingAttempts(uid);
      const filtered = current.filter((a) => a.id !== attemptId);
      writeStorage('pending_attempts', JSON.stringify(filtered), uid);
    } catch (err) {
      console.error('Failed to remove pending attempt', err);
    }
  },

  clearPendingAttempts(uid?: string | null): void {
    try {
      removeStorage('pending_attempts', uid);
    } catch (err) {
      console.error('Failed to clear pending attempts', err);
    }
  },

  getPendingBookmarks(uid?: string | null): { questionId: string; action: 'add' | 'remove' }[] {
    try {
      const data = readStorage('pending_bookmarks', uid);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addPendingBookmark(questionId: string, action: 'add' | 'remove', uid?: string | null): void {
    try {
      const current = this.getPendingBookmarks(uid).filter((b) => b.questionId !== questionId);
      writeStorage(
        'pending_bookmarks',
        JSON.stringify([...current, { questionId, action }]),
        uid
      );
    } catch (err) {
      console.error('Failed to add pending bookmark', err);
    }
  },

  removePendingBookmark(questionId: string, uid?: string | null): void {
    try {
      const current = this.getPendingBookmarks(uid).filter((b) => b.questionId !== questionId);
      writeStorage('pending_bookmarks', JSON.stringify(current), uid);
    } catch (err) {
      console.error('Failed to remove pending bookmark', err);
    }
  },

  clearPendingBookmarks(uid?: string | null): void {
    try {
      removeStorage('pending_bookmarks', uid);
    } catch (err) {
      console.error('Failed to clear pending bookmarks', err);
    }
  },

  // Exam History
  getHistory(uid?: string | null): ExamResult[] {
    try {
      const data = readStorage('history', uid);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setHistory(history: ExamResult[], uid?: string | null): void {
    try {
      writeStorage('history', JSON.stringify(history.slice(0, 100)), uid);
      this.notify();
    } catch (err) {
      console.error('Failed to set history in localStore', err);
    }
  },

  saveResult(result: ExamResult, uid?: string | null): void {
    try {
      const history = this.getHistory(uid);
      const filtered = history.filter((h) => h.id !== result.id);
      const updated = [result, ...filtered].slice(0, 100); // keep last 100
      writeStorage('history', JSON.stringify(updated), uid);

      // Also update mistakes pool for this user
      this.recordMistakes(result, uid);
      this.notify();
    } catch (err) {
      console.error('Failed to save exam result locally', err);
    }
  },

  clearHistory(uid?: string | null): void {
    try {
      removeStorage('history', uid);
      this.notify();
    } catch (err) {
      console.error('Failed to clear history', err);
    }
  },

  // Active Session (Accidental refresh protection)
  getActiveSession(uid?: string | null): ActiveExamSession | null {
    try {
      const data = readStorage('active_session', uid);
      if (!data) return null;
      const session: ActiveExamSession = JSON.parse(data);
      // If timed and target end time already expired significantly (> 1 hr), clear it
      if (session.targetEndTime && Date.now() > session.targetEndTime + 3600000) {
        this.clearActiveSession(uid);
        return null;
      }
      return session;
    } catch {
      return null;
    }
  },

  saveActiveSession(session: ActiveExamSession, uid?: string | null): void {
    try {
      writeStorage('active_session', JSON.stringify(session), uid);
      this.notify();
    } catch (err) {
      console.error('Failed to persist active session', err);
    }
  },

  clearActiveSession(uid?: string | null): void {
    try {
      removeStorage('active_session', uid);
      this.notify();
    } catch (err) {
      console.error('Failed to clear active session', err);
    }
  },

  // Bookmarks
  getBookmarks(uid?: string | null): string[] {
    try {
      const data = readStorage('bookmarks', uid);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setBookmarks(bookmarks: string[], uid?: string | null): void {
    try {
      writeStorage('bookmarks', JSON.stringify(bookmarks), uid);
      this.notify();
    } catch (err) {
      console.error('Failed to set bookmarks in localStore', err);
    }
  },

  toggleBookmark(questionId: string, uid?: string | null): boolean {
    try {
      const bookmarks = this.getBookmarks(uid);
      const exists = bookmarks.includes(questionId);
      const updated = exists
        ? bookmarks.filter((id) => id !== questionId)
        : [...bookmarks, questionId];
      writeStorage('bookmarks', JSON.stringify(updated), uid);
      this.notify();
      return !exists;
    } catch {
      return false;
    }
  },

  isBookmarked(questionId: string, uid?: string | null): boolean {
    return this.getBookmarks(uid).includes(questionId);
  },

  // Mistakes Pool
  getMistakes(uid?: string | null): Record<string, MistakeEntry> {
    try {
      const data = readStorage('mistakes', uid);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  setMistakes(mistakes: Record<string, MistakeEntry>, uid?: string | null): void {
    try {
      writeStorage('mistakes', JSON.stringify(mistakes), uid);
      this.notify();
    } catch (err) {
      console.error('Failed to set mistakes in localStore', err);
    }
  },

  getMistakesList(uid?: string | null): MistakeEntry[] {
    return Object.values(this.getMistakes(uid));
  },

  getExamBestScore(examId: string, uid?: string | null): number | null {
    const history = this.getHistory(uid).filter((h) => h.examId === examId);
    if (history.length === 0) return null;
    return Math.round(Math.max(...history.map((h) => h.percentage)) * 10) / 10;
  },

  recordMistakes(result: ExamResult, uid?: string | null): void {
    try {
      const mistakes = this.getMistakes(uid);
      const incorrectSet = new Set(result.incorrectQuestionIds || []);

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
        } else if (result.answers && result.answers[q.id] !== undefined) {
          // If the user answered it correctly in this attempt, decrement wrong count or clear if mastered
          if (mistakes[q.id]) {
            mistakes[q.id].wrongCount = Math.max(0, mistakes[q.id].wrongCount - 1);
            if (mistakes[q.id].wrongCount === 0) {
              delete mistakes[q.id];
            }
          }
        }
      });

      writeStorage('mistakes', JSON.stringify(mistakes), uid);
      this.notify();
    } catch (err) {
      console.error('Failed to update mistakes store', err);
    }
  },

  clearMistakes(uid?: string | null): void {
    try {
      removeStorage('mistakes', uid);
      this.notify();
    } catch (err) {
      console.error('Failed to clear mistakes', err);
    }
  },

  // Analytics Computation
  getAnalytics(uid?: string | null) {
    const history = this.getHistory(uid);
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

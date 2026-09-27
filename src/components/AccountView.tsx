import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getUserAttemptsFromFirestore,
  getUserBookmarksFromFirestore,
  getUserMistakesFromFirestore,
  autoSyncUserData
} from '../lib/firestore';
import {
  getUserLeaderboardSettings,
  updateLeaderboardSettings
} from '../lib/leaderboard';
import { ExamResult } from '../types/exam';
import {
  Cloud,
  LogOut,
  Award,
  RotateCcw,
  ArrowRight,
  Trophy,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Check,
  X
} from 'lucide-react';

interface AccountViewProps {
  onReviewAttempt: (result: ExamResult) => void;
  onGoToExams: () => void;
  onNavigate: (view: string) => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  onReviewAttempt,
  onGoToExams,
  onNavigate
}) => {
  const { user, signOut, updateDisplayName } = useAuth();

  const [attempts, setAttempts] = useState<ExamResult[]>([]);
  const [bookmarksCount, setBookmarksCount] = useState<number>(0);
  const [mistakesCount, setMistakesCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Profile Edit State
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>('');
  const [nameSaving, setNameSaving] = useState<boolean>(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // Canonical Leaderboard opt-in preference
  const [leaderboardOptIn, setLeaderboardOptIn] = useState<boolean>(false);
  const [savingSettings, setSavingSettings] = useState<boolean>(false);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState<string | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  const fetchUserData = async (isManualRefresh = false) => {
    if (!user) return;
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      // Auto sync pending records in background
      await autoSyncUserData(user.uid);

      const [cloudAttempts, cloudBookmarks, cloudMistakes, lbSettings] = await Promise.all([
        getUserAttemptsFromFirestore(user.uid),
        getUserBookmarksFromFirestore(user.uid),
        getUserMistakesFromFirestore(user.uid),
        getUserLeaderboardSettings(user.uid)
      ]);
      setAttempts(cloudAttempts);
      setBookmarksCount(cloudBookmarks.length);
      setMistakesCount(Object.keys(cloudMistakes).length);
      setLeaderboardOptIn(lbSettings.leaderboardOptIn);
      setNameInput(user.displayName || user.email?.split('@')[0] || '');
    } catch (err) {
      console.error('Error fetching account data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const handleSaveDisplayName = async () => {
    const clean = nameInput.trim();
    if (!clean) {
      setNameError('Display name cannot be empty.');
      return;
    }

    setNameSaving(true);
    setNameError(null);
    try {
      await updateDisplayName(clean);
      setIsEditingName(false);
      setSettingsSavedMsg('Display name updated.');
      setTimeout(() => setSettingsSavedMsg(null), 4000);
    } catch (err) {
      console.error('Failed to update display name:', err);
      setNameError('Failed to update display name. Please try again.');
    } finally {
      setNameSaving(false);
    }
  };

  const handleToggleLeaderboard = async (newOptIn: boolean) => {
    if (!user) return;
    setSettingsError(null);
    setSettingsSavedMsg(null);

    const displayName = user.displayName || user.email?.split('@')[0] || 'Student';

    setSavingSettings(true);
    try {
      await updateLeaderboardSettings(user.uid, newOptIn, displayName, attempts);
      setLeaderboardOptIn(newOptIn);
      setSettingsSavedMsg(
        newOptIn
          ? 'Leaderboard enabled. Your best scores will appear under your display name.'
          : 'Leaderboard disabled. Your public entries have been removed.'
      );
      setTimeout(() => setSettingsSavedMsg(null), 5000);
    } catch (err) {
      console.error('Error saving leaderboard settings:', err);
      setSettingsError('Failed to update leaderboard preference. Please try again.');
    } finally {
      setSavingSettings(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 text-center font-mono">
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <p className="text-slate-600">Please sign in to view your account and exam records.</p>
          <button
            onClick={onGoToExams}
            className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-500 cursor-pointer"
          >
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  const averagePercentage =
    attempts.length > 0
      ? Math.round((attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length) * 10) / 10
      : 0;

  const bestScore =
    attempts.length > 0
      ? Math.round(Math.max(...attempts.map((a) => a.percentage)) * 10) / 10
      : 0;

  const currentDisplayName = user.displayName || user.email?.split('@')[0] || 'Student';

  return (
    <div className="max-w-6xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-8 pb-16 space-y-6">
      {/* Account Profile Header */}
      <div className="bg-slate-900 text-white rounded-xl border border-slate-800 p-4 sm:p-6 shadow-xs relative overflow-hidden w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 font-mono text-lg sm:text-xl font-bold uppercase shadow-2xs shrink-0">
              {currentDisplayName.slice(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <div className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-bold">
                PROFILE
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {isEditingName ? (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      maxLength={24}
                      placeholder="Display Name"
                      className="px-2.5 py-1 text-xs sm:text-sm font-bold bg-slate-800 border border-indigo-500/50 rounded text-white focus:outline-none focus:ring-1 focus:ring-indigo-400 max-w-[160px] sm:max-w-xs"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveDisplayName}
                      disabled={nameSaving}
                      className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors cursor-pointer disabled:opacity-50"
                      title="Save"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingName(false);
                        setNameInput(currentDisplayName);
                        setNameError(null);
                      }}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors cursor-pointer"
                      title="Cancel"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-base sm:text-lg font-bold text-white tracking-tight break-all">
                      {currentDisplayName}
                    </span>
                    <button
                      onClick={() => {
                        setNameInput(currentDisplayName);
                        setIsEditingName(true);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-mono text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer shrink-0"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </>
                )}

                <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase shrink-0">
                  <Cloud className="w-3 h-3" />
                  Synced
                </span>
              </div>

              {nameError && (
                <p className="text-[11px] font-mono text-rose-400">{nameError}</p>
              )}

              <p className="text-xs font-mono text-slate-400 truncate max-w-full">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs font-mono font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid: 2 cols on mobile/tablet, 4 cols on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] font-mono uppercase text-slate-500 font-bold mb-1">
            Saved Attempts
          </div>
          <div className="text-xl sm:text-2xl font-mono font-extrabold text-slate-900">
            {attempts.length}
          </div>
          <div className="text-[10px] sm:text-[11px] font-mono text-slate-400 mt-1">Saved to your account</div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] font-mono uppercase text-slate-500 font-bold mb-1">
            Best Score
          </div>
          <div className="text-xl sm:text-2xl font-mono font-extrabold text-indigo-600">
            {bestScore}%
          </div>
          <div className="text-[10px] sm:text-[11px] font-mono text-slate-400 mt-1">Highest percentage</div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] font-mono uppercase text-slate-500 font-bold mb-1">
            Average Score
          </div>
          <div className="text-xl sm:text-2xl font-mono font-extrabold text-slate-900">
            {averagePercentage}%
          </div>
          <div className="text-[10px] sm:text-[11px] font-mono text-slate-400 mt-1">Across all papers</div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] font-mono uppercase text-slate-500 font-bold mb-1">
            Tracked Mistakes
          </div>
          <div className="text-xl sm:text-2xl font-mono font-extrabold text-rose-600">
            {mistakesCount}
          </div>
          <div className="text-[10px] sm:text-[11px] font-mono text-slate-400 mt-1">In revision queue</div>
        </div>
      </div>

      {/* Clean Leaderboard Settings Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-2xs space-y-4 w-full">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
              LEADERBOARD
            </span>
          </div>
        </div>

        {settingsSavedMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg p-3 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{settingsSavedMsg}</span>
          </div>
        )}

        {settingsError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-900 rounded-lg p-3 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{settingsError}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold text-slate-800">
              Show my scores on leaderboards
            </div>
            <p className="text-xs font-mono text-slate-500">
              Your best scores appear under your display name. Your email stays private.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
            <button
              type="button"
              onClick={() => handleToggleLeaderboard(!leaderboardOptIn)}
              disabled={savingSettings}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:opacity-50 ${
                leaderboardOptIn ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  leaderboardOptIn ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-xs font-mono font-bold text-slate-700 min-w-8">
              {leaderboardOptIn ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div className="flex flex-wrap gap-2 text-xs font-mono w-full">
        <button
          onClick={() => onNavigate('analytics')}
          className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold rounded-md shadow-2xs cursor-pointer"
        >
          View Full Analytics →
        </button>
        <button
          onClick={() => onNavigate('mistakes')}
          className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold rounded-md shadow-2xs cursor-pointer"
        >
          Mistakes Pool ({mistakesCount}) →
        </button>
        <button
          onClick={() => onNavigate('saved')}
          className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold rounded-md shadow-2xs cursor-pointer"
        >
          Saved Questions ({bookmarksCount}) →
        </button>
      </div>

      {/* Exam Attempts List Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs w-full">
        <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
              Exam History
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchUserData(true)}
              disabled={refreshing}
              className="text-xs font-mono text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className={`w-3 h-3 ${refreshing ? 'animate-spin text-indigo-600' : ''}`} />
              <span>{refreshing ? 'Syncing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-slate-400">
            Loading exam records...
          </div>
        ) : attempts.length === 0 ? (
          <div className="py-12 text-center space-y-3 font-mono text-xs px-4">
            <p className="text-slate-500">No exam attempts recorded yet.</p>
            <button
              onClick={onGoToExams}
              className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-500 cursor-pointer shadow-xs"
            >
              Start Your First Exam →
            </button>
          </div>
        ) : (
          <div>
            {/* Desktop & Tablet Table View */}
            <div className="hidden sm:block overflow-x-auto w-full">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 text-[11px]">
                    <th className="py-2.5 px-4 font-bold">DATE</th>
                    <th className="py-2.5 px-4 font-bold">EXAMINATION</th>
                    <th className="py-2.5 px-4 font-bold">SCORE</th>
                    <th className="py-2.5 px-4 font-bold">ACCURACY</th>
                    <th className="py-2.5 px-4 font-bold">DURATION</th>
                    <th className="py-2.5 px-4 font-bold text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attempts.map((attempt) => (
                    <tr key={attempt.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(attempt.timestamp).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric'
                        })}{' '}
                        <span className="text-[11px] text-slate-400">
                          {new Date(attempt.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans font-semibold text-slate-900">
                        <div>{attempt.examTitle}</div>
                        <div className="text-[10px] font-mono text-slate-400 uppercase font-normal">
                          {attempt.subject}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-bold">
                        <span
                          className={
                            attempt.percentage >= 70
                              ? 'text-emerald-700'
                              : attempt.percentage >= 40
                              ? 'text-amber-700'
                              : 'text-rose-700'
                          }
                        >
                          {attempt.score}
                        </span>
                        <span className="text-slate-400 text-[11px] font-normal"> / {attempt.maxScore}</span>{' '}
                        <span className="text-[10px] px-1 py-0.5 bg-slate-100 rounded text-slate-600 font-semibold ml-1">
                          {attempt.percentage}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        {attempt.accuracy}%
                      </td>
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {Math.floor(attempt.timeTakenSeconds / 60)}m {attempt.timeTakenSeconds % 60}s
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onReviewAttempt(attempt)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded transition-colors cursor-pointer"
                        >
                          <span>Review</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View (No horizontal scrolling) */}
            <div className="sm:hidden divide-y divide-slate-100 font-mono">
              {attempts.map((attempt) => (
                <div key={attempt.id} className="p-3.5 space-y-2.5 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xs font-sans font-bold text-slate-900 leading-snug">
                        {attempt.examTitle}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                        <span className="uppercase text-indigo-600 font-semibold">{attempt.subject}</span>
                        <span>•</span>
                        <span>
                          {new Date(attempt.timestamp).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onReviewAttempt(attempt)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded transition-colors cursor-pointer shrink-0"
                    >
                      <span>Review</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-lg text-center text-xs">
                    <div>
                      <div className="text-[9px] uppercase text-slate-500 font-semibold">Score</div>
                      <div className="font-bold text-slate-900 mt-0.5">
                        {attempt.score} <span className="text-[10px] text-slate-400 font-normal">/{attempt.maxScore}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase text-slate-500 font-semibold">Accuracy</div>
                      <div className={`font-bold mt-0.5 ${
                        attempt.accuracy >= 70
                          ? 'text-emerald-700'
                          : attempt.accuracy >= 40
                          ? 'text-amber-700'
                          : 'text-rose-700'
                      }`}>
                        {attempt.accuracy}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase text-slate-500 font-semibold">Duration</div>
                      <div className="font-bold text-slate-700 mt-0.5">
                        {Math.floor(attempt.timeTakenSeconds / 60)}m {attempt.timeTakenSeconds % 60}s
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

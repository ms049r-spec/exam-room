import React, { useState, useEffect } from 'react';
import { examDefinitions } from '../data/questions/sampleExams';
import { getLeaderboardEntries, getUserLeaderboardSettings, LeaderboardEntry } from '../lib/leaderboard';
import { useAuth } from '../context/AuthContext';
import {
  Trophy,
  Medal,
  Sparkles,
  UserCheck,
  ChevronDown,
  RotateCcw,
  Shield,
  ArrowRight,
  User as UserIcon
} from 'lucide-react';

interface LeaderboardViewProps {
  onGoToAccount: () => void;
  onGoToExams: () => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  onGoToAccount,
  onGoToExams
}) => {
  const { user, openAuthModal } = useAuth();

  const [selectedExamId, setSelectedExamId] = useState<string>(examDefinitions[0]?.id || '');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isUserParticipating, setIsUserParticipating] = useState<boolean>(false);
  const [userDisplayName, setUserDisplayName] = useState<string>('');

  const currentExam =
    examDefinitions.find((e) => e.id === selectedExamId) || examDefinitions[0];

  const fetchLeaderboard = async (isManual = false) => {
    if (!selectedExamId) return;
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await getLeaderboardEntries(selectedExamId);
      setEntries(data);

      if (user) {
        const settings = await getUserLeaderboardSettings(user.uid);
        setIsUserParticipating(settings.leaderboardOptIn && !!settings.leaderboardDisplayName);
        setUserDisplayName(settings.leaderboardDisplayName || user.displayName || '');
      } else {
        setIsUserParticipating(false);
      }
    } catch (err) {
      console.warn('Failed to load leaderboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedExamId, user]);

  const userEntry = user ? entries.find((e) => e.uid === user.uid) : null;

  const getRankBadge = (rank?: number) => {
    if (rank === 1) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-mono text-xs font-bold shadow-2xs">
          1
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-800 border border-slate-300 font-mono text-xs font-bold">
          2
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-800/10 text-amber-900 border border-amber-700/20 font-mono text-xs font-bold">
          3
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 text-slate-500 font-mono text-xs font-semibold">
        {rank}
      </span>
    );
  };

  return (
    <div className="max-w-6xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-8 pb-16 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-slate-200 w-full">
        <div>
          <div className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-indigo-700 uppercase">
            EXAM RANKINGS
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-0.5 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500 shrink-0" />
            <span>Standardized Exam Leaderboard</span>
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Verified top results ranked by percentage accuracy and score.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={() => fetchLeaderboard(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-indigo-600' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Exam Selector & Stats Row */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-md w-full">
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Select Exam Paper
            </label>
            <div className="relative">
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-800 pr-9 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors cursor-pointer"
              >
                {examDefinitions.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.title} ({exam.subject})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:self-end text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700 font-bold">
              {currentExam?.subject.toUpperCase()}
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-600">
              {currentExam?.questionCount} QUESTIONS
            </span>
            <span className="px-2.5 py-1 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold">
              {entries.length} {entries.length === 1 ? 'RANKED STUDENT' : 'RANKED STUDENTS'}
            </span>
          </div>
        </div>

        {/* Current User Status Banner */}
        {user ? (
          isUserParticipating ? (
            <div className="bg-indigo-50/70 border border-indigo-100 rounded-lg p-3 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-indigo-900 w-full">
              <div className="flex items-center gap-2 min-w-0">
                <UserCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="truncate">
                  Appearing as <strong>{userDisplayName}</strong>.
                  {userEntry ? (
                    <> Current rank: <strong>#{userEntry.rank}</strong> ({userEntry.bestPercentage}%).</>
                  ) : (
                    <> Complete this exam to place on the board!</>
                  )}
                </span>
              </div>
              <button
                onClick={onGoToAccount}
                className="text-xs font-bold text-indigo-700 hover:text-indigo-900 hover:underline self-start sm:self-auto cursor-pointer shrink-0"
              >
                Settings →
              </button>
            </div>
          ) : (
            <div className="bg-slate-100 border border-slate-200 rounded-lg p-3 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-700 w-full">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-500 shrink-0" />
                <span>You are not currently appearing on leaderboards.</span>
              </div>
              <button
                onClick={onGoToAccount}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline self-start sm:self-auto cursor-pointer shrink-0"
              >
                Enable in Account Settings →
              </button>
            </div>
          )
        ) : (
          <div className="bg-slate-100 border border-slate-200 rounded-lg p-3 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-700 w-full">
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-slate-500 shrink-0" />
              <span>Sign in to appear on the leaderboard.</span>
            </div>
            <button
              onClick={() => openAuthModal('signin')}
              className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto shrink-0"
            >
              Sign In
            </button>
          </div>
        )}
      </div>

      {/* Leaderboard Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs w-full">
        <div className="px-4 sm:px-5 py-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Medal className="w-4 h-4 text-indigo-600 shrink-0" />
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900 truncate">
              {currentExam?.title} Standings
            </h2>
          </div>
          <div className="text-[11px] font-mono text-slate-500 shrink-0">
            Ranked by % Score
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs font-mono text-slate-400">
            Loading leaderboard standings...
          </div>
        ) : entries.length === 0 ? (
          <div className="py-16 text-center space-y-3 font-mono text-xs px-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="font-bold text-slate-700">No leaderboard entries yet.</div>
            <p className="text-slate-500 max-w-sm mx-auto">
              Be the first to complete this exam and set a high score on the public board!
            </p>
            <div className="pt-2">
              <button
                onClick={onGoToExams}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <span>Take Exam Paper</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Desktop & Tablet Table View */}
            <div className="hidden sm:block overflow-x-auto w-full">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 w-16 text-center">#</th>
                    <th className="py-3 px-4">NAME</th>
                    <th className="py-3 px-4 text-center">SCORE</th>
                    <th className="py-3 px-4 text-center">% ACCURACY</th>
                    <th className="py-3 px-4 text-right">AURA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {entries.map((entry) => {
                    const isCurrentUser = user && entry.uid === user.uid;

                    return (
                      <tr
                        key={entry.uid}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isCurrentUser ? 'bg-indigo-50/50 font-bold text-indigo-950' : 'text-slate-800'
                        }`}
                      >
                        {/* Rank */}
                        <td className="py-3.5 px-4 text-center">
                          {getRankBadge(entry.rank)}
                        </td>

                        {/* Name / Alias */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 break-all">
                              {entry.displayName}
                            </span>
                            {isCurrentUser && (
                              <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-[10px] text-white font-bold uppercase tracking-wider shrink-0">
                                YOU
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Score */}
                        <td className="py-3.5 px-4 text-center tabular-nums whitespace-nowrap">
                          <span className="font-bold text-slate-900">{entry.bestScore}</span>
                          {entry.maxScore ? (
                            <span className="text-slate-400"> / {entry.maxScore}</span>
                          ) : null}
                        </td>

                        {/* Percentage */}
                        <td className="py-3.5 px-4 text-center tabular-nums whitespace-nowrap">
                          <span className={`font-bold ${
                            entry.bestPercentage >= 80
                              ? 'text-emerald-600'
                              : entry.bestPercentage >= 60
                              ? 'text-indigo-600'
                              : 'text-amber-600'
                          }`}>
                            {entry.bestPercentage.toFixed(1)}%
                          </span>
                        </td>

                        {/* Aura Points */}
                        <td className="py-3.5 px-4 text-right tabular-nums whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                            <Sparkles className="w-3 h-3 text-indigo-500" />
                            <span>+{entry.auraPoints}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View (No horizontal scrolling) */}
            <div className="sm:hidden divide-y divide-slate-100 font-mono">
              {entries.map((entry) => {
                const isCurrentUser = user && entry.uid === user.uid;

                return (
                  <div
                    key={entry.uid}
                    className={`p-3.5 space-y-2.5 transition-colors ${
                      isCurrentUser ? 'bg-indigo-50/50' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="shrink-0">
                          {getRankBadge(entry.rank)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-slate-900 text-xs break-all">
                              {entry.displayName}
                            </span>
                            {isCurrentUser && (
                              <span className="px-1.5 py-0.2 rounded bg-indigo-600 text-[9px] text-white font-bold uppercase tracking-wider shrink-0">
                                YOU
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 text-[11px] shrink-0">
                        <Sparkles className="w-3 h-3 text-indigo-500" />
                        <span>+{entry.auraPoints}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-lg text-center text-xs">
                      <div>
                        <div className="text-[9px] uppercase text-slate-500 font-semibold">Score</div>
                        <div className="font-bold text-slate-900 mt-0.5">
                          {entry.bestScore} {entry.maxScore ? <span className="text-[10px] text-slate-400 font-normal">/{entry.maxScore}</span> : null}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase text-slate-500 font-semibold">Accuracy</div>
                        <div className={`font-bold mt-0.5 ${
                          entry.bestPercentage >= 80
                            ? 'text-emerald-600'
                            : entry.bestPercentage >= 60
                            ? 'text-indigo-600'
                            : 'text-amber-600'
                        }`}>
                          {entry.bestPercentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

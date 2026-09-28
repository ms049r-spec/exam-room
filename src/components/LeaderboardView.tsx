import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { examDefinitions } from '../data/questions/sampleExams';
import { ExamDefinition } from '../types/exam';
import { getLeaderboardEntries, getUserLeaderboardSettings, LeaderboardEntry } from '../lib/leaderboard';
import { useAuth } from '../context/AuthContext';
import {
  Trophy,
  Sparkles,
  UserCheck,
  RotateCcw,
  Shield,
  ArrowRight,
  User as UserIcon,
  Crown,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface LeaderboardViewProps {
  onGoToAccount: () => void;
  onGoToExams: () => void;
  exams?: ExamDefinition[];
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = React.memo(({
  onGoToAccount,
  onGoToExams,
  exams
}) => {
  const { user, openAuthModal } = useAuth();

  const availableExams: ExamDefinition[] = (exams || examDefinitions).filter(
    (e: ExamDefinition) => e.published !== false
  );

  // Sort exams newest first (createdAt DESC)
  const sortedExams = useMemo(() => {
    return [...availableExams].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [availableExams]);

  const availableSubjects = useMemo(() => {
    const subjects = new Set<string>();
    sortedExams.forEach((e) => {
      if (e.subject) subjects.add(e.subject.toLowerCase());
    });
    return ['all', ...Array.from(subjects)];
  }, [sortedExams]);

  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const filteredExams = useMemo(() => {
    if (selectedSubject === 'all') return sortedExams;
    return sortedExams.filter(
      (e) => e.subject?.toLowerCase() === selectedSubject.toLowerCase()
    );
  }, [sortedExams, selectedSubject]);

  // Track single expanded exam ID (default newest exam open on mount, but fully collapsible)
  const [expandedExamId, setExpandedExamId] = useState<string | null>(() => {
    if (sortedExams.length > 0) {
      return sortedExams[0].id;
    }
    return null;
  });

  const [entriesByExam, setEntriesByExam] = useState<Record<string, LeaderboardEntry[]>>({});
  const [loadingExams, setLoadingExams] = useState<Record<string, boolean>>({});
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isUserParticipating, setIsUserParticipating] = useState<boolean>(false);
  const [userDisplayName, setUserDisplayName] = useState<string>('');

  // Fetch standings for an exam
  const fetchExamStandings = useCallback(async (examId: string, isManual = false) => {
    if (!examId) return;
    setLoadingExams((prev) => ({ ...prev, [examId]: true }));
    try {
      const data = await getLeaderboardEntries(examId);
      setEntriesByExam((prev) => ({ ...prev, [examId]: data }));
    } catch (err) {
      console.warn(`Failed to load leaderboard for ${examId}:`, err);
    } finally {
      setLoadingExams((prev) => ({ ...prev, [examId]: false }));
    }
  }, []);

  // Check user settings on mount or user change
  useEffect(() => {
    const loadUserSettings = async () => {
      if (user) {
        try {
          const settings = await getUserLeaderboardSettings(user.uid);
          setIsUserParticipating(settings.leaderboardOptIn && !!settings.leaderboardDisplayName);
          setUserDisplayName(settings.leaderboardDisplayName || user.displayName || '');
        } catch (err) {
          console.warn('Failed to load user settings:', err);
        }
      } else {
        setIsUserParticipating(false);
        setUserDisplayName('');
      }
    };
    loadUserSettings();
  }, [user]);

  // Load standings for the currently expanded exam
  useEffect(() => {
    if (expandedExamId && entriesByExam[expandedExamId] === undefined && !loadingExams[expandedExamId]) {
      fetchExamStandings(expandedExamId);
    }
  }, [expandedExamId, entriesByExam, loadingExams, fetchExamStandings]);

  const toggleExam = (examId: string) => {
    setExpandedExamId((prev) => {
      const nextId = prev === examId ? null : examId;
      if (nextId && entriesByExam[nextId] === undefined) {
        fetchExamStandings(nextId);
      }
      return nextId;
    });
  };

  const refreshAll = async () => {
    setRefreshing(true);
    try {
      const targetId = expandedExamId || (filteredExams[0] ? filteredExams[0].id : null);
      if (targetId) {
        await fetchExamStandings(targetId, true);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const getRankBadge = (rank?: number) => {
    if (rank === 1) {
      return (
        <span className="inline-flex items-center justify-center gap-1 w-7 h-7 rounded-full bg-[#22223B] text-[#F2E9E4] border border-[#C9ADA7] font-mono text-xs font-extrabold shadow-sm">
          <Crown className="w-3.5 h-3.5 text-[#C9ADA7]" />
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#4A4E69] text-[#F2E9E4] border border-[#9A8C98]/60 font-mono text-xs font-bold shadow-xs">
          2
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#C9ADA7]/30 text-[#22223B] border border-[#9A8C98]/50 font-mono text-xs font-bold">
          3
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 text-[#4A4E69] font-mono text-xs font-medium">
        {rank}
      </span>
    );
  };

  return (
    <div className="max-w-6xl w-full mx-auto px-2.5 sm:px-6 py-4 sm:py-8 pb-16 space-y-5 sm:space-y-6 flex-1 min-w-0">
      {/* 1. LEADERBOARD HEADER (EXACT CONCEPT RETAINED) */}
      <div className="liquid-glass-panel rounded-2xl p-4 sm:p-7 border border-white/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full min-w-0">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-[#4A4E69] uppercase flex-wrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22223B]" />
            <span>EXAM RANKINGS & REPUTATION</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#22223B] flex items-center gap-2.5 break-words">
            <Trophy className="w-5 h-5 text-[#22223B] shrink-0" />
            <span>LEADERBOARD</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#4A4E69] font-sans break-words">
            Verified rankings across standardized practice papers, scored by percentage accuracy and completion Aura.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            onClick={refreshAll}
            disabled={refreshing}
            className="liquid-glass-btn-secondary inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-bold rounded-xl cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-[#4A4E69] ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Standings'}</span>
          </button>
        </div>
      </div>

      {/* 2. SUBJECT FILTER */}
      <div className="liquid-glass-panel rounded-2xl border border-white/80 p-3.5 sm:p-5 shadow-sm space-y-2.5 w-full min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-[11px] font-mono font-extrabold uppercase tracking-wider text-[#4A4E69]">
            SUBJECT
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono text-[#9A8C98]">
            {filteredExams.length} {filteredExams.length === 1 ? 'Exam' : 'Exams'} Available
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none font-mono text-xs w-full max-w-full min-w-0">
          {availableSubjects.map((subj) => {
            const isSelected = selectedSubject.toLowerCase() === subj.toLowerCase();
            return (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isSelected
                    ? 'liquid-glass-btn-primary shadow-xs'
                    : 'liquid-glass-btn-secondary text-[#4A4E69] hover:text-[#22223B]'
                }`}
              >
                {subj === 'all' ? 'All Subjects' : subj}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. COMPACT EXAM DROPDOWN / LIST ROWS */}
      <div className="space-y-3.5 w-full min-w-0">
        {filteredExams.length === 0 ? (
          <div className="liquid-glass-panel rounded-2xl p-8 text-center space-y-2 font-mono text-xs text-[#4A4E69] w-full">
            <p>No examinations found for the selected subject.</p>
            <button
              onClick={() => setSelectedSubject('all')}
              className="liquid-glass-btn-primary px-3 py-1.5 rounded-lg text-xs font-bold uppercase cursor-pointer"
            >
              Show All Subjects
            </button>
          </div>
        ) : (
          filteredExams.map((exam, idx) => {
            const isExpanded = expandedExamId === exam.id;
            const entries = entriesByExam[exam.id] || [];
            const isLoading = !!loadingExams[exam.id];
            const isLatest = idx === 0 && selectedSubject === 'all';

            return (
              <div
                key={exam.id}
                className="liquid-glass-panel rounded-2xl border border-white/80 overflow-hidden shadow-sm transition-all w-full min-w-0"
              >
                {/* Compact Exam Dropdown Row */}
                <button
                  type="button"
                  onClick={() => toggleExam(exam.id)}
                  aria-expanded={isExpanded}
                  className="w-full px-3.5 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-2.5 sm:gap-3 text-left hover:bg-white/60 transition-colors cursor-pointer min-w-0"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span className="font-bold text-xs sm:text-base text-[#22223B] leading-tight break-words">
                        {exam.title}
                      </span>
                      {isLatest && (
                        <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-[#C9ADA7] text-[#22223B]">
                          LATEST
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-mono text-[#9A8C98] flex-wrap">
                      <span className="text-[#4A4E69] font-bold uppercase">{exam.subject}</span>
                      <span>·</span>
                      <span>{exam.questionCount || exam.questions?.length || 0} Questions</span>
                      {entries.length > 0 && (
                        <>
                          <span>·</span>
                          <span className="text-[#22223B] font-semibold">{entries.length} Participants</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <span className="text-[#4A4E69]">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-[#22223B]" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[#9A8C98]" />
                      )}
                    </span>
                  </div>
                </button>

                {/* Expanded Rankings Content */}
                {isExpanded && (
                  <div className="border-t border-[#4A4E69]/15 p-4 sm:p-6 bg-white/40 space-y-4">
                    {/* User Status Strip */}
                    {user ? (
                      isUserParticipating ? (
                        <div className="bg-white/70 border border-[#9A8C98]/30 rounded-xl p-3 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[#22223B] w-full">
                          <div className="flex items-center gap-2 min-w-0">
                            <UserCheck className="w-4 h-4 text-[#4A4E69] shrink-0" />
                            <span className="truncate">
                              Appearing as <strong>{userDisplayName}</strong>.
                              {entries.find((e) => e.uid === user.uid) ? (
                                <> Current rank: <strong>#{entries.find((e) => e.uid === user.uid)?.rank}</strong> ({entries.find((e) => e.uid === user.uid)?.bestPercentage.toFixed(1)}% accuracy).</>
                              ) : (
                                <> Complete this examination to place on the board!</>
                              )}
                            </span>
                          </div>
                          <button
                            onClick={onGoToAccount}
                            className="text-xs font-bold text-[#4A4E69] hover:text-[#22223B] hover:underline self-start sm:self-auto cursor-pointer shrink-0"
                          >
                            Leaderboard Settings →
                          </button>
                        </div>
                      ) : (
                        <div className="bg-white/70 border border-[#9A8C98]/30 rounded-xl p-3 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[#4A4E69] w-full">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-[#9A8C98] shrink-0" />
                            <span>You are currently not appearing on public leaderboards.</span>
                          </div>
                          <button
                            onClick={onGoToAccount}
                            className="text-xs font-bold text-[#22223B] hover:underline self-start sm:self-auto cursor-pointer shrink-0"
                          >
                            Enable in Account Settings →
                          </button>
                        </div>
                      )
                    ) : (
                      <div className="bg-white/70 border border-[#9A8C98]/30 rounded-xl p-3 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[#4A4E69] w-full">
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-[#9A8C98] shrink-0" />
                          <span>Sign in to earn Aura and rank on this leaderboard.</span>
                        </div>
                        <button
                          onClick={() => openAuthModal('signin')}
                          className="liquid-glass-btn-primary px-3 py-1 text-xs font-bold rounded-lg cursor-pointer self-start sm:self-auto shrink-0"
                        >
                          Sign In
                        </button>
                      </div>
                    )}

                    {/* Rankings Table */}
                    {isLoading ? (
                      <div className="py-8 text-center text-xs font-mono text-[#4A4E69]">
                        Loading standings for {exam.title}...
                      </div>
                    ) : entries.length === 0 ? (
                      <div className="py-8 text-center space-y-2.5 font-mono text-xs px-4">
                        <div className="w-10 h-10 rounded-full bg-white/80 border border-[#9A8C98]/30 flex items-center justify-center mx-auto text-[#4A4E69]">
                          <Trophy className="w-5 h-5" />
                        </div>
                        <div className="font-bold text-[#22223B] text-sm">No leaderboard entries yet</div>
                        <p className="text-[#4A4E69] max-w-sm mx-auto">
                          Be the first to complete this exam and set a high score on the public board!
                        </p>
                        <div className="pt-2">
                          <button
                            onClick={onGoToExams}
                            className="liquid-glass-btn-primary inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold rounded-xl cursor-pointer"
                          >
                            <span>Take Exam Paper</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="overflow-hidden rounded-xl border border-[#4A4E69]/15 bg-white/60">
                        {/* Desktop / Tablet Table */}
                        <div className="hidden sm:block overflow-x-auto w-full">
                          <table className="w-full text-left font-mono text-xs">
                            <thead className="bg-[#22223B]/5 text-[11px] uppercase tracking-wider text-[#4A4E69] border-b border-[#4A4E69]/15">
                              <tr>
                                <th className="py-3 px-4 w-16 text-center">#</th>
                                <th className="py-3 px-4">NAME</th>
                                <th className="py-3 px-4 text-center">SCORE</th>
                                <th className="py-3 px-4 text-center">% ACCURACY</th>
                                <th className="py-3 px-4 text-right">AURA</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#4A4E69]/10">
                              {entries.map((entry) => {
                                const isCurrentUser = user && entry.uid === user.uid;
                                const isTopThree = entry.rank && entry.rank <= 3;

                                return (
                                  <tr
                                    key={entry.uid}
                                    className={`transition-colors ${
                                      isCurrentUser
                                        ? 'bg-[#C9ADA7]/25 font-bold text-[#22223B]'
                                        : isTopThree
                                        ? 'bg-white/40 hover:bg-white/80 text-[#22223B]'
                                        : 'hover:bg-white/60 text-[#22223B]'
                                    }`}
                                  >
                                    {/* Rank */}
                                    <td className="py-3 px-4 text-center">
                                      {getRankBadge(entry.rank)}
                                    </td>

                                    {/* Name */}
                                    <td className="py-3 px-4">
                                      <div className="flex items-center gap-2">
                                        <span className="font-extrabold text-[#22223B] break-all">
                                          {entry.displayName}
                                        </span>
                                        {isCurrentUser && (
                                          <span className="px-1.5 py-0.5 rounded bg-[#22223B] text-[10px] text-[#F2E9E4] font-bold uppercase tracking-wider shrink-0">
                                            YOU
                                          </span>
                                        )}
                                      </div>
                                    </td>

                                    {/* Score */}
                                    <td className="py-3 px-4 text-center tabular-nums whitespace-nowrap">
                                      <span className="font-extrabold text-[#22223B]">{entry.bestScore}</span>
                                      {entry.maxScore ? (
                                        <span className="text-[#9A8C98]"> / {entry.maxScore}</span>
                                      ) : null}
                                    </td>

                                    {/* Accuracy */}
                                    <td className="py-3 px-4 text-center tabular-nums whitespace-nowrap">
                                      <span className="font-extrabold text-[#22223B]">
                                        {entry.bestPercentage.toFixed(1)}%
                                      </span>
                                    </td>

                                    {/* Aura */}
                                    <td className="py-3 px-4 text-right tabular-nums whitespace-nowrap">
                                      <span className="inline-flex items-center gap-1 font-extrabold text-[#22223B] bg-white/80 px-2.5 py-1 rounded-lg border border-[#9A8C98]/40 shadow-2xs">
                                        <Sparkles className="w-3 h-3 text-[#4A4E69]" />
                                        <span>+{entry.auraPoints}</span>
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile Card List */}
                        <div className="sm:hidden divide-y divide-[#4A4E69]/10 font-mono">
                          {entries.map((entry) => {
                            const isCurrentUser = user && entry.uid === user.uid;

                            return (
                              <div
                                key={entry.uid}
                                className={`p-3 space-y-2 transition-colors ${
                                  isCurrentUser ? 'bg-[#C9ADA7]/25' : 'hover:bg-white/60'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div className="shrink-0">
                                      {getRankBadge(entry.rank)}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="font-extrabold text-[#22223B] text-xs break-all">
                                          {entry.displayName}
                                        </span>
                                        {isCurrentUser && (
                                          <span className="px-1.5 py-0.2 rounded bg-[#22223B] text-[9px] text-[#F2E9E4] font-bold uppercase tracking-wider shrink-0">
                                            YOU
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <span className="inline-flex items-center gap-1 font-bold text-[#22223B] bg-white/80 px-2 py-0.5 rounded-lg border border-[#9A8C98]/40 text-[11px] shrink-0">
                                    <Sparkles className="w-3 h-3 text-[#4A4E69]" />
                                    <span>+{entry.auraPoints}</span>
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 bg-white/70 p-2 rounded-xl border border-[#9A8C98]/20 text-center text-xs">
                                  <div>
                                    <div className="text-[9px] uppercase text-[#4A4E69] font-semibold">Score</div>
                                    <div className="font-extrabold text-[#22223B] mt-0.5">
                                      {entry.bestScore} {entry.maxScore ? <span className="text-[10px] text-[#9A8C98] font-normal">/{entry.maxScore}</span> : null}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-[9px] uppercase text-[#4A4E69] font-semibold">Accuracy</div>
                                    <div className="font-extrabold text-[#22223B] mt-0.5">
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
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});

import React, { useState, useEffect } from 'react';
import { ExamResult, Question } from '../types/exam';
import { getMemeForPerformance, getRandomReactionFromBand, ReactionItem } from '../data/reactions';
import { calculateAuraPoints } from '../utils/aura';
import { localStore } from '../storage/localStore';
import { useAuth } from '../context/AuthContext';
import { syncBookmarkAction } from '../lib/firestore';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  RotateCcw,
  AlertTriangle,
  ArrowLeft,
  Bookmark,
  Sparkles,
  ChevronDown,
  Check
} from 'lucide-react';

interface ResultDashboardProps {
  result: ExamResult;
  onRetake: (options: { shuffleQuestions: boolean; shuffleOptions: boolean }) => void;
  onPracticeWrong: (wrongQuestions: Question[]) => void;
  onBackToHome: () => void;
}

export const ResultDashboard: React.FC<ResultDashboardProps> = ({
  result,
  onRetake,
  onPracticeWrong,
  onBackToHome
}) => {
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect' | 'unattempted' | 'correct'>('all');
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({});
  const [showRetakeMenu, setShowRetakeMenu] = useState(false);

  // Meme reaction state
  const [currentMeme, setCurrentMeme] = useState<ReactionItem>(() =>
    getMemeForPerformance(
      result.percentage,
      result.correctCount,
      result.totalQuestions,
      result.timeTakenSeconds,
      result.totalTimeSeconds,
      result.isTimed
    )
  );
  const [showMeme, setShowMeme] = useState(true);

  // Aura Points calculation (purely gamified performance indicator)
  const aura = calculateAuraPoints(result.percentage, result.score);

  const { user } = useAuth();

  useEffect(() => {
    const bookmarks = localStore.getBookmarks();
    const map: Record<string, boolean> = {};
    bookmarks.forEach((id) => (map[id] = true));
    setBookmarkedMap(map);
  }, []);

  const handleToggleBookmark = (questionId: string) => {
    const isNowBookmarked = localStore.toggleBookmark(questionId);
    setBookmarkedMap((prev) => ({
      ...prev,
      [questionId]: isNowBookmarked
    }));

    if (user) {
      syncBookmarkAction(user.uid, questionId, isNowBookmarked).catch(() => {});
    }
  };

  const handleNextReaction = () => {
    const next = getRandomReactionFromBand(currentMeme.id, result.percentage);
    setCurrentMeme(next);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s.toString().padStart(2, '0')}s`;
  };

  const filteredQuestions = result.questions.filter((q) => {
    const userAns = result.answers[q.id];
    const isAttempted = userAns !== undefined && (Array.isArray(userAns) ? userAns.length > 0 : true);

    if (reviewFilter === 'unattempted') return !isAttempted;
    if (!isAttempted) return false;

    const isWrong = result.incorrectQuestionIds.includes(q.id);
    if (reviewFilter === 'incorrect') return isWrong;
    if (reviewFilter === 'correct') return !isWrong;

    return true;
  });

  const wrongQuestionsList = result.questions.filter((q) =>
    result.incorrectQuestionIds.includes(q.id)
  );

  const getOptionLetter = (idx: number) => ['A', 'B', 'C', 'D', 'E', 'F'][idx] || `${idx + 1}`;
  const padNum = (n: number) => n.toString().padStart(2, '0');

  // Circular Gauge Calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.percentage / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-6 sm:py-8 pb-12 sm:pb-16 px-4 sm:px-6 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Breadcrumb & Action */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 px-3 py-1.5 rounded transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO PAPERS</span>
          </button>
          <div className="text-[11px] font-mono text-slate-500">
            COMPLETED AT {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* 1. DOMINANT SCORE BLOCK */}
        <div className="bg-slate-900 text-white rounded-xl border border-slate-800 p-6 sm:p-8 shadow-md relative overflow-hidden">
          {/* Subtle Grid Background Accent */}
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left space-y-1.5">
              <div className="inline-block px-2 py-0.5 rounded bg-indigo-600/30 border border-indigo-500/40 text-[10px] font-mono font-bold text-indigo-300 uppercase tracking-widest">
                EXAM COMPLETE
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {result.examTitle}
              </h1>
              <div className="text-xs font-mono text-slate-400">
                SUBJECT: <span className="text-slate-200 uppercase">{result.subject}</span> · QUESTIONS: {result.totalQuestions}
              </div>
            </div>

            {/* Score & Progress Ring Graphic */}
            <div className="flex items-center gap-6 bg-slate-800/80 border border-slate-700/80 p-4 rounded-xl">
              {/* Circular Gauge */}
              <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-slate-700"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="text-indigo-500 transition-all duration-1000 ease-out"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-mono font-extrabold text-white leading-none">
                    {result.percentage}%
                  </span>
                </div>
              </div>

              {/* Numerical Marks */}
              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  FINAL MARKS
                </div>
                <div className="text-3xl sm:text-4xl font-mono font-extrabold text-white leading-tight">
                  {result.score}
                  <span className="text-base sm:text-lg font-normal text-slate-400"> / {result.maxScore}</span>
                </div>
                <div className="text-xs font-mono text-indigo-300">
                  Accuracy: <strong className="text-white">{result.accuracy}%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. MEME / REACTION CARD (IMMEDIATELY UNDER SCORE, AS STRICTLY DIRECTED) */}
        {showMeme && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 cbt-shadow">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-indigo-700 font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>EXAM PERFORMANCE REACTION · {currentMeme.theme}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleNextReaction}
                  className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                  [ ANOTHER REACTION ]
                </button>
                <button
                  type="button"
                  onClick={() => setShowMeme(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  HIDE
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
              {/* Meme Visual */}
              <div className="w-full sm:w-56 h-44 sm:h-48 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                {currentMeme.image && (
                  <img
                    src={currentMeme.image}
                    alt={currentMeme.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Reaction Text & Aura Points */}
              <div className="flex-1 text-center sm:text-left space-y-2.5 w-full">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-600 font-bold block">
                      "{currentMeme.theme.toUpperCase()}"
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                      "{currentMeme.title}"
                    </h3>
                  </div>

                  {/* Aura Points Result Display */}
                  <div className="shrink-0 self-center sm:self-start text-center px-4 py-2 bg-slate-900 text-white rounded-lg border border-slate-800 shadow-xs min-w-[130px]">
                    <div className={`text-base sm:text-lg font-mono font-black tracking-tight leading-tight ${aura.points > 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {aura.pointsDisplay}
                    </div>
                    <div className="text-[10px] font-mono font-bold tracking-widest text-slate-300 uppercase leading-none mt-1">
                      {aura.category}
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                  {currentMeme.caption}
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleNextReaction}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>ANOTHER REACTION</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!showMeme && (
          <div className="bg-white rounded-xl border border-slate-200 p-4 cbt-shadow flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="text-slate-500 uppercase font-semibold">AURA RESULT:</span>
              <span className={`font-mono font-bold ${aura.points > 0 ? 'text-amber-600' : 'text-rose-600'}`}>{aura.pointsDisplay}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600 uppercase font-bold">{aura.category}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowMeme(true)}
              className="font-bold text-indigo-600 hover:underline cursor-pointer"
            >
              SHOW REACTION
            </button>
          </div>
        )}

        {/* 3. PERFORMANCE BREAKDOWN METRICS (BELOW MEME) */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 cbt-shadow">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg">
              <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold block mb-1">
                CORRECT
              </span>
              <span className="font-mono text-2xl font-bold text-emerald-950">
                {padNum(result.correctCount)}
              </span>
            </div>

            <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-lg">
              <span className="text-[10px] font-mono uppercase text-rose-800 font-bold block mb-1">
                WRONG
              </span>
              <span className="font-mono text-2xl font-bold text-rose-950">
                {padNum(result.wrongCount)}
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] font-mono uppercase text-slate-600 font-bold block mb-1">
                UNATTEMPTED
              </span>
              <span className="font-mono text-2xl font-bold text-slate-900">
                {padNum(result.unattemptedCount)}
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] font-mono uppercase text-slate-600 font-bold block mb-1">
                ACCURACY
              </span>
              <span className="font-mono text-2xl font-bold text-slate-900">
                {result.accuracy}%
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono uppercase text-slate-600 font-bold block mb-1">
                TIME TAKEN
              </span>
              <span className="font-mono text-xl font-bold text-slate-900 block pt-0.5">
                {formatSeconds(result.timeTakenSeconds)}
              </span>
            </div>
          </div>
        </div>

        {/* 4. QUESTION REVIEW SECTION */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 cbt-shadow space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Question Review & Solutions
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Verify choices against official explanations
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded border border-slate-200 font-mono text-xs">
              <button
                type="button"
                onClick={() => setReviewFilter('all')}
                className={`px-2.5 py-1 rounded font-bold transition-colors ${
                  reviewFilter === 'all' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ALL ({result.totalQuestions})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter('incorrect')}
                className={`px-2.5 py-1 rounded font-bold transition-colors ${
                  reviewFilter === 'incorrect' ? 'bg-rose-600 text-white shadow-2xs' : 'text-slate-600 hover:text-rose-700'
                }`}
              >
                WRONG ({result.wrongCount})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter('unattempted')}
                className={`px-2.5 py-1 rounded font-bold transition-colors ${
                  reviewFilter === 'unattempted' ? 'bg-slate-700 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                UNATTEMPTED ({result.unattemptedCount})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter('correct')}
                className={`px-2.5 py-1 rounded font-bold transition-colors ${
                  reviewFilter === 'correct' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-emerald-700'
                }`}
              >
                CORRECT ({result.correctCount})
              </button>
            </div>
          </div>

          {/* List of reviewed questions */}
          <div className="space-y-4">
            {filteredQuestions.map((q) => {
              const qNum = result.questions.findIndex((item) => item.id === q.id) + 1;
              const userAns = result.answers[q.id];
              const isAttempted = userAns !== undefined && (Array.isArray(userAns) ? userAns.length > 0 : true);
              const isWrong = result.incorrectQuestionIds.includes(q.id);
              const isCorrect = isAttempted && !isWrong;

              return (
                <div
                  key={q.id}
                  className="p-4 sm:p-5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                        Q.{padNum(qNum)}
                      </span>
                      <span className="text-slate-500 uppercase">{q.topic}</span>
                      <span className="text-slate-300">|</span>
                      {isCorrect && (
                        <span className="font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> CORRECT (+{q.marks.correct})
                        </span>
                      )}
                      {isWrong && (
                        <span className="font-bold text-rose-700 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> INCORRECT ({q.marks.incorrect})
                        </span>
                      )}
                      {!isAttempted && (
                        <span className="font-bold text-slate-500 flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5" /> UNATTEMPTED (0)
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleToggleBookmark(q.id)}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded border transition-colors ${
                        bookmarkedMap[q.id]
                          ? 'border-amber-300 bg-amber-50 text-amber-900 font-bold'
                          : 'border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <Bookmark className={`w-3 h-3 ${bookmarkedMap[q.id] ? 'fill-amber-500 text-amber-600' : 'text-slate-400'}`} />
                      <span>{bookmarkedMap[q.id] ? 'SAVED' : 'SAVE'}</span>
                    </button>
                  </div>

                  {/* Question */}
                  <p className="text-sm font-semibold text-slate-950 leading-relaxed">
                    {q.question}
                  </p>

                  {/* Options */}
                  <div className="space-y-1.5 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isThisCorrect = typeof q.correctAnswer === 'number'
                        ? q.correctAnswer === optIdx
                        : Array.isArray(q.correctAnswer) && q.correctAnswer.includes(optIdx);

                      const isThisSelected = typeof userAns === 'number'
                        ? userAns === optIdx
                        : Array.isArray(userAns) && userAns.includes(optIdx);

                      let cardStyle = 'border-slate-200 bg-white text-slate-700';

                      if (isThisCorrect) {
                        cardStyle = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                      } else if (isThisSelected && !isThisCorrect) {
                        cardStyle = 'border-rose-400 bg-rose-50/70 text-rose-950 font-semibold ring-1 ring-rose-400';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded border text-xs sm:text-sm flex items-start justify-between gap-3 ${cardStyle}`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="font-mono font-bold shrink-0">
                              {getOptionLetter(optIdx)}.
                            </span>
                            <span>{opt}</span>
                          </div>

                          <div className="shrink-0 font-mono font-bold text-[11px]">
                            {isThisSelected && !isThisCorrect && (
                              <span className="text-rose-700">YOUR ANSWER</span>
                            )}
                            {isThisCorrect && (
                              <span className="text-emerald-700">
                                {isThisSelected ? 'YOUR ANSWER (CORRECT)' : 'CORRECT ANSWER'}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {q.explanation && (
                    <div className="p-3.5 bg-indigo-50/60 border border-indigo-100 rounded text-xs space-y-1">
                      <span className="font-mono font-bold uppercase text-[10px] text-indigo-900 tracking-wider block">
                        EXPLANATION
                      </span>
                      <p className="text-slate-800 leading-relaxed font-sans">
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. RETAKE & NAVIGATION ACTION BAR */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 cbt-shadow flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold text-slate-700 hover:text-slate-900 border border-slate-300 rounded hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>EXAM LIST</span>
          </button>

          <div className="flex items-center gap-3">
            {wrongQuestionsList.length > 0 && (
              <button
                onClick={() => onPracticeWrong(wrongQuestionsList)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>PRACTICE WRONG ({wrongQuestionsList.length})</span>
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setShowRetakeMenu(!showRetakeMenu)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RETAKE PAPER</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showRetakeMenu && (
                <div className="absolute right-0 bottom-full mb-1.5 w-56 bg-white border border-slate-200 rounded-lg shadow-xl p-1 z-20 font-mono text-xs">
                  <button
                    onClick={() => {
                      setShowRetakeMenu(false);
                      onRetake({ shuffleQuestions: false, shuffleOptions: false });
                    }}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-100 rounded font-semibold transition-colors"
                  >
                    Original Question Order
                  </button>
                  <button
                    onClick={() => {
                      setShowRetakeMenu(false);
                      onRetake({ shuffleQuestions: true, shuffleOptions: false });
                    }}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-100 rounded font-semibold transition-colors"
                  >
                    Shuffle Question Order
                  </button>
                  <button
                    onClick={() => {
                      setShowRetakeMenu(false);
                      onRetake({ shuffleQuestions: true, shuffleOptions: true });
                    }}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-100 rounded font-semibold transition-colors"
                  >
                    Shuffle Questions & Choices
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

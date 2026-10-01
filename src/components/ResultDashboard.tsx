import React, { useState } from 'react';
import { ExamResult, Question } from '../types/exam';
import { getMemeForPerformance, getRandomReactionFromBand, ReactionItem } from '../data/reactions';
import { calculateAuraPoints } from '../utils/aura';
import { useUserData } from '../context/UserDataContext';
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
  Check,
  X,
  Circle
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

  const { isBookmarked, toggleBookmark } = useUserData();

  const handleToggleBookmark = async (questionId: string) => {
    await toggleBookmark(questionId);
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

  return (
    <div className="min-h-screen liquid-glass-ambient py-6 sm:py-8 pb-12 sm:pb-16 px-3 sm:px-6 selection:bg-[#4A4E69]/30 selection:text-[#22223B]">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Breadcrumb & Action */}
        <div className="flex items-center justify-between pb-2 border-b border-[#9A8C98]/30">
          <button
            onClick={onBackToHome}
            className="liquid-glass-btn-secondary inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3.5 py-1.5 rounded-xl cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>EXAM PAPERS</span>
          </button>
          <div className="text-[11px] font-mono text-[#4A4E69]">
            COMPLETED AT {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* 1. STANDARDIZED ASSESSMENT RESULT HEADER */}
        <div className="bg-[#22223B] text-[#F2E9E4] rounded-2xl border border-[#C9ADA7]/25 p-4 sm:p-7 shadow-xl relative overflow-hidden backdrop-blur-md w-full min-w-0">
          {/* Subtle secondary depth layering */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#4A4E69]/20 via-transparent to-[#22223B]/60 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-8 w-full min-w-0">
            {/* LEFT SIDE: Exam Details */}
            <div className="space-y-2.5 max-w-xl min-w-0 w-full">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#4A4E69]/40 border border-[#C9ADA7]/30 text-[10px] font-mono font-bold text-[#C9ADA7] tracking-widest uppercase">
                <span>EXAM COMPLETE</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F2E9E4] leading-snug break-words">
                {result.examTitle}
              </h1>

              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono font-medium text-[#9A8C98]">
                <span className="text-[#F2E9E4] font-semibold tracking-wide uppercase">{result.subject}</span>
                <span className="text-[#C9ADA7]/60">•</span>
                <span>{result.totalQuestions} QUESTIONS</span>
                {result.totalTimeSeconds ? (
                  <>
                    <span className="text-[#C9ADA7]/60">•</span>
                    <span>{Math.round(result.totalTimeSeconds / 60)} MIN</span>
                  </>
                ) : null}
              </div>
            </div>

            {/* RIGHT / CENTER: Focal Score & Performance Breakdown */}
            <div className="flex flex-col items-start md:items-end justify-center p-4 sm:p-5 rounded-xl bg-[#4A4E69]/25 border border-[#C9ADA7]/20 shrink-0 w-full md:w-auto sm:min-w-[280px] max-w-full min-w-0">
              <div className="w-full space-y-2.5">
                {/* 1. FINAL SCORE */}
                <div className="space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#9A8C98] font-bold">
                    FINAL SCORE
                  </div>
                  <div className="text-3xl sm:text-4xl font-mono font-extrabold text-[#F2E9E4] tracking-tight leading-none">
                    {result.score}
                    <span className="text-lg sm:text-xl font-normal text-[#9A8C98]"> / {result.maxScore}</span>
                  </div>
                </div>

                {/* 2. SCORE PERCENTAGE */}
                <div className="text-xs font-mono font-bold text-[#F2E9E4]">
                  {result.percentage}% SCORE
                </div>

                {/* 3. COMPACT PERFORMANCE BREAKDOWN */}
                <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 pt-2 border-t border-[#4A4E69]/50 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-[#F2E9E4]">
                    <Check className="w-3.5 h-3.5 text-[#C9ADA7] stroke-[2.5]" />
                    <span className="font-bold">{result.correctCount}</span>
                    <span className="text-[10px] uppercase text-[#9A8C98]">CORRECT</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#F2E9E4]">
                    <X className="w-3.5 h-3.5 text-[#C9ADA7] stroke-[2.5]" />
                    <span className="font-bold">{result.wrongCount}</span>
                    <span className="text-[10px] uppercase text-[#9A8C98]">WRONG</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#F2E9E4]">
                    <Circle className="w-3 h-3 text-[#9A8C98] stroke-[2.5]" />
                    <span className="font-bold">{result.unattemptedCount}</span>
                    <span className="text-[10px] uppercase text-[#9A8C98]">UNATTEMPTED</span>
                  </div>
                </div>

                {/* 4. ACCURACY */}
                <div className="text-[11px] font-mono font-semibold text-[#C9ADA7]">
                  {result.accuracy}% ACCURACY
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. MEME / REACTION CARD */}
        {showMeme && (
          <div className="liquid-glass-panel rounded-2xl p-5 sm:p-6 shadow-sm border border-white/80">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200/70 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-indigo-700 font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>EXAM PERFORMANCE REACTION · {currentMeme.theme}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleNextReaction}
                  className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                >
                  ANOTHER REACTION
                </button>
                <button
                  type="button"
                  onClick={() => setShowMeme(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  HIDE
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
              {/* Meme Visual */}
              <div className="w-full sm:w-56 h-44 sm:h-48 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200/80 flex items-center justify-center shadow-2xs">
                {currentMeme.image && (
                  <img
                    src={currentMeme.image}
                    alt={currentMeme.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    width={224}
                    height={192}
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
                  <div className="shrink-0 self-center sm:self-start text-center px-4 py-2 bg-slate-900 text-white rounded-xl border border-slate-800 shadow-sm min-w-[130px]">
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
                    className="liquid-glass-btn-secondary inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold rounded-lg cursor-pointer"
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
          <div className="liquid-glass-panel rounded-2xl p-4 shadow-sm border border-white/80 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <span className="text-slate-500 uppercase font-semibold">AURA RESULT:</span>
              <span className={`font-mono font-bold ${aura.points > 0 ? 'text-amber-600' : 'text-rose-600'}`}>{aura.pointsDisplay}</span>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <span className="text-slate-700 uppercase font-bold">{aura.category}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowMeme(true)}
              className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
            >
              SHOW REACTION
            </button>
          </div>
        )}

        {/* 3. PERFORMANCE BREAKDOWN METRICS */}
        <div className="liquid-glass-panel rounded-2xl p-4 sm:p-5 shadow-sm border border-white/80">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
            <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl shadow-2xs">
              <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold block mb-1">
                CORRECT
              </span>
              <span className="font-mono text-2xl font-bold text-emerald-950 tabular-nums">
                {padNum(result.correctCount)}
              </span>
            </div>

            <div className="p-3 bg-rose-50/80 border border-rose-200/80 rounded-xl shadow-2xs">
              <span className="text-[10px] font-mono uppercase text-rose-800 font-bold block mb-1">
                WRONG
              </span>
              <span className="font-mono text-2xl font-bold text-rose-950 tabular-nums">
                {padNum(result.wrongCount)}
              </span>
            </div>

            <div className="p-3 bg-white/70 border border-slate-200/80 rounded-xl shadow-2xs">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block mb-1">
                UNATTEMPTED
              </span>
              <span className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
                {padNum(result.unattemptedCount)}
              </span>
            </div>

            <div className="p-3 bg-white/70 border border-slate-200/80 rounded-xl shadow-2xs">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block mb-1">
                ACCURACY
              </span>
              <span className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
                {result.accuracy}%
              </span>
            </div>

            <div className="p-3 bg-white/70 border border-slate-200/80 rounded-xl shadow-2xs col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block mb-1">
                TIME TAKEN
              </span>
              <span className="font-mono text-xl font-bold text-slate-900 block pt-0.5 tabular-nums">
                {formatSeconds(result.timeTakenSeconds)}
              </span>
            </div>
          </div>
        </div>

        {/* 4. QUESTION REVIEW SECTION */}
        <div className="liquid-glass-panel rounded-2xl p-5 sm:p-6 shadow-sm border border-white/80 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/70">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Question Review & Solutions
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Verify choices against official explanations
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-xl border border-slate-300/60 font-mono text-xs flex-wrap">
              <button
                type="button"
                onClick={() => setReviewFilter('all')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  reviewFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ALL ({result.totalQuestions})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter('incorrect')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  reviewFilter === 'incorrect' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-rose-700'
                }`}
              >
                WRONG ({result.wrongCount})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter('unattempted')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  reviewFilter === 'unattempted' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                UNATTEMPTED ({result.unattemptedCount})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter('correct')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  reviewFilter === 'correct' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-emerald-700'
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
                  className="p-4 sm:p-5 rounded-xl border border-slate-200/80 bg-white/60 space-y-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white shadow-2xs">
                        Q.{padNum(qNum)}
                      </span>
                      <span className="text-slate-500 uppercase">{q.topic}</span>
                      <span className="text-slate-300">·</span>
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
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-mono text-xs transition-all cursor-pointer ${
                        isBookmarked(q.id)
                          ? 'border-amber-300 bg-amber-400 text-amber-950 font-bold shadow-2xs'
                          : 'liquid-glass-btn-secondary text-slate-600'
                      }`}
                    >
                      <Bookmark className={`w-3 h-3 ${isBookmarked(q.id) ? 'fill-amber-950 text-amber-950' : 'text-slate-400'}`} />
                      <span>{isBookmarked(q.id) ? 'SAVED' : 'SAVE'}</span>
                    </button>
                  </div>

                  {/* Question */}
                  <p className="text-sm sm:text-base font-semibold text-slate-950 leading-relaxed">
                    {formatMathText(q.question)}
                  </p>

                  {/* Options */}
                  <div className="space-y-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isThisCorrect = typeof q.correctAnswer === 'number'
                        ? q.correctAnswer === optIdx
                        : Array.isArray(q.correctAnswer) && q.correctAnswer.includes(optIdx);

                      const isThisSelected = typeof userAns === 'number'
                        ? userAns === optIdx
                        : Array.isArray(userAns) && userAns.includes(optIdx);

                      let cardStyle = 'border-slate-200/80 bg-white/70 text-slate-700';

                      if (isThisCorrect) {
                        cardStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-semibold ring-1 ring-emerald-500 shadow-xs';
                      } else if (isThisSelected && !isThisCorrect) {
                        cardStyle = 'border-rose-400 bg-rose-50/80 text-rose-950 font-semibold ring-1 ring-rose-400 shadow-xs';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-start justify-between gap-3 ${cardStyle}`}
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
                    <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs space-y-1 shadow-2xs">
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
        <div className="liquid-glass-panel rounded-2xl p-4 shadow-sm border border-white/80 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onBackToHome}
            className="liquid-glass-btn-secondary flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono font-bold rounded-xl cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>EXAM LIST</span>
          </button>

          <div className="flex items-center gap-3">
            {wrongQuestionsList.length > 0 && (
              <button
                onClick={() => onPracticeWrong(wrongQuestionsList)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>PRACTICE WRONG ({wrongQuestionsList.length})</span>
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setShowRetakeMenu(!showRetakeMenu)}
                className="liquid-glass-btn-primary flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-xl cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RETAKE PAPER</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showRetakeMenu && (
                <div className="absolute right-0 bottom-full mb-2 w-60 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl shadow-xl p-1.5 z-20 font-mono text-xs space-y-0.5">
                  <button
                    onClick={() => {
                      setShowRetakeMenu(false);
                      onRetake({ shuffleQuestions: false, shuffleOptions: false });
                    }}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold transition-colors cursor-pointer"
                  >
                    Original Question Order
                  </button>
                  <button
                    onClick={() => {
                      setShowRetakeMenu(false);
                      onRetake({ shuffleQuestions: true, shuffleOptions: false });
                    }}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold transition-colors cursor-pointer"
                  >
                    Shuffle Question Order
                  </button>
                  <button
                    onClick={() => {
                      setShowRetakeMenu(false);
                      onRetake({ shuffleQuestions: true, shuffleOptions: true });
                    }}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold transition-colors cursor-pointer"
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

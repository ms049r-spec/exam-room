import React, { useState, useEffect, useRef } from 'react';
import { ActiveExamSession, ExamResult, Question } from '../types/exam';
import { QuestionRenderer } from './QuestionRenderer';
import { QuestionPalette } from './QuestionPalette';
import { SubmitConfirmModal } from './SubmitConfirmModal';
import { calculateExamResult } from '../utils/examEngine';
import { localStore } from '../storage/localStore';
import { useUserData } from '../context/UserDataContext';

interface ExamEngineProps {
  initialSession: ActiveExamSession;
  onFinishExam: (result: ExamResult) => void;
  onQuitExam: () => void;
}

export const ExamEngine: React.FC<ExamEngineProps> = ({
  initialSession,
  onFinishExam,
  onQuitExam
}) => {
  const [session, setSession] = useState<ActiveExamSession>(initialSession);
  const [currentIndex, setCurrentIndex] = useState<number>(session.currentIndex || 0);
  const [answers, setAnswers] = useState<Record<string, number | number[]>>(session.answers || {});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>(session.markedForReview || {});
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const { isBookmarked, toggleBookmark } = useUserData();

  // Countdown timer
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    if (session.timeMode === 'timed' && session.targetEndTime) {
      return Math.max(0, Math.round((session.targetEndTime - Date.now()) / 1000));
    }
    return 0;
  });

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(() => {
    return Math.max(0, Math.round((Date.now() - session.startedAt) / 1000));
  });

  // Save session state to localStorage
  useEffect(() => {
    const updated: ActiveExamSession = {
      ...session,
      currentIndex,
      answers,
      markedForReview
    };
    localStore.saveActiveSession(updated);
  }, [session, currentIndex, answers, markedForReview]);

  // Main countdown timer loop
  const autoSubmittedRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setElapsedSeconds(Math.max(0, Math.round((now - session.startedAt) / 1000)));

      if (session.timeMode === 'timed' && session.targetEndTime) {
        const remaining = Math.max(0, Math.round((session.targetEndTime - now) / 1000));
        setSecondsRemaining(remaining);

        if (remaining <= 0 && !autoSubmittedRef.current) {
          autoSubmittedRef.current = true;
          handleSubmitExam();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  const currentQuestion: Question | undefined = session.questions[currentIndex];

  const handleSelectAnswer = (ans: number | number[]) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: ans
    }));
  };

  const handleClearResponse = () => {
    if (!currentQuestion) return;
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQuestion.id];
      return copy;
    });
  };

  const handleToggleMarkForReview = () => {
    if (!currentQuestion) return;
    setMarkedForReview((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id]
    }));
  };

  const handleToggleBookmark = async (questionId: string) => {
    await toggleBookmark(questionId);
  };

  const handleNext = () => {
    if (currentIndex < session.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSelectQuestion = (index: number) => {
    setCurrentIndex(index);
  };

  const handleSubmitExam = () => {
    localStore.clearActiveSession();
    const currentSessionState: ActiveExamSession = {
      ...session,
      answers,
      markedForReview
    };
    const result = calculateExamResult(currentSessionState, Date.now());
    onFinishExam(result);
  };

  const formatTime = (totalSecs: number) => {
    const minutes = Math.floor(totalSecs / 60);
    const seconds = totalSecs % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  const padNum = (n: number) => n.toString().padStart(2, '0');

  let answeredCount = 0;
  let markedCount = 0;
  session.questions.forEach((q) => {
    const ans = answers[q.id];
    if (ans !== undefined && (Array.isArray(ans) ? ans.length > 0 : true)) {
      answeredCount += 1;
    }
    if (markedForReview[q.id]) {
      markedCount += 1;
    }
  });
  const unansweredCount = session.questions.length - answeredCount;

  const examCode = (session.subject.slice(0, 3) + '-01').toUpperCase();

  return (
    <div className="min-h-screen liquid-glass-ambient text-slate-900 flex flex-col font-sans w-full">
      {/* 1. BAND ONE: LIQUID GLASS HEADER */}
      <header className="liquid-glass-dark text-white px-2.5 sm:px-6 py-2.5 sm:py-3 sticky top-0 z-30 w-full border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4 font-mono text-xs w-full min-w-0">
          {/* Logo & Paper Details */}
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#22223B] border border-[#C9ADA7]/40 flex items-center justify-center font-bold text-[#F2E9E4] text-[10px] sm:text-xs shadow-xs shrink-0">
              CBT
            </div>
            <span className="font-bold tracking-tight text-white uppercase shrink-0 text-xs sm:text-sm">
              EXAM ROOM
            </span>
            <span className="text-white/20 hidden sm:inline" aria-hidden="true">·</span>
            <span className="font-medium text-slate-200 uppercase truncate text-[10px] sm:text-xs max-w-[110px] sm:max-w-xs md:max-w-md">
              {examCode} · {session.examTitle}
            </span>
          </div>

          {/* Question Index, Timer, Submit */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 ml-auto">
            <span className="hidden md:inline text-slate-300 text-[11px] bg-white/6 px-2.5 py-1 rounded-lg border border-white/10 tabular-nums">
              Q {padNum(currentIndex + 1)} / {padNum(session.questions.length)}
            </span>

            {/* Timer Badge */}
            <div className={`font-mono text-xs sm:text-sm font-bold px-2.5 sm:px-3 py-1 rounded-xl border tabular-nums ${
              session.timeMode === 'timed' && secondsRemaining <= 300
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                : 'bg-white/8 text-white border-white/15'
            }`}>
              {session.timeMode === 'timed' ? (
                <span>{formatTime(secondsRemaining)}</span>
              ) : (
                <span>{formatTime(elapsedSeconds)}</span>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={() => setShowSubmitModal(true)}
              className="liquid-glass-btn-primary px-3 sm:px-4 py-1 sm:py-1.5 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-2xs"
            >
              SUBMIT
            </button>

            {/* Exit */}
            <button
              onClick={onQuitExam}
              className="text-slate-400 hover:text-white px-1.5 sm:px-2 py-1 text-xs font-mono transition-colors cursor-pointer"
            >
              Exit
            </button>
          </div>
        </div>
      </header>

      {/* 2. BAND TWO: QUESTION AREA */}
      <main className="max-w-7xl mx-auto w-full px-2.5 sm:px-6 py-4 sm:py-8 flex-1 flex flex-col min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start flex-1 w-full">
          {/* Main Question Stage (8 cols) */}
          <div className="lg:col-span-8 space-y-6 w-full">
            {currentQuestion && (
              <QuestionRenderer
                question={currentQuestion}
                questionNumber={currentIndex + 1}
                totalQuestions={session.questions.length}
                userAnswer={answers[currentQuestion.id]}
                onSelectAnswer={handleSelectAnswer}
                isBookmarked={isBookmarked(currentQuestion.id)}
                onToggleBookmark={() => handleToggleBookmark(currentQuestion.id)}
              />
            )}

            {/* In-Between Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 font-mono text-xs w-full">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={handleToggleMarkForReview}
                  className={`px-4 py-2.5 rounded-xl font-bold uppercase transition-all cursor-pointer flex-1 sm:flex-initial text-center shadow-2xs ${
                    currentQuestion && markedForReview[currentQuestion.id]
                      ? 'bg-amber-400 text-amber-950 border border-amber-500/80 shadow-xs'
                      : 'liquid-glass-btn-secondary text-slate-800'
                  }`}
                >
                  {currentQuestion && markedForReview[currentQuestion.id]
                    ? '★ Marked for Review'
                    : 'Mark for Review'}
                </button>

                <button
                  type="button"
                  onClick={handleClearResponse}
                  disabled={!currentQuestion || answers[currentQuestion.id] === undefined}
                  className="liquid-glass-btn-secondary px-3.5 py-2.5 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed uppercase font-bold cursor-pointer"
                >
                  Clear Choice
                </button>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="liquid-glass-btn-secondary flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed uppercase font-bold cursor-pointer text-center"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentIndex === session.questions.length - 1}
                  className="liquid-glass-btn-primary flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed uppercase font-bold cursor-pointer text-center"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* 3. BAND THREE: QUESTION PALETTE (Desktop Sticky 4 cols) */}
          <div className="hidden lg:block lg:col-span-4 sticky top-16 w-full">
            <QuestionPalette
              questions={session.questions}
              currentIndex={currentIndex}
              answers={answers}
              markedForReview={markedForReview}
              onSelectQuestion={handleSelectQuestion}
              onSubmitClick={() => setShowSubmitModal(true)}
            />
          </div>
        </div>

        {/* Mobile / Tablet Question Palette Inline Strip */}
        <div className="lg:hidden mt-8 pt-6 border-t border-slate-200/80 w-full">
          <QuestionPalette
            questions={session.questions}
            currentIndex={currentIndex}
            answers={answers}
            markedForReview={markedForReview}
            onSelectQuestion={handleSelectQuestion}
            onSubmitClick={() => setShowSubmitModal(true)}
          />
        </div>
      </main>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <SubmitConfirmModal
          totalQuestions={session.questions.length}
          answeredCount={answeredCount}
          unansweredCount={unansweredCount}
          markedCount={markedCount}
          onCancel={() => setShowSubmitModal(false)}
          onConfirm={handleSubmitExam}
        />
      )}
    </div>
  );
};

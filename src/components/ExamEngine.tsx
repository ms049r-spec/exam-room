import React, { useState, useEffect, useRef } from 'react';
import { ActiveExamSession, ExamResult, Question } from '../types/exam';
import { QuestionRenderer } from './QuestionRenderer';
import { QuestionPalette } from './QuestionPalette';
import { SubmitConfirmModal } from './SubmitConfirmModal';
import { calculateExamResult } from '../utils/examEngine';
import { localStore } from '../storage/localStore';

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
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({});

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

  // Track bookmarks on mount
  useEffect(() => {
    const bookmarks = localStore.getBookmarks();
    const map: Record<string, boolean> = {};
    bookmarks.forEach((id) => (map[id] = true));
    setBookmarkedMap(map);
  }, []);

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

  const handleToggleBookmark = (questionId: string) => {
    const isNowBookmarked = localStore.toggleBookmark(questionId);
    setBookmarkedMap((prev) => ({
      ...prev,
      [questionId]: isNowBookmarked
    }));
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
    localStore.saveResult(result);
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
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans w-full">
      {/* 1. BAND ONE: HEADER */}
      <header className="border-b border-[#D9D9D9] bg-[#FAFAFA] px-3 sm:px-6 py-2.5 sm:py-3 sticky top-0 z-30 w-full">
        <div className="max-w-7xl mx-auto flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 sm:gap-4 font-mono text-xs w-full">
          {/* Logo & Paper Details */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <span className="font-bold tracking-widest text-[#0A0A0A] uppercase shrink-0 text-xs sm:text-sm">
              EXAM ROOM
            </span>
            <span className="text-[#D9D9D9] hidden sm:inline">|</span>
            <span className="font-bold text-[#0A0A0A] uppercase truncate text-[11px] sm:text-xs">
              {examCode} / {session.examTitle}
            </span>
          </div>

          {/* Question Index, Timer, Submit */}
          <div className="flex items-center gap-3 sm:gap-6 shrink-0 ml-auto">
            <span className="hidden md:inline text-[#555555]">
              Q {padNum(currentIndex + 1)} / {padNum(session.questions.length)}
            </span>

            {/* Timer */}
            <div className="font-bold tracking-wider text-[#0A0A0A] text-xs sm:text-sm">
              {session.timeMode === 'timed' ? (
                <span>T-MINUS {formatTime(secondsRemaining)}</span>
              ) : (
                <span>ELAPSED {formatTime(elapsedSeconds)}</span>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={() => setShowSubmitModal(true)}
              className="bg-[#0047FF] hover:bg-[#0037c7] text-white px-3 sm:px-4 py-1 sm:py-1.5 font-bold uppercase tracking-wider transition-colors cursor-pointer text-xs"
            >
              SUBMIT
            </button>

            {/* Exit */}
            <button
              onClick={onQuitExam}
              className="text-[#555555] hover:text-[#0A0A0A] uppercase tracking-wider underline cursor-pointer text-xs"
            >
              [EXIT]
            </button>
          </div>
        </div>
      </header>

      {/* 2. BAND TWO: QUESTION AREA */}
      <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-8 flex-1 flex flex-col">
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
                isBookmarked={!!bookmarkedMap[currentQuestion.id]}
                onToggleBookmark={() => handleToggleBookmark(currentQuestion.id)}
              />
            )}

            {/* In-Between Action Bar */}
            <div className="pt-4 border-t border-[#D9D9D9] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 font-mono text-xs w-full">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={handleToggleMarkForReview}
                  className={`px-3 sm:px-4 py-2 border font-bold uppercase transition-colors cursor-pointer flex-1 sm:flex-initial text-center ${
                    currentQuestion && markedForReview[currentQuestion.id]
                      ? 'bg-amber-400 text-[#0A0A0A] border-amber-500'
                      : 'bg-white text-[#0A0A0A] border-[#D9D9D9] hover:border-[#0A0A0A]'
                  }`}
                >
                  {currentQuestion && markedForReview[currentQuestion.id]
                    ? '[★ MARKED FOR REVIEW]'
                    : '[ MARK FOR REVIEW ]'}
                </button>

                <button
                  type="button"
                  onClick={handleClearResponse}
                  disabled={!currentQuestion || answers[currentQuestion.id] === undefined}
                  className="px-3 sm:px-4 py-2 border border-[#D9D9D9] bg-white text-[#555555] hover:text-[#0A0A0A] hover:border-[#0A0A0A] disabled:opacity-25 disabled:cursor-not-allowed uppercase font-bold transition-colors cursor-pointer"
                >
                  [ CLEAR ]
                </button>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="flex-1 sm:flex-initial px-4 sm:px-5 py-2 border border-[#D9D9D9] bg-white text-[#0A0A0A] hover:border-[#0A0A0A] disabled:opacity-25 disabled:cursor-not-allowed uppercase font-bold transition-colors cursor-pointer text-center"
                >
                  [← PREVIOUS]
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentIndex === session.questions.length - 1}
                  className="flex-1 sm:flex-initial px-5 sm:px-6 py-2 bg-[#0A0A0A] hover:bg-[#0047FF] text-white disabled:opacity-25 disabled:cursor-not-allowed uppercase font-bold transition-colors cursor-pointer text-center"
                >
                  [NEXT →]
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
        <div className="lg:hidden mt-8 pt-6 border-t border-[#D9D9D9] w-full">
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

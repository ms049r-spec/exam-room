import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ExamDefinition } from '../types/exam';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

interface FeaturedExamCarouselProps {
  exams: ExamDefinition[];
  onSelectExam: (exam: ExamDefinition) => void;
}

export const FeaturedExamCarousel: React.FC<FeaturedExamCarouselProps> = ({
  exams,
  onSelectExam
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = exams.length;

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-rotate every 5 seconds; pause when hovered or focused
  useEffect(() => {
    if (total <= 1 || isPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      handleNext();
    }, 5000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [total, isPaused, handleNext, currentIndex]);

  if (!exams || exams.length === 0) return null;

  const currentExam = exams[currentIndex] || exams[0];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured Exams Carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') {
          handlePrev();
        } else if (e.key === 'ArrowRight') {
          handleNext();
        }
      }}
      tabIndex={0}
      className="bg-[#0f172a] text-white rounded-xl border border-slate-800 ring-1 ring-slate-800/80 p-5 sm:p-6 relative overflow-hidden shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <div className="flex flex-col gap-4 relative z-10">
        {/* Top Bar: Badges on the left, Carousel Controls on the right */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-indigo-600 border border-indigo-500/40 font-mono text-xs font-bold tracking-wider text-white uppercase">
              FEATURED EXAM
            </span>
            <span className="px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-xs text-indigo-300 font-bold uppercase tracking-wider">
              {currentExam.subject.toUpperCase()}
            </span>
            <span className="px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-xs text-slate-300 font-bold uppercase tracking-wider">
              {currentExam.tag.toUpperCase()}
            </span>
          </div>

          {/* Carousel Next / Previous and Counter */}
          {total > 1 && (
            <div className="flex items-center gap-1.5 font-mono text-xs text-slate-400">
              <span className="text-[11px] font-semibold text-slate-400 tabular-nums px-1.5">
                {currentIndex + 1} / {total}
              </span>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous featured exam"
                className="w-7 h-7 rounded-md bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next featured exam"
                className="w-7 h-7 rounded-md bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Content Body: Title, Description, Specs and CTA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl flex-1">
            <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-tight transition-all duration-200">
              {currentExam.title}
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-xl transition-all duration-200 min-h-[3rem] sm:min-h-[2.5rem]">
              {currentExam.description}
            </p>

            {/* Specs */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono pt-1 text-slate-300 tabular-nums">
              <span className="px-2 py-0.5 rounded bg-slate-800/90 border border-slate-700 font-bold text-white">
                {currentExam.questionCount} QUESTIONS
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800/90 border border-slate-700">
                {currentExam.defaultDurationMinutes} MIN
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800/90 border border-slate-700 text-indigo-300 font-bold">
                +{currentExam.markingScheme.correct} / {currentExam.markingScheme.incorrect}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800/90 border border-slate-700">
                TIMED / UNTIMED
              </span>
            </div>
          </div>

          {/* Start Button: Tactile */}
          <div className="shrink-0 flex items-center">
            <button
              type="button"
              onClick={() => onSelectExam(currentExam)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-mono font-bold tracking-wider uppercase text-slate-900 bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-200/50 rounded-lg shadow-xs hover:shadow-md transition-all duration-150 hover:scale-[1.02] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-900 text-slate-900" />
              <span>START EXAM</span>
            </button>
          </div>
        </div>

        {/* Pagination Dots */}
        {total > 1 && (
          <div className="flex items-center justify-center sm:justify-start gap-1.5 pt-2">
            {exams.map((exam, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={exam.id}
                  type="button"
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to slide ${index + 1}: ${exam.title}`}
                  className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'w-6 bg-indigo-400'
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

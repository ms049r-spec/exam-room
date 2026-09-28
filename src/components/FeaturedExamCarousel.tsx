import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ExamDefinition } from '../types/exam';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

interface FeaturedExamCarouselProps {
  exams: ExamDefinition[];
  onSelectExam: (exam: ExamDefinition) => void;
}

export const FeaturedExamCarousel: React.FC<FeaturedExamCarouselProps> = React.memo(({
  exams,
  onSelectExam
}) => {
  // Enforce strictly at most 2 featured slots
  const displayedExams = exams.slice(0, 2);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = displayedExams.length;

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

  if (!displayedExams || displayedExams.length === 0) return null;

  const currentExam = displayedExams[currentIndex] || displayedExams[0];

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
      className="bg-[#22223B] text-[#F2E9E4] border border-[#C9ADA7]/40 ring-1 ring-[#22223B] shadow-md rounded-2xl p-4 sm:p-7 relative overflow-hidden isolate focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9ADA7] transition-all duration-300 w-full max-w-full min-w-0 transform-gpu"
    >
      {/* Ambient optical refraction fields in Space Indigo / Dusty Grape / Almond Silk */}
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#4A4E69]/25 blur-2xl pointer-events-none transform-gpu" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#C9ADA7]/12 blur-2xl pointer-events-none transform-gpu" />

      <div className="flex flex-col gap-4 sm:gap-5 relative z-10 w-full min-w-0">
        {/* Top Bar: Badges on the left, Carousel Controls on the right */}
        <div className="flex items-center justify-between gap-2.5 sm:gap-3 flex-wrap w-full min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="px-2.5 sm:px-3 py-1 rounded-full bg-[#C9ADA7] text-[#22223B] font-mono text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase shadow-2xs">
              FEATURED EXAM
            </span>
            <span className="px-2 sm:px-2.5 py-1 rounded-full bg-white/20 border border-white/20 font-mono text-[10px] sm:text-[11px] text-[#F2E9E4] font-bold uppercase tracking-wider">
              {currentExam.subject.toUpperCase()}
            </span>
            <span className="px-2 sm:px-2.5 py-1 rounded-full bg-[#4A4E69]/40 border border-[#9A8C98]/30 font-mono text-[10px] sm:text-[11px] text-[#C9ADA7] font-semibold uppercase tracking-wider">
              {(currentExam.tag || 'Standard Paper').toUpperCase()}
            </span>
          </div>

          {/* Carousel Next / Previous and Counter */}
          {total > 1 && (
            <div className="flex items-center gap-1.5 font-mono text-xs text-[#F2E9E4] bg-[#4A4E69]/50 border border-[#9A8C98]/40 px-2 py-1 rounded-xl shrink-0">
              <span className="text-[11px] font-semibold text-[#F2E9E4] tabular-nums px-1">
                {currentIndex + 1} / {total}
              </span>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous featured exam"
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-[#F2E9E4] transition-all cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next featured exam"
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-[#F2E9E4] transition-all cursor-pointer active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Content Body: Title, Description, Specs and CTA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6 w-full min-w-0">
          <div className="space-y-2.5 max-w-2xl flex-1 min-w-0 w-full">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#F2E9E4] tracking-tight leading-tight transition-all duration-200 break-words">
              {currentExam.title}
            </h2>

            <p className="text-xs sm:text-sm text-[#F2E9E4]/85 leading-relaxed font-sans max-w-xl transition-all duration-200 break-words">
              {currentExam.description}
            </p>

            {/* Specs Strip */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-mono pt-1 text-[#F2E9E4] tabular-nums max-w-full">
              <span className="px-2 sm:px-2.5 py-1 rounded-lg bg-white/15 border border-white/20 font-bold text-[#F2E9E4] shadow-2xs">
                {currentExam.questionCount} QUESTIONS
              </span>
              <span className="px-2 sm:px-2.5 py-1 rounded-lg bg-[#4A4E69]/40 border border-[#9A8C98]/30 text-[#F2E9E4]">
                {currentExam.defaultDurationMinutes} MIN
              </span>
              <span className="px-2 sm:px-2.5 py-1 rounded-lg bg-[#C9ADA7]/20 border border-[#C9ADA7]/40 text-[#C9ADA7] font-bold">
                +{currentExam.markingScheme.correct} / {currentExam.markingScheme.incorrect}
              </span>
              <span className="px-2 sm:px-2.5 py-1 rounded-lg bg-[#4A4E69]/40 border border-[#9A8C98]/30 text-[#9A8C98]">
                TIMED / UNTIMED
              </span>
            </div>
          </div>

          {/* Start Button: Tactile Parchment on Space Indigo Button */}
          <div className="w-full md:w-auto shrink-0 flex items-center">
            <button
              type="button"
              onClick={() => onSelectExam(currentExam)}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-mono font-bold tracking-wider uppercase text-[#22223B] bg-[#F2E9E4] hover:bg-white active:bg-[#E5DAD4] border border-[#C9ADA7]/60 rounded-xl shadow-[0_8px_24px_-4px_rgba(34,34,59,0.35),inset_0_1px_1px_0_rgba(255,255,255,0.9)] hover:shadow-[0_12px_28px_-2px_rgba(34,34,59,0.45)] transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9ADA7] cursor-pointer"
            >
              <Play className="w-4 h-4 fill-[#22223B] text-[#22223B]" />
              <span>START EXAM</span>
            </button>
          </div>
        </div>

        {/* Pagination Dots */}
        {total > 1 && (
          <div className="flex items-center justify-center sm:justify-start gap-1.5 pt-2">
            {displayedExams.map((exam, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={exam.id}
                  type="button"
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to slide ${index + 1}: ${exam.title}`}
                  className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'w-6 bg-[#C9ADA7] shadow-[0_0_8px_rgba(201,173,167,0.7)]'
                      : 'w-2 bg-[#9A8C98]/40 hover:bg-[#9A8C98]/70'
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});

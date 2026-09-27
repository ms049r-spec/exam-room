import React from 'react';
import { Question } from '../types/exam';

interface PracticeViewProps {
  onStartDailyPractice: () => void;
  onGoToWrongQuestions: () => void;
  onGoToBookmarks: () => void;
  onOpenCustomCompiler: () => void;
  wrongCount: number;
  bookmarksCount: number;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  onStartDailyPractice,
  onGoToWrongQuestions,
  onGoToBookmarks,
  onOpenCustomCompiler,
  wrongCount,
  bookmarksCount
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10 font-sans">
      {/* Header */}
      <div className="border-b border-[#0A0A0A] pb-3">
        <span className="font-mono text-xs font-bold text-[#555555] uppercase tracking-wider block mb-0.5">
          TRAINING & REMEDIATION // DRILL MODULES
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0A0A0A] tracking-tight uppercase">
          PRACTICE
        </h1>
      </div>

      {/* 1. DAILY PRACTICE SPECIFICATION */}
      <section className="border border-[#D9D9D9] bg-white p-6 sm:p-8 space-y-5">
        <div className="space-y-1">
          <span className="font-mono text-xs font-bold text-[#0047FF] uppercase tracking-wider block">
            FEATURED DRILL // AUTOMATIC SELECTION
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0A0A0A] uppercase tracking-tight">
            DAILY PRACTICE
          </h2>
          <p className="text-xs sm:text-sm text-[#555555]">
            Curated 20-problem diagnostic set selected dynamically across all syllabus chapters for conceptual reinforcement.
          </p>
        </div>

        {/* Metadata Strip */}
        <div className="grid grid-cols-3 border border-[#D9D9D9] divide-x divide-[#D9D9D9] font-mono text-xs text-center py-3 bg-[#FAFAFA]">
          <div>
            <span className="text-[10px] text-[#555555] block uppercase">ITEMS</span>
            <span className="font-bold text-[#0A0A0A] text-sm">20 QUESTIONS</span>
          </div>
          <div>
            <span className="text-[10px] text-[#555555] block uppercase">ALLOCATION</span>
            <span className="font-bold text-[#0A0A0A] text-sm">30 MINUTES</span>
          </div>
          <div>
            <span className="text-[10px] text-[#555555] block uppercase">SCOPE</span>
            <span className="font-bold text-[#0A0A0A] text-sm">MIXED SUBJECTS</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onStartDailyPractice}
            className="font-mono text-xs font-bold uppercase tracking-wider bg-[#0047FF] hover:bg-[#0037c7] text-white px-8 py-3.5 transition-colors cursor-pointer"
          >
            START DAILY PRACTICE →
          </button>
        </div>
      </section>

      {/* 2. STRUCTURED TARGETED DRILLS (NO CARDS, STRUCTURED ROWS) */}
      <section className="space-y-4">
        <div className="font-mono text-xs font-bold text-[#0A0A0A] uppercase tracking-wider border-b border-[#0A0A0A] pb-1.5">
          TARGETED DRILL MODULES
        </div>

        <div className="border border-[#D9D9D9] bg-white divide-y divide-[#D9D9D9]">
          {/* Module: Wrong Questions */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 font-mono text-xs">
            <div className="space-y-1 sm:w-2/3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#0A0A0A] uppercase">WRONG QUESTIONS REMEDIATION</span>
                <span className="text-[#0047FF] font-bold">[{wrongCount} ITEMS]</span>
              </div>
              <p className="font-sans text-xs text-[#555555]">
                Systematically drill problems you missed in past exam sessions until conceptual error rate drops to zero.
              </p>
            </div>

            <button
              onClick={onGoToWrongQuestions}
              disabled={wrongCount === 0}
              className="bg-[#0A0A0A] hover:bg-[#0047FF] disabled:opacity-25 text-white px-5 py-2.5 font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              LAUNCH REMEDIATION →
            </button>
          </div>

          {/* Module: Bookmarked Questions */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 font-mono text-xs">
            <div className="space-y-1 sm:w-2/3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#0A0A0A] uppercase">BOOKMARKED QUESTIONS VAULT</span>
                <span className="text-[#0047FF] font-bold">[{bookmarksCount} ITEMS]</span>
              </div>
              <p className="font-sans text-xs text-[#555555]">
                Take a targeted practice test composed exclusively of questions you manually flagged for review.
              </p>
            </div>

            <button
              onClick={onGoToBookmarks}
              disabled={bookmarksCount === 0}
              className="bg-[#0A0A0A] hover:bg-[#0047FF] disabled:opacity-25 text-white px-5 py-2.5 font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              LAUNCH BOOKMARKS →
            </button>
          </div>

          {/* Module: Random / Custom Compiler */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 font-mono text-xs">
            <div className="space-y-1 sm:w-2/3">
              <span className="font-bold text-sm text-[#0A0A0A] uppercase">CUSTOM EXAM COMPILER</span>
              <p className="font-sans text-xs text-[#555555]">
                Assemble custom practice tests with tailored item count (5–34), specific difficulty, and custom duration.
              </p>
            </div>

            <button
              onClick={onOpenCustomCompiler}
              className="border border-[#0A0A0A] bg-white hover:bg-[#FAFAFA] text-[#0A0A0A] px-5 py-2.5 font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              COMPILE EXAM →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

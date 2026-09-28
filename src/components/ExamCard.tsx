import React from 'react';
import { ExamDefinition } from '../types/exam';
import { ArrowRight } from 'lucide-react';

interface ExamCardProps {
  exam: ExamDefinition;
  onSelect: (exam: ExamDefinition) => void;
  bestScorePercentage?: number | null;
}

export const ExamCard: React.FC<ExamCardProps> = ({ exam, onSelect, bestScorePercentage }) => {
  const getSubjectAccent = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'biology':
        return 'from-emerald-500 to-teal-500';
      case 'physics':
        return 'from-amber-500 to-orange-500';
      case 'chemistry':
        return 'from-cyan-500 to-blue-500';
      default:
        return 'from-indigo-500 to-purple-500';
    }
  };

  return (
    <div
      onClick={() => onSelect(exam)}
      className="liquid-glass-card group cursor-pointer rounded-2xl p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden active:scale-[0.99] transition-all duration-200"
    >
      {/* Subtle top light refraction accent per subject */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${getSubjectAccent(exam.subject)} opacity-90`} />

      {/* Top Paper Header: Subject & Standard */}
      <div>
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold font-mono tracking-wider text-indigo-700 uppercase">
              {exam.subject}
            </span>
            <span className="text-slate-300" aria-hidden="true">/</span>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">
              {exam.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {bestScorePercentage !== undefined && bestScorePercentage !== null && (
              <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30 tabular-nums">
                BEST: {bestScorePercentage}%
              </span>
            )}
            <span className="text-[10px] font-mono font-semibold text-slate-700 uppercase tracking-wider bg-white/70 px-2.5 py-0.5 rounded-full border border-slate-200/80 shadow-2xs">
              {exam.tag}
            </span>
          </div>
        </div>

        {/* Paper Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug mb-3.5">
          {exam.title}
        </h3>

        {/* Test Paper Specs Row: Structured Data Badges */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono py-1.5 px-2 bg-slate-50/70 rounded-xl border border-slate-200/60 mb-4 tabular-nums">
          <span className="px-2 py-0.5 rounded-lg bg-white border border-slate-200/80 text-slate-800 font-semibold text-[11px] shadow-2xs">
            {exam.questionCount} Questions
          </span>
          <span className="text-slate-400">·</span>
          <span className="px-2 py-0.5 rounded-lg bg-white border border-slate-200/80 text-slate-600 font-medium text-[11px] shadow-2xs">
            {exam.defaultDurationMinutes} Min
          </span>
          <span className="text-slate-400">·</span>
          <span className="px-2 py-0.5 rounded-lg bg-white border border-indigo-200 text-indigo-700 font-semibold text-[11px] shadow-2xs">
            +{exam.markingScheme.correct} / {exam.markingScheme.incorrect}
          </span>
        </div>
      </div>

      {/* Action Strip: Tactile liquid glass button */}
      <div className="pt-2 flex items-center justify-end">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(exam);
          }}
          className="liquid-glass-btn-secondary inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer"
        >
          <span>START</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

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
        return 'bg-emerald-600';
      case 'physics':
        return 'bg-amber-600';
      case 'chemistry':
        return 'bg-cyan-600';
      default:
        return 'bg-indigo-600';
    }
  };

  return (
    <div
      onClick={() => onSelect(exam)}
      className="group cursor-pointer bg-white rounded-lg border border-slate-200 hover:border-slate-400 transition-all p-4 sm:p-5 flex flex-col justify-between shadow-2xs hover:shadow-xs relative overflow-hidden"
    >
      {/* Subtle top accent highlight per subject */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${getSubjectAccent(exam.subject)}`} />

      {/* Top Paper Header: Subject & Standard */}
      <div>
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200">
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
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 tabular-nums">
                BEST: {bestScorePercentage}%
              </span>
            )}
            <span className="text-[10px] font-mono font-semibold text-slate-600 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {exam.tag}
            </span>
          </div>
        </div>

        {/* Paper Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug mb-3">
          {exam.title}
        </h3>

        {/* Test Paper Specs Row: Structured Data Badges */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono py-1.5 px-2 bg-slate-100/80 rounded-md border border-slate-200/80 mb-4 tabular-nums">
          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-semibold text-[11px]">
            {exam.questionCount} Questions
          </span>
          <span className="text-slate-400">·</span>
          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-medium text-[11px]">
            {exam.defaultDurationMinutes} Min
          </span>
          <span className="text-slate-400">·</span>
          <span className="px-2 py-0.5 rounded bg-white border border-indigo-200 text-indigo-700 font-semibold text-[11px]">
            +{exam.markingScheme.correct} / {exam.markingScheme.incorrect}
          </span>
        </div>
      </div>

      {/* Action Strip: Tactile secondary button */}
      <div className="pt-2 flex items-center justify-end">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(exam);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-bold text-slate-800 bg-slate-100/90 hover:bg-slate-900 hover:text-white border border-slate-300 hover:border-slate-900 rounded-md transition-all shadow-2xs group-hover:border-slate-400 active:scale-[0.98] cursor-pointer"
        >
          <span>START</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

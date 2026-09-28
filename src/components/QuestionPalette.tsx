import React from 'react';
import { Question } from '../types/exam';
import { ArrowRight, CheckCircle2, Bookmark, HelpCircle, Sparkles } from 'lucide-react';

interface QuestionPaletteProps {
  questions: Question[];
  currentIndex: number;
  answers: Record<string, number | number[]>;
  markedForReview: Record<string, boolean>;
  onSelectQuestion: (index: number) => void;
  onSubmitClick: () => void;
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  questions,
  currentIndex,
  answers,
  markedForReview,
  onSelectQuestion,
  onSubmitClick
}) => {
  let answeredCount = 0;
  let markedCount = 0;

  questions.forEach((q) => {
    const ans = answers[q.id];
    const isAnswered = ans !== undefined && (Array.isArray(ans) ? ans.length > 0 : true);
    if (isAnswered) answeredCount += 1;
    if (markedForReview[q.id]) markedCount += 1;
  });

  const padNum = (n: number) => n.toString().padStart(2, '0');

  const getCellClasses = (index: number, question: Question) => {
    const isCurrent = index === currentIndex;
    const ans = answers[question.id];
    const isAnswered = ans !== undefined && (Array.isArray(ans) ? ans.length > 0 : true);
    const isMarked = !!markedForReview[question.id];

    let base = 'font-mono text-xs font-bold h-8 w-8 sm:h-9 sm:w-9 rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer ';

    if (isCurrent) {
      return (
        base +
        'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400 ring-offset-2 ring-offset-white z-10 scale-105'
      );
    }
    if (isMarked) {
      return (
        base +
        'bg-amber-400/90 hover:bg-amber-400 text-amber-950 border border-amber-500/50 shadow-2xs'
      );
    }
    if (isAnswered) {
      return (
        base +
        'bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 shadow-2xs'
      );
    }
    // UNANSWERED
    return (
      base +
      'bg-white/70 hover:bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 shadow-2xs'
    );
  };

  return (
    <div className="liquid-glass-panel rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm border border-white/80">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/70 pb-3 font-mono text-xs">
        <div>
          <span className="font-bold text-slate-900 uppercase tracking-wider block">
            Question Palette
          </span>
          <span className="text-[11px] text-slate-500">
            {answeredCount} of {questions.length} attempted
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 font-semibold text-[11px] border border-indigo-200/60 tabular-nums">
          {Math.round((answeredCount / (questions.length || 1)) * 100)}%
        </span>
      </div>

      {/* States Legend */}
      <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-slate-600 border-b border-slate-200/70 pb-3.5">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-slate-900 block shrink-0 border border-slate-800" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-white border border-slate-300 block shrink-0" />
          <span>Unanswered</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-amber-400 border border-amber-500 block shrink-0" />
          <span>Marked</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-indigo-600 block shrink-0 ring-1 ring-indigo-400" />
          <span>Current</span>
        </div>
      </div>

      {/* Grid of Rounded Tactile Cells */}
      <div className="grid grid-cols-6 sm:grid-cols-7 gap-1.5 max-h-[300px] overflow-y-auto pr-1 py-1">
        {questions.map((q, idx) => (
          <button
            key={q.id}
            type="button"
            onClick={() => onSelectQuestion(idx)}
            className={getCellClasses(idx, q)}
            title={`Go to Question ${idx + 1}`}
          >
            {padNum(idx + 1)}
          </button>
        ))}
      </div>

      {/* Submission CTA */}
      <div className="pt-2 border-t border-slate-200/70">
        <button
          type="button"
          onClick={onSubmitClick}
          className="liquid-glass-btn-primary w-full py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>SUBMIT EXAM</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

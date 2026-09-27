import React from 'react';
import { Question } from '../types/exam';

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

    let base = 'font-mono text-xs font-bold h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center transition-colors cursor-pointer border ';

    if (isCurrent) {
      return base + 'bg-[#0047FF] text-white border-[#0047FF] outline-2 outline-offset-1 outline-[#0047FF] z-10';
    }
    if (isMarked) {
      return base + 'bg-amber-400 text-[#0A0A0A] border-amber-500';
    }
    if (isAnswered) {
      return base + 'bg-[#0A0A0A] text-white border-[#0A0A0A]';
    }
    // UNANSWERED
    return base + 'bg-white text-[#555555] border-[#D9D9D9] hover:border-[#0A0A0A] hover:text-[#0A0A0A]';
  };

  return (
    <div className="border border-[#D9D9D9] bg-white p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D9D9D9] pb-2 font-mono text-xs">
        <span className="font-bold text-[#0A0A0A] uppercase tracking-wider">
          PALETTE // {padNum(answeredCount)} OF {padNum(questions.length)} ATTEMPTED
        </span>
      </div>

      {/* States Legend */}
      <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-[#555555] border-b border-[#D9D9D9] pb-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-[#0A0A0A] block shrink-0 border border-[#0A0A0A]" />
          <span>ANSWERED</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-white border border-[#D9D9D9] block shrink-0" />
          <span>UNANSWERED</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-amber-400 border border-amber-500 block shrink-0" />
          <span>MARKED</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-[#0047FF] block shrink-0 border border-[#0047FF]" />
          <span>CURRENT</span>
        </div>
      </div>

      {/* Grid of Compact Rectangular Cells */}
      <div className="grid grid-cols-7 sm:grid-cols-8 gap-1 max-h-[300px] overflow-y-auto pr-1">
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
      <div className="pt-2 border-t border-[#D9D9D9]">
        <button
          type="button"
          onClick={onSubmitClick}
          className="w-full font-mono text-xs font-bold uppercase tracking-wider bg-[#0047FF] hover:bg-[#0037c7] text-white py-2.5 transition-colors cursor-pointer"
        >
          SUBMIT EXAMINATION →
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { Question } from '../types/exam';
import { Bookmark, Check, Shield } from 'lucide-react';

interface QuestionRendererProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  userAnswer: number | number[] | undefined;
  onSelectAnswer: (answer: number | number[]) => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  questionNumber,
  totalQuestions,
  userAnswer,
  onSelectAnswer,
  isBookmarked,
  onToggleBookmark
}) => {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  const handleOptionClick = (index: number) => {
    if (question.type === 'multiple-choice') {
      const current = Array.isArray(userAnswer) ? [...userAnswer] : [];
      const pos = current.indexOf(index);
      if (pos > -1) {
        current.splice(pos, 1);
      } else {
        current.push(index);
      }
      onSelectAnswer(current);
    } else {
      onSelectAnswer(index);
    }
  };

  const isSelected = (index: number) => {
    if (question.type === 'multiple-choice') {
      return Array.isArray(userAnswer) && userAnswer.includes(index);
    }
    return userAnswer === index;
  };

  const padNum = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="liquid-glass-panel rounded-2xl p-5 sm:p-7 space-y-6 shadow-sm border border-white/80">
      {/* Top Question Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#4A4E69]/15 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-2 text-[#4A4E69]">
          <span className="font-extrabold text-[#22223B] tracking-wider uppercase text-xs sm:text-sm">
            QUESTION {padNum(questionNumber)} OF {padNum(totalQuestions)}
          </span>
          <span className="text-[#9A8C98]" aria-hidden="true">·</span>
          <span className="text-[#22223B] font-bold bg-[#C9ADA7]/30 px-2 py-0.5 rounded-md border border-[#C9ADA7]/60 tabular-nums">
            +{question.marks.correct} / {question.marks.incorrect}
          </span>
          <span className="text-[#9A8C98] hidden sm:inline" aria-hidden="true">·</span>
          <span className="text-[#4A4E69] uppercase tracking-wide hidden sm:inline">
            {question.topic}
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleBookmark}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs font-bold transition-all cursor-pointer shadow-2xs ${
            isBookmarked
              ? 'bg-[#C9ADA7] text-[#22223B] border-[#9A8C98]'
              : 'liquid-glass-btn-secondary text-[#22223B]'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#22223B] text-[#22223B]' : 'text-[#9A8C98]'}`} />
          <span>{isBookmarked ? 'SAVED' : 'SAVE'}</span>
        </button>
      </div>

      {/* Prominent Question Statement */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-[#22223B] leading-relaxed tracking-tight">
          {question.question}
        </h2>

        {/* Statements Variant */}
        {question.statements && question.statements.length > 0 && (
          <div className="p-4 bg-white/70 rounded-xl border border-[#9A8C98]/30 space-y-2 text-sm font-sans shadow-2xs">
            {question.statements.map((stmt, idx) => (
              <div key={idx} className="flex gap-3 text-[#22223B]">
                <span className="font-mono font-bold text-[#4A4E69] shrink-0">
                  {stmt.substring(0, stmt.indexOf('.'))}
                </span>
                <span className="leading-relaxed">{stmt.substring(stmt.indexOf('.') + 1)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Assertion-Reason Variant */}
        {question.assertion && question.reason && (
          <div className="space-y-2.5 text-sm">
            <div className="p-3.5 bg-white/70 rounded-xl border border-[#9A8C98]/30 shadow-2xs">
              <span className="text-xs font-mono font-bold text-[#4A4E69] block mb-1">
                ASSERTION (A):
              </span>
              <p className="text-[#22223B] font-medium leading-relaxed">{question.assertion}</p>
            </div>
            <div className="p-3.5 bg-white/70 rounded-xl border border-[#9A8C98]/30 shadow-2xs">
              <span className="text-xs font-mono font-bold text-[#4A4E69] block mb-1">
                REASON (R):
              </span>
              <p className="text-[#22223B] font-medium leading-relaxed">{question.reason}</p>
            </div>
          </div>
        )}

        {/* Match the Following Variant */}
        {question.columnA && question.columnB && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 bg-white/70 rounded-xl border border-[#9A8C98]/30 text-sm shadow-2xs">
            <div className="space-y-2">
              <span className="font-mono text-xs font-bold text-[#4A4E69] block border-b border-[#4A4E69]/15 pb-1">
                COLUMN I
              </span>
              {question.columnA.map((item) => (
                <div key={item.key} className="flex gap-2 text-xs font-mono">
                  <span className="font-bold text-[#22223B] w-4">{item.key}.</span>
                  <span className="text-[#22223B]">{item.text}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <span className="font-mono text-xs font-bold text-[#4A4E69] block border-b border-[#4A4E69]/15 pb-1">
                COLUMN II
              </span>
              {question.columnB.map((item) => (
                <div key={item.key} className="flex gap-2 text-xs font-mono">
                  <span className="font-bold text-[#22223B] w-4">{item.key}.</span>
                  <span className="text-[#22223B]">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Answer Choices: Clearly defined boundaries and dark black/space-indigo letters */}
      <div className="space-y-3 pt-2">
        {question.options.map((opt, index) => {
          const selected = isSelected(index);
          const letter = letters[index] || `${index + 1}`;

          return (
            <div
              key={index}
              onClick={() => handleOptionClick(index)}
              className={`p-3.5 sm:p-4 rounded-xl flex items-start gap-3.5 cursor-pointer transition-all duration-150 border-2 ${
                selected
                  ? 'bg-[#C9ADA7]/25 border-[#22223B] shadow-sm ring-1 ring-[#22223B]/30'
                  : 'bg-white/75 hover:bg-white border-[#4A4E69]/30 hover:border-[#22223B]/60 shadow-2xs'
              }`}
            >
              {/* Option Letter Badge: Dark black / Space Indigo readable badge */}
              <span
                className={`font-mono text-xs font-black shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-colors border ${
                  selected
                    ? 'bg-[#22223B] text-[#F2E9E4] border-[#22223B] shadow-2xs'
                    : 'bg-[#22223B]/10 text-[#22223B] border-[#22223B]/25'
                }`}
              >
                {letter}
              </span>

              {/* Option Text */}
              <span
                className={`text-sm sm:text-base leading-relaxed flex-1 ${
                  selected ? 'font-bold text-[#22223B]' : 'font-medium text-[#22223B]'
                }`}
              >
                {opt}
              </span>

              {/* Selection Check Circle */}
              <div className="shrink-0 pt-0.5">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                    selected
                      ? 'border-[#22223B] bg-[#22223B] text-[#F2E9E4] shadow-2xs'
                      : 'border-[#9A8C98] bg-white/90'
                  }`}
                >
                  {selected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

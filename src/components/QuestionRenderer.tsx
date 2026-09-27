import React from 'react';
import { Question } from '../types/exam';

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
    <div className="space-y-6">
      {/* Top Question Strip */}
      <div className="flex items-center justify-between pb-3 border-b border-[#D9D9D9] font-mono text-xs">
        <div className="flex items-center gap-4">
          <span className="font-bold text-sm text-[#0A0A0A] tracking-wider uppercase">
            QUESTION {padNum(questionNumber)} OF {padNum(totalQuestions)}
          </span>
          <span className="text-[#D9D9D9]">|</span>
          <span className="text-[#0047FF] font-bold">
            SCHEME: +{question.marks.correct} / {question.marks.incorrect}
          </span>
          <span className="text-[#D9D9D9] hidden sm:inline">|</span>
          <span className="text-[#555555] uppercase hidden sm:inline">
            {question.topic}
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleBookmark}
          className={`px-3 py-1 border transition-colors cursor-pointer uppercase font-bold text-xs ${
            isBookmarked
              ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
              : 'bg-white text-[#555555] border-[#D9D9D9] hover:border-[#0A0A0A]'
          }`}
        >
          {isBookmarked ? '★ BOOKMARKED' : '☆ BOOKMARK'}
        </button>
      </div>

      {/* Prominent Question Statement */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0A0A0A] leading-relaxed tracking-tight">
          {question.question}
        </h2>

        {/* Statements Variant */}
        {question.statements && question.statements.length > 0 && (
          <div className="p-4 bg-white border border-[#D9D9D9] space-y-2 text-sm font-sans">
            {question.statements.map((stmt, idx) => (
              <div key={idx} className="flex gap-3 text-[#0A0A0A]">
                <span className="font-mono font-bold text-[#555555] shrink-0">
                  {stmt.substring(0, stmt.indexOf('.'))}
                </span>
                <span>{stmt.substring(stmt.indexOf('.') + 1)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Assertion-Reason Variant */}
        {question.assertion && question.reason && (
          <div className="space-y-2 text-sm">
            <div className="p-3 bg-white border border-[#D9D9D9]">
              <span className="text-xs font-mono font-bold text-[#0047FF] block mb-1">
                ASSERTION (A):
              </span>
              <p className="text-[#0A0A0A] font-medium">{question.assertion}</p>
            </div>
            <div className="p-3 bg-white border border-[#D9D9D9]">
              <span className="text-xs font-mono font-bold text-[#0047FF] block mb-1">
                REASON (R):
              </span>
              <p className="text-[#0A0A0A] font-medium">{question.reason}</p>
            </div>
          </div>
        )}

        {/* Match the Following Variant */}
        {question.columnA && question.columnB && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-white border border-[#D9D9D9] text-sm">
            <div className="space-y-2">
              <span className="font-mono text-xs font-bold text-[#555552] block border-b border-[#D9D9D9] pb-1">
                COLUMN I
              </span>
              {question.columnA.map((item) => (
                <div key={item.key} className="flex gap-2 text-xs font-mono">
                  <span className="font-bold text-[#0047FF] w-4">{item.key}.</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <span className="font-mono text-xs font-bold text-[#555552] block border-b border-[#D9D9D9] pb-1">
                COLUMN II
              </span>
              {question.columnB.map((item) => (
                <div key={item.key} className="flex gap-2 text-xs font-mono">
                  <span className="font-bold text-[#0047FF] w-4">{item.key}.</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Answer Choices: Horizontal Structured Rows */}
      <div className="border-t border-[#D9D9D9] divide-y divide-[#D9D9D9]">
        {question.options.map((opt, index) => {
          const selected = isSelected(index);
          const letter = letters[index] || `${index + 1}`;

          return (
            <div
              key={index}
              onClick={() => handleOptionClick(index)}
              className={`py-4 px-3 flex items-start gap-4 cursor-pointer transition-colors ${
                selected
                  ? 'bg-[#EEF2FF] border-l-2 border-l-[#0047FF]'
                  : 'bg-transparent hover:bg-white'
              }`}
            >
              {/* Option Letter */}
              <span className="font-mono text-sm font-bold text-[#0A0A0A] shrink-0 w-4 pt-0.5">
                {letter}
              </span>

              {/* Radio Indicator: ○ vs ● */}
              <span className="shrink-0 pt-0.5 select-none">
                {selected ? (
                  <span className="w-4 h-4 border border-[#0047FF] flex items-center justify-center inline-block bg-[#0047FF]">
                    <span className="w-1.5 h-1.5 bg-white block"></span>
                  </span>
                ) : (
                  <span className="w-4 h-4 border border-[#D9D9D9] block inline-block hover:border-[#0A0A0A] bg-white"></span>
                )}
              </span>

              {/* Option Text */}
              <span className={`text-base leading-relaxed ${selected ? 'font-bold text-[#0A0A0A]' : 'text-[#222222]'}`}>
                {opt}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

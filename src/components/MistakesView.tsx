import React, { useState } from 'react';
import { useUserData } from '../context/UserDataContext';
import { MistakeEntry, Question } from '../types/exam';
import { Play, CheckCircle2, Trash2 } from 'lucide-react';

interface MistakesViewProps {
  onStartMistakeExam: (questions: Question[]) => void;
  onGoToExams: () => void;
}

export const MistakesView: React.FC<MistakesViewProps> = ({
  onStartMistakeExam,
  onGoToExams
}) => {
  const { mistakes, mistakesList, clearMistakes } = useUserData();
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [revealedExplanations, setRevealedExplanations] = useState<Record<string, boolean>>({});

  const mistakeList = mistakesList;
  const subjects = ['all', ...Array.from(new Set(mistakeList.map((m) => m.question.subject)))];

  const filteredMistakes = mistakeList.filter((m) => {
    if (selectedSubject === 'all') return true;
    return m.question.subject === selectedSubject;
  });

  const handleStartPractice = () => {
    const questions = filteredMistakes.map((m) => m.question);
    if (questions.length > 0) {
      onStartMistakeExam(questions);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Clear all recorded mistakes?')) {
      await clearMistakes();
    }
  };

  const toggleExplanation = (id: string) => {
    setRevealedExplanations((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getOptionLetter = (idx: number) => ['A', 'B', 'C', 'D', 'E', 'F'][idx] || `${idx + 1}`;

  return (
    <div className="max-w-5xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-8 pb-12 sm:pb-16 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-slate-200 w-full">
        <div>
          <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest text-rose-700">
            TARGETED REMEDIATION
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            Mistakes Bank
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Questions answered incorrectly during previous test sessions, ready for targeted practice.
          </p>
        </div>

        {filteredMistakes.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs flex-wrap">
            <button
              onClick={handleClearAll}
              className="liquid-glass-btn-secondary px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-rose-600"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>CLEAR</span>
            </button>
            <button
              onClick={handleStartPractice}
              className="liquid-glass-btn-primary flex items-center gap-1.5 px-4 py-2 font-bold uppercase tracking-wider rounded-xl cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>PRACTICE MISTAKES ({filteredMistakes.length})</span>
            </button>
          </div>
        )}
      </div>

      {mistakeList.length === 0 ? (
        <div className="liquid-glass-panel rounded-2xl border border-white/80 p-8 sm:p-12 text-center max-w-md mx-auto space-y-3.5 shadow-sm">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900">No Mistakes Recorded</h3>
          <p className="text-xs text-slate-500 font-sans leading-relaxed">
            Any questions you miss during tests will automatically be logged here for remediation drills.
          </p>
          <button
            onClick={onGoToExams}
            className="liquid-glass-btn-primary px-5 py-2.5 text-xs font-mono font-bold rounded-xl cursor-pointer"
          >
            START PRACTICE PAPER
          </button>
        </div>
      ) : (
        <div className="space-y-4 w-full">
          {/* Subjects Filter Bar */}
          {subjects.length > 2 && (
            <div className="flex flex-wrap items-center gap-1 bg-slate-200/60 p-1 rounded-xl border border-slate-300/60 font-mono text-xs w-fit max-w-full">
              {subjects.map((subj) => (
                <button
                  key={subj}
                  onClick={() => setSelectedSubject(subj)}
                  className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-all cursor-pointer ${
                    selectedSubject === subj
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {subj === 'all' ? 'ALL SUBJECTS' : subj}
                </button>
              ))}
            </div>
          )}

          {/* List of Missed Questions */}
          <div className="space-y-3.5 w-full">
            {filteredMistakes.map((entry) => {
              const q = entry.question;
              const isRevealed = !!revealedExplanations[q.id];
              const correctIdx = typeof q.correctAnswer === 'number' ? q.correctAnswer : -1;

              return (
                <div
                  key={q.id}
                  className="liquid-glass-panel rounded-2xl border border-white/80 p-5 sm:p-6 shadow-sm space-y-3.5 w-full"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="font-bold text-rose-700 uppercase">
                        {q.subject}
                      </span>
                      <span className="text-slate-300">/</span>
                      <span className="text-slate-600">{q.chapter}</span>
                      <span className="text-slate-300">/</span>
                      <span className="text-slate-500 uppercase">{q.topic}</span>
                    </div>

                    <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded font-semibold text-[11px] shrink-0">
                      Missed {entry.wrongCount} {entry.wrongCount === 1 ? 'time' : 'times'}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-950 leading-relaxed">
                    {q.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, idx) => {
                      const isCorrect = correctIdx === idx;
                      return (
                        <div
                          key={idx}
                          className={`p-2.5 rounded border flex items-center justify-between gap-2 ${
                            isCorrect
                              ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-semibold'
                              : 'border-slate-200 bg-slate-50/50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-500">{getOptionLetter(idx)}.</span>
                            <span>{opt}</span>
                          </div>
                          {isCorrect && (
                            <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase shrink-0">
                              CORRECT KEY
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => toggleExplanation(q.id)}
                      className="text-xs font-mono text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                    >
                      {isRevealed ? 'Hide Explanation ▲' : 'View Explanation ▼'}
                    </button>
                  </div>

                  {isRevealed && (
                    <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded text-xs space-y-1 mt-2">
                      <span className="font-mono font-bold uppercase text-[10px] text-indigo-900 tracking-wider block">
                        SCIENTIFIC EXPLANATION
                      </span>
                      <p className="text-slate-800 leading-relaxed font-sans">
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

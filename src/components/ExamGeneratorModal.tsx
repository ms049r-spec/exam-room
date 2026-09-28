import React, { useState } from 'react';
import { Question, ExamDefinition, ExamConfig } from '../types/exam';
import { allQuestions } from '../data/questions/sampleExams';
import { shuffleArray } from '../utils/examEngine';
import { X, Sparkles, Sliders, Play, Layers } from 'lucide-react';

interface ExamGeneratorModalProps {
  onClose: () => void;
  onStartGeneratedExam: (exam: ExamDefinition, config: ExamConfig) => void;
}

export const ExamGeneratorModal: React.FC<ExamGeneratorModalProps> = ({
  onClose,
  onStartGeneratedExam
}) => {
  const subjects = ['all', ...Array.from(new Set(allQuestions.map((q) => q.subject)))];
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<string>('all');
  const [timeMode, setTimeMode] = useState<'timed' | 'untimed'>('timed');
  const [durationMinutes, setDurationMinutes] = useState<number>(15);
  const [markingSchemeType, setMarkingSchemeType] = useState<string>('standard');

  const pool = allQuestions.filter((q) => {
    if (selectedSubject !== 'all' && q.subject !== selectedSubject) return false;
    if (difficulty !== 'all' && q.difficulty !== difficulty) return false;
    return true;
  });

  const handleGenerate = () => {
    const shuffled = shuffleArray(pool);
    const count = Math.min(questionCount, shuffled.length);
    const selected = shuffled.slice(0, count);

    const marking = markingSchemeType === 'standard'
      ? { correct: 4, incorrect: -1, unattempted: 0 }
      : { correct: 1, incorrect: -0.25, unattempted: 0 };

    const generatedExam: ExamDefinition = {
      id: `custom-gen-${Date.now()}`,
      title: `${selectedSubject === 'all' ? 'Multi-Discipline' : selectedSubject} Practice Test`,
      subject: selectedSubject === 'all' ? 'Mixed' : selectedSubject,
      chapter: 'Custom Pool',
      description: `Compiled test paper of ${count} questions with ${markingSchemeType === 'standard' ? '+4 / -1' : '+1 / -0.25'} marking.`,
      questionCount: count,
      difficulty: difficulty === 'all' ? 'Mixed' : (difficulty.charAt(0).toUpperCase() + difficulty.slice(1) as any),
      defaultDurationMinutes: durationMinutes,
      markingScheme: marking,
      tag: 'Custom',
      questions: selected.map((q) => ({
        ...q,
        marks: marking
      }))
    };

    onStartGeneratedExam(generatedExam, {
      timeMode,
      durationMinutes: timeMode === 'timed' ? durationMinutes : 0,
      shuffleQuestions: true,
      shuffleOptions: false
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 font-sans animate-in fade-in duration-150">
      <div className="liquid-glass-panel rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-6 p-6 sm:p-8 shadow-2xl relative my-auto border border-white/80">
        {/* Top Header */}
        <div className="border-b border-slate-200/70 pb-3 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-indigo-700 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CUSTOM TEST COMPILER</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
              Build Practice Exam
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Assemble a tailored question paper from the item bank
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Controls */}
        <div className="space-y-4 font-mono text-xs">
          {/* Subject */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 uppercase text-[11px] block">
              1. Subject Discipline
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="liquid-glass-input w-full p-2.5 rounded-xl text-slate-900 font-semibold cursor-pointer"
            >
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub === 'all' ? 'All Disciplines (Mixed)' : sub}
                </option>
              ))}
            </select>
          </div>

          {/* Question Count */}
          <div className="space-y-2 p-3.5 rounded-xl bg-white/70 border border-slate-200/80 shadow-2xs">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-800 uppercase text-[11px]">
                2. Question Count
              </label>
              <span className="text-indigo-700 font-bold tabular-nums bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/60">
                {questionCount} Questions ({pool.length} pool)
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={Math.min(34, pool.length || 34)}
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Difficulty */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 uppercase text-[11px] block">
              3. Difficulty Level
            </label>
            <div className="grid grid-cols-4 gap-1.5 text-center">
              {['all', 'easy', 'moderate', 'hard'].map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`py-2 px-1 rounded-xl uppercase font-bold transition-all cursor-pointer text-[10px] sm:text-xs ${
                    difficulty === diff
                      ? 'bg-indigo-600 text-white shadow-xs font-extrabold'
                      : 'bg-white/70 hover:bg-white text-slate-600 border border-slate-200/80'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Timing Mode */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 uppercase text-[11px] block">
              4. Time Constraints
            </label>
            <div className="p-1 rounded-xl bg-slate-200/60 border border-slate-300/60 grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setTimeMode('timed')}
                className={`py-2 px-2 rounded-lg uppercase font-bold transition-all cursor-pointer text-xs ${
                  timeMode === 'timed'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Timed ({durationMinutes}m)
              </button>
              <button
                type="button"
                onClick={() => setTimeMode('untimed')}
                className={`py-2 px-2 rounded-lg uppercase font-bold transition-all cursor-pointer text-xs ${
                  timeMode === 'untimed'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Untimed Practice
              </button>
            </div>
          </div>

          {timeMode === 'timed' && (
            <div className="space-y-1.5">
              <label className="text-slate-500 uppercase text-[10px] font-semibold block">
                Duration In Minutes
              </label>
              <div className="flex flex-wrap items-center gap-1.5">
                {[5, 10, 15, 30, 45].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setDurationMinutes(m)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-all tabular-nums ${
                      durationMinutes === m
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white/70 text-slate-600 border border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Marking Scheme */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 uppercase text-[11px] block">
              5. Marking Scheme
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMarkingSchemeType('standard')}
                className={`py-2 px-2.5 rounded-xl uppercase font-bold transition-all cursor-pointer text-xs ${
                  markingSchemeType === 'standard'
                    ? 'bg-indigo-50 border border-indigo-500/70 text-indigo-900 shadow-xs'
                    : 'bg-white/70 text-slate-600 border border-slate-200/80 hover:bg-white'
                }`}
              >
                NEET (+4 / -1)
              </button>
              <button
                type="button"
                onClick={() => setMarkingSchemeType('jee')}
                className={`py-2 px-2.5 rounded-xl uppercase font-bold transition-all cursor-pointer text-xs ${
                  markingSchemeType === 'jee'
                    ? 'bg-indigo-50 border border-indigo-500/70 text-indigo-900 shadow-xs'
                    : 'bg-white/70 text-slate-600 border border-slate-200/80 hover:bg-white'
                }`}
              >
                STD (+1 / -0.25)
              </button>
            </div>
          </div>
        </div>

        {/* Generate CTA */}
        <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between gap-3 font-mono text-xs">
          <button
            type="button"
            onClick={onClose}
            className="liquid-glass-btn-secondary px-4 py-2.5 rounded-xl font-bold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={pool.length === 0}
            className="liquid-glass-btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider cursor-pointer disabled:opacity-30"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>GENERATE & LAUNCH</span>
          </button>
        </div>
      </div>
    </div>
  );
};

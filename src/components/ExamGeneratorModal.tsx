import React, { useState } from 'react';
import { Question, ExamDefinition, ExamConfig } from '../types/exam';
import { allQuestions } from '../data/questions/sampleExams';
import { shuffleArray } from '../utils/examEngine';

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="bg-[#FAFAFA] border border-[#0A0A0A] max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-6 p-4 sm:p-8 shadow-2xl relative my-auto">
        {/* Top Header */}
        <div className="border-b border-[#D9D9D9] pb-3 flex items-center justify-between font-mono text-xs">
          <div>
            <span className="font-bold text-[#555555] uppercase tracking-wider block">
              SPECIFICATION // COMPILER
            </span>
            <span className="font-bold text-base text-[#0A0A0A] uppercase tracking-tight">
              COMPILE CUSTOM EXAM
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#555555] hover:text-[#0A0A0A] font-bold uppercase cursor-pointer"
          >
            [CLOSE]
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 font-mono text-xs">
          {/* Subject */}
          <div className="space-y-1">
            <label className="font-bold text-[#0A0A0A] uppercase block">
              1. SUBJECT DISCIPLINE
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-2 border border-[#D9D9D9] bg-white text-[#0A0A0A] uppercase font-bold focus:border-[#0047FF] focus:outline-none cursor-pointer"
            >
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub === 'all' ? 'All Disciplines (Mixed)' : sub}
                </option>
              ))}
            </select>
          </div>

          {/* Question Count */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="font-bold text-[#0A0A0A] uppercase">
                2. QUESTION COUNT
              </label>
              <span className="text-[#0047FF] font-bold">
                {questionCount} QUESTIONS ({pool.length} in pool)
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={Math.min(34, pool.length || 34)}
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full accent-[#0047FF] cursor-pointer"
            />
          </div>

          {/* Difficulty */}
          <div className="space-y-1">
            <label className="font-bold text-[#0A0A0A] uppercase block">
              3. DIFFICULTY LEVEL
            </label>
            <div className="grid grid-cols-4 gap-1 sm:gap-2 text-center">
              {['all', 'easy', 'moderate', 'hard'].map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`py-2 px-1 border uppercase font-bold transition-colors cursor-pointer text-[10px] sm:text-xs ${
                    difficulty === diff
                      ? 'bg-[#0047FF] text-white border-[#0047FF]'
                      : 'bg-white text-[#555555] border-[#D9D9D9] hover:border-[#0A0A0A]'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Timing Mode */}
          <div className="space-y-1">
            <label className="font-bold text-[#0A0A0A] uppercase block">
              4. TIME CONSTRAINTS
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTimeMode('timed')}
                className={`py-2 px-2 border uppercase font-bold transition-colors cursor-pointer text-xs ${
                  timeMode === 'timed'
                    ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                    : 'bg-white text-[#555555] border-[#D9D9D9] hover:border-[#0A0A0A]'
                }`}
              >
                TIMED ({durationMinutes}m)
              </button>
              <button
                type="button"
                onClick={() => setTimeMode('untimed')}
                className={`py-2 px-2 border uppercase font-bold transition-colors cursor-pointer text-xs ${
                  timeMode === 'untimed'
                    ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                    : 'bg-white text-[#555555] border-[#D9D9D9] hover:border-[#0A0A0A]'
                }`}
              >
                UNTIMED
              </button>
            </div>
          </div>

          {timeMode === 'timed' && (
            <div className="space-y-1">
              <label className="text-[#555555] uppercase block">
                DURATION IN MINUTES
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {[5, 10, 15, 30, 45].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setDurationMinutes(m)}
                    className={`px-3 py-1.5 border font-bold text-xs cursor-pointer ${
                      durationMinutes === m
                        ? 'bg-[#0047FF] text-white border-[#0047FF]'
                        : 'bg-white text-[#555555] border-[#D9D9D9] hover:border-[#0A0A0A]'
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Marking Scheme */}
          <div className="space-y-1">
            <label className="font-bold text-[#0A0A0A] uppercase block">
              5. MARKING SYSTEM
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMarkingSchemeType('standard')}
                className={`py-2 px-2 border uppercase font-bold transition-colors cursor-pointer text-[11px] sm:text-xs ${
                  markingSchemeType === 'standard'
                    ? 'bg-[#0047FF] text-white border-[#0047FF]'
                    : 'bg-white text-[#555555] border-[#D9D9D9] hover:border-[#0A0A0A]'
                }`}
              >
                NEET (+4 / -1)
              </button>
              <button
                type="button"
                onClick={() => setMarkingSchemeType('jee')}
                className={`py-2 px-2 border uppercase font-bold transition-colors cursor-pointer text-[11px] sm:text-xs ${
                  markingSchemeType === 'jee'
                    ? 'bg-[#0047FF] text-white border-[#0047FF]'
                    : 'bg-white text-[#555555] border-[#D9D9D9] hover:border-[#0A0A0A]'
                }`}
              >
                STD (+1 / -0.25)
              </button>
            </div>
          </div>
        </div>

        {/* Generate CTA */}
        <div className="pt-4 border-t border-[#D9D9D9] flex items-center justify-between font-mono text-xs">
          <button
            type="button"
            onClick={onClose}
            className="text-[#555555] hover:text-[#0A0A0A] uppercase tracking-wider underline cursor-pointer"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={pool.length === 0}
            className="bg-[#0047FF] hover:bg-[#0037c7] text-white px-6 sm:px-8 py-3 font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs disabled:opacity-25"
          >
            COMPILE & LAUNCH →
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ExamDefinition, ExamConfig } from '../types/exam';

interface ExamConfigModalProps {
  exam: ExamDefinition;
  onClose: () => void;
  onStart: (config: ExamConfig) => void;
}

export const ExamConfigModal: React.FC<ExamConfigModalProps> = ({
  exam,
  onClose,
  onStart
}) => {
  const [timeMode, setTimeMode] = useState<'timed' | 'untimed'>('timed');
  const [selectedDuration, setSelectedDuration] = useState<number>(exam.defaultDurationMinutes || 45);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [shuffleOptions, setShuffleOptions] = useState(false);

  const totalMarks = exam.questionCount * (exam.markingScheme?.correct || 4);

  const handleStart = () => {
    onStart({
      timeMode,
      durationMinutes: timeMode === 'timed' ? selectedDuration : 0,
      shuffleQuestions,
      shuffleOptions
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#FAFAFA] border border-[#0A0A0A] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-8 space-y-6 shadow-2xl relative my-auto">
        {/* Top: Examination Code & Title */}
        <div className="flex items-start justify-between border-b border-[#D9D9D9] pb-4 gap-3">
          <div className="space-y-1 min-w-0">
            <div className="font-mono text-xs font-bold text-[#555555] uppercase tracking-wider">
              EXAMINATION SPECIFICATION // {exam.id.toUpperCase().slice(0, 8)}
            </div>
            <h1 className="text-lg sm:text-2xl font-bold text-[#0A0A0A] uppercase tracking-tight break-words">
              {exam.title}
            </h1>
            <div className="font-mono text-xs text-[#555555]">
              {exam.subject.toUpperCase()} // {exam.chapter.toUpperCase()}
            </div>
          </div>

          <button
            onClick={onClose}
            className="font-mono text-xs font-bold text-[#555555] hover:text-[#0A0A0A] uppercase tracking-wider cursor-pointer shrink-0"
          >
            [CLOSE]
          </button>
        </div>

        {/* Horizontal Metadata Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border border-[#D9D9D9] bg-white divide-x divide-y sm:divide-y-0 divide-[#D9D9D9] font-mono text-xs text-center">
          <div className="p-2.5 sm:p-3">
            <span className="text-[10px] text-[#555555] block uppercase">QUESTIONS</span>
            <span className="font-bold text-xs sm:text-sm text-[#0A0A0A]">{exam.questionCount}</span>
          </div>
          <div className="p-2.5 sm:p-3">
            <span className="text-[10px] text-[#555555] block uppercase">MAX MARKS</span>
            <span className="font-bold text-xs sm:text-sm text-[#0A0A0A]">{totalMarks}</span>
          </div>
          <div className="p-2.5 sm:p-3">
            <span className="text-[10px] text-[#555555] block uppercase">DURATION</span>
            <span className="font-bold text-xs sm:text-sm text-[#0A0A0A]">{exam.defaultDurationMinutes} MIN</span>
          </div>
          <div className="p-2.5 sm:p-3">
            <span className="text-[10px] text-[#555555] block uppercase">MARKING</span>
            <span className="font-bold text-xs sm:text-sm text-[#0047FF]">+{exam.markingScheme.correct} / {exam.markingScheme.incorrect}</span>
          </div>
        </div>

        {/* Exam Settings */}
        <div className="space-y-5 pt-2 font-mono text-xs">
          <div className="font-bold uppercase tracking-wider text-[#0A0A0A] border-b border-[#D9D9D9] pb-1">
            EXAM SETTINGS
          </div>

          {/* TIMER MODE */}
          <div className="space-y-2">
            <span className="text-[#555555] uppercase block">TIMER MODE</span>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setTimeMode('timed')}
                className={`px-3 sm:px-4 py-2 border font-bold uppercase cursor-pointer text-xs ${
                  timeMode === 'timed'
                    ? 'bg-[#0047FF] text-white border-[#0047FF]'
                    : 'bg-white text-[#0A0A0A] border-[#D9D9D9] hover:border-[#0A0A0A]'
                }`}
              >
                [ TIMED: {selectedDuration} MIN ]
              </button>
              <button
                type="button"
                onClick={() => setTimeMode('untimed')}
                className={`px-3 sm:px-4 py-2 border font-bold uppercase cursor-pointer text-xs ${
                  timeMode === 'untimed'
                    ? 'bg-[#0047FF] text-white border-[#0047FF]'
                    : 'bg-white text-[#0A0A0A] border-[#D9D9D9] hover:border-[#0A0A0A]'
                }`}
              >
                [ UNTIMED / PRACTICE ]
              </button>
            </div>
          </div>

          {/* CUSTOM TIME DURATION (Only if timed) */}
          {timeMode === 'timed' && (
            <div className="space-y-2">
              <span className="text-[#555555] uppercase block">CUSTOM TIMER DURATION</span>
              <div className="flex flex-wrap items-center gap-2">
                {[10, 15, 30, 45, 60, 90].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setSelectedDuration(mins)}
                    className={`px-3 py-1.5 border font-bold text-xs cursor-pointer ${
                      selectedDuration === mins
                        ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                        : 'bg-white text-[#555555] border-[#D9D9D9] hover:border-[#0A0A0A]'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* RANDOMIZATION OPTIONS */}
          <div className="space-y-2 pt-2 border-t border-[#D9D9D9]">
            <span className="text-[#555555] uppercase block">RANDOMIZATION / SHUFFLE</span>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={(e) => setShuffleQuestions(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0047FF] border-[#D9D9D9] focus:ring-[#0047FF] cursor-pointer"
                />
                <span className="text-xs text-[#0A0A0A] font-bold uppercase">
                  Shuffle Question Order
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={shuffleOptions}
                  onChange={(e) => setShuffleOptions(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0047FF] border-[#D9D9D9] focus:ring-[#0047FF] cursor-pointer"
                />
                <span className="text-xs text-[#0A0A0A] font-bold uppercase">
                  Shuffle Multiple Choice Options
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Launch Button */}
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
            onClick={handleStart}
            className="bg-[#0047FF] hover:bg-[#0037c7] text-white px-6 sm:px-8 py-3 font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
          >
            START CBT SIMULATION →
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ExamDefinition, ExamConfig } from '../types/exam';
import { X, Play, Clock, Shuffle, Check, Sparkles } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="liquid-glass-panel rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto border border-white/80">
        {/* Top: Examination Code & Title */}
        <div className="flex items-start justify-between border-b border-slate-200/70 pb-4 gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
              <span>{exam.subject}</span>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <span className="text-slate-500">{exam.difficulty}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight break-words">
              {exam.title}
            </h1>
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {exam.description}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Horizontal Metadata Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs text-center">
          <div className="p-3 rounded-xl bg-white/70 border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] text-slate-500 block uppercase font-medium">QUESTIONS</span>
            <span className="font-bold text-sm sm:text-base text-slate-900 tabular-nums">{exam.questionCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-white/70 border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] text-slate-500 block uppercase font-medium">MAX MARKS</span>
            <span className="font-bold text-sm sm:text-base text-slate-900 tabular-nums">{totalMarks}</span>
          </div>
          <div className="p-3 rounded-xl bg-white/70 border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] text-slate-500 block uppercase font-medium">DURATION</span>
            <span className="font-bold text-sm sm:text-base text-slate-900 tabular-nums">{exam.defaultDurationMinutes}m</span>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200/80 shadow-2xs">
            <span className="text-[10px] text-indigo-700 block uppercase font-medium">MARKING</span>
            <span className="font-bold text-sm sm:text-base text-indigo-700 tabular-nums">+{exam.markingScheme.correct} / {exam.markingScheme.incorrect}</span>
          </div>
        </div>

        {/* Exam Settings */}
        <div className="space-y-5 pt-1 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
            <span className="font-bold uppercase tracking-wider text-slate-800 text-xs">
              Simulation Options
            </span>
            <span className="text-[11px] text-slate-400 font-normal">
              Configure session constraints
            </span>
          </div>

          {/* TIMER MODE: iOS Segmented Control */}
          <div className="space-y-2">
            <span className="text-slate-600 uppercase font-semibold text-[11px] block">Timing Mode</span>
            <div className="p-1 rounded-xl bg-slate-200/60 border border-slate-300/60 grid grid-cols-2 gap-1 max-w-sm">
              <button
                type="button"
                onClick={() => setTimeMode('timed')}
                className={`py-2 px-3 rounded-lg font-bold transition-all text-xs cursor-pointer flex items-center justify-center gap-1.5 ${
                  timeMode === 'timed'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Timed ({selectedDuration}m)</span>
              </button>
              <button
                type="button"
                onClick={() => setTimeMode('untimed')}
                className={`py-2 px-3 rounded-lg font-bold transition-all text-xs cursor-pointer flex items-center justify-center gap-1.5 ${
                  timeMode === 'untimed'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Untimed Practice</span>
              </button>
            </div>
          </div>

          {/* CUSTOM TIME DURATION (Only if timed) */}
          {timeMode === 'timed' && (
            <div className="space-y-2">
              <span className="text-slate-600 uppercase font-semibold text-[11px] block">Exam Duration</span>
              <div className="flex flex-wrap items-center gap-2">
                {[10, 15, 30, 45, 60, 90].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setSelectedDuration(mins)}
                    className={`px-3 py-1.5 rounded-lg border font-bold text-xs cursor-pointer transition-all tabular-nums ${
                      selectedDuration === mins
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white/80 text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {mins} min
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* RANDOMIZATION OPTIONS: iOS Toggle rows */}
          <div className="space-y-3 pt-2 border-t border-slate-200/70">
            <span className="text-slate-600 uppercase font-semibold text-[11px] block">Randomization & Order</span>

            <div className="space-y-2">
              {/* Question Shuffle Toggle */}
              <div
                onClick={() => setShuffleQuestions(!shuffleQuestions)}
                className="p-3 rounded-xl bg-white/70 border border-slate-200/80 flex items-center justify-between cursor-pointer hover:bg-white transition-all shadow-2xs"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 text-xs">Shuffle Question Sequence</div>
                  <div className="text-[11px] text-slate-500 font-sans">Presents test items in randomized order</div>
                </div>
                <div
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    shuffleQuestions ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      shuffleQuestions ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              {/* Option Shuffle Toggle */}
              <div
                onClick={() => setShuffleOptions(!shuffleOptions)}
                className="p-3 rounded-xl bg-white/70 border border-slate-200/80 flex items-center justify-between cursor-pointer hover:bg-white transition-all shadow-2xs"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 text-xs">Shuffle Multiple Choice Choices</div>
                  <div className="text-[11px] text-slate-500 font-sans">Permutes options A through D to counter positional guessing</div>
                </div>
                <div
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    shuffleOptions ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      shuffleOptions ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Launch Button */}
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
            onClick={handleStart}
            className="liquid-glass-btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>START CBT SIMULATION</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { AlertCircle, CheckCircle2, ArrowRight, X } from 'lucide-react';

interface SubmitConfirmModalProps {
  totalQuestions: number;
  answeredCount: number;
  unansweredCount: number;
  markedCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export const SubmitConfirmModal: React.FC<SubmitConfirmModalProps> = ({
  totalQuestions,
  answeredCount,
  unansweredCount,
  markedCount,
  onCancel,
  onConfirm
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="liquid-glass-panel rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto border border-white/80">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-200/70">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-700 uppercase block">
              FINAL SUBMISSION
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
              Submit Examination?
            </h2>
          </div>
          <button
            onClick={onCancel}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Technical Data Ledger */}
        <div className="space-y-2.5 font-mono text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/70 border border-slate-200/70 shadow-2xs">
            <span className="text-slate-600">Questions Attempted</span>
            <span className="font-bold text-slate-900 tabular-nums">
              {answeredCount} / {totalQuestions}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/70 border border-slate-200/70 shadow-2xs">
            <span className="text-slate-600">Questions Unanswered</span>
            <span className={`font-bold tabular-nums ${unansweredCount > 0 ? 'text-amber-700' : 'text-slate-900'}`}>
              {unansweredCount}
            </span>
          </div>
          {markedCount > 0 && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/80 border border-amber-200/70 text-amber-950 shadow-2xs">
              <span className="text-amber-800">Marked for Review</span>
              <span className="font-bold tabular-nums text-amber-900">
                {markedCount}
              </span>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-500 leading-relaxed font-sans">
          Submitting will conclude your attempt and instantly generate your diagnostic score, solution explanations, and performance metrics.
        </p>

        {/* Action Controls */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="liquid-glass-btn-secondary px-4 py-2.5 text-xs font-mono font-bold rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="liquid-glass-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-bold rounded-xl cursor-pointer"
          >
            <span>SUBMIT EXAM</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};


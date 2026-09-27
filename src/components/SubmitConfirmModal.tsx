import React from 'react';

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#FAFAFA] border border-[#0A0A0A] max-w-md w-full max-h-[90vh] overflow-y-auto p-5 sm:p-8 space-y-6 shadow-2xl relative my-auto">
        {/* Header */}
        <div className="border-b border-[#D9D9D9] pb-3">
          <span className="font-mono text-xs font-bold text-[#555555] uppercase tracking-wider block">
            CONFIRMATION
          </span>
          <h2 className="text-lg font-bold text-[#0A0A0A] uppercase tracking-tight">
            SUBMIT EXAMINATION?
          </h2>
        </div>

        {/* Technical Data Ledger */}
        <div className="space-y-3 font-mono text-xs">
          <div className="flex justify-between py-1.5 border-b border-[#D9D9D9]">
            <span className="text-[#555555] uppercase">Questions attempted</span>
            <span className="font-bold text-[#0A0A0A]">{answeredCount} / {totalQuestions}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-[#D9D9D9]">
            <span className="text-[#555555] uppercase">Questions unanswered</span>
            <span className="font-bold text-[#0A0A0A]">{unansweredCount}</span>
          </div>
          {markedCount > 0 && (
            <div className="flex justify-between py-1.5 border-b border-[#D9D9D9]">
              <span className="text-amber-700 uppercase">Marked for review</span>
              <span className="font-bold text-amber-800">{markedCount}</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-[#D9D9D9] flex items-center justify-between font-mono text-xs">
          <button
            type="button"
            onClick={onCancel}
            className="text-[#555555] hover:text-[#0A0A0A] uppercase tracking-wider underline cursor-pointer"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-[#0047FF] hover:bg-[#0037c7] text-white px-5 sm:px-6 py-2.5 sm:py-3 font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
          >
            SUBMIT →
          </button>
        </div>
      </div>
    </div>
  );
};

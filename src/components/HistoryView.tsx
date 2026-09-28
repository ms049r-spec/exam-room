import React from 'react';
import { useUserData } from '../context/UserDataContext';
import { ExamResult } from '../types/exam';

interface HistoryViewProps {
  onReviewAttempt: (result: ExamResult) => void;
  onGoToExams: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  onReviewAttempt,
  onGoToExams
}) => {
  const { attempts: history, loading } = useUserData();

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-[#0A0A0A] pb-3">
        <div>
          <span className="font-mono text-xs font-bold text-[#555555] uppercase tracking-wider block mb-0.5">
            EXAMINATION ARCHIVE // LOCAL SESSIONS
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0A0A0A] tracking-tight uppercase">
            HISTORY
          </h1>
        </div>

        <button
          onClick={onGoToExams}
          className="font-mono text-xs font-bold uppercase tracking-wider text-[#0A0A0A] hover:text-[#0047FF] underline cursor-pointer"
        >
          Take New Exam →
        </button>
      </div>

      {history.length === 0 ? (
        <div className="p-8 border border-[#D9D9D9] bg-white text-center max-w-md mx-auto space-y-3 font-mono text-xs">
          <span className="font-bold text-[#0A0A0A] uppercase block">
            NO RECORDED ATTEMPTS
          </span>
          <p className="text-[#555555]">
            Completed examination sessions will be permanently stored here in your client browser history.
          </p>
          <div className="pt-2">
            <button
              onClick={onGoToExams}
              className="bg-[#0A0A0A] hover:bg-[#0047FF] text-white px-5 py-2 uppercase font-bold transition-colors cursor-pointer"
            >
              Start Exam →
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-[#D9D9D9] bg-white overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#D9D9D9] bg-[#FAFAFA] text-[#555555]">
                <th className="py-2.5 px-3 font-bold">DATE</th>
                <th className="py-2.5 px-3 font-bold">EXAMINATION</th>
                <th className="py-2.5 px-3 font-bold text-center">SCORE</th>
                <th className="py-2.5 px-3 font-bold text-center">%</th>
                <th className="py-2.5 px-3 font-bold text-center">TIME</th>
                <th className="py-2.5 px-3 font-bold text-center">QUESTIONS</th>
                <th className="py-2.5 px-3 font-bold text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9D9D9]">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="py-3 px-3 text-[#555555] whitespace-nowrap">
                    {new Date(item.timestamp).toLocaleDateString([], { day: '2-digit', month: 'short' }).toUpperCase()}
                  </td>
                  <td className="py-3 px-3 font-sans font-bold text-[#0A0A0A]">
                    {item.examTitle}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-[#0A0A0A]">
                    {item.correctCount}/{item.totalQuestions}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-[#0047FF]">
                    {item.percentage.toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 text-center text-[#555555]">
                    {formatSeconds(item.timeTakenSeconds)}
                  </td>
                  <td className="py-3 px-3 text-center text-[#555555]">
                    {item.totalQuestions}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onReviewAttempt(item)}
                      className="font-bold text-[#0047FF] hover:underline uppercase cursor-pointer"
                    >
                      REVIEW →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

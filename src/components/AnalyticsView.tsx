import React, { useState, useEffect } from 'react';
import { localStore } from '../storage/localStore';
import { Target, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { ExamResult } from '../types/exam';

interface AnalyticsViewProps {
  onReviewAttempt: (result: ExamResult) => void;
  onGoToExams: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  onReviewAttempt,
  onGoToExams
}) => {
  const [stats, setStats] = useState(() => localStore.getAnalytics());

  useEffect(() => {
    setStats(localStore.getAnalytics());
  }, []);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s.toString().padStart(2, '0')}s`;
  };

  return (
    <div className="max-w-6xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-8 pb-12 sm:pb-16 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-slate-200 w-full">
        <div>
          <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest text-indigo-700">
            LOCAL PERFORMANCE AUDIT
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            Examination Metrics & History
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Client-side performance metrics calculated directly from your stored test sessions.
          </p>
        </div>

        <button
          onClick={onGoToExams}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors self-start sm:self-auto shadow-xs shrink-0 cursor-pointer"
        >
          <span>TAKE EXAM</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {stats.totalAttempts === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 text-center max-w-md mx-auto space-y-3 cbt-shadow">
          <Target className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Recorded Attempts</h3>
          <p className="text-xs text-slate-500">
            Complete a practice paper to unlock chapter accuracy distributions and performance diagnostics.
          </p>
          <button
            onClick={onGoToExams}
            className="px-4 py-2 text-xs font-mono font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-xs cursor-pointer"
          >
            START PRACTICE
          </button>
        </div>
      ) : (
        <>
          {/* Top Metric Cards: 2 cols on mobile/tablet, 4 cols on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">
            <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-slate-200 cbt-shadow">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block mb-1">
                TOTAL SESSIONS
              </span>
              <div className="text-xl sm:text-3xl font-mono font-bold text-slate-900">
                {stats.totalAttempts}
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                {stats.totalQuestionsAnswered} questions solved
              </div>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-slate-200 cbt-shadow">
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 block mb-1">
                AVERAGE SCORE
              </span>
              <div className="text-xl sm:text-3xl font-mono font-bold text-slate-900">
                {stats.averageScorePercent}%
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                Across all completed papers
              </div>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-slate-200 cbt-shadow">
              <span className="text-[10px] font-mono font-bold uppercase text-indigo-700 block mb-1">
                PERSONAL BEST
              </span>
              <div className="text-xl sm:text-3xl font-mono font-bold text-indigo-700">
                {stats.bestScorePercent}%
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                Highest recorded percentage
              </div>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-slate-200 cbt-shadow">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-600 block mb-1">
                OVERALL ACCURACY
              </span>
              <div className="text-xl sm:text-3xl font-mono font-bold text-slate-900">
                {stats.averageAccuracy}%
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                Correct / Attempted ratio
              </div>
            </div>
          </div>

          {/* Subject & Chapter Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
            <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 cbt-shadow space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 block pb-2 border-b border-slate-100">
                SUBJECT MASTERY
              </span>
              <div className="space-y-2.5">
                {Object.entries(stats.subjectStats).map(([subj, data]) => (
                  <div key={subj} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-slate-900 uppercase">{subj}</span>
                      <span className="text-slate-600">{data.attempts} attempts · {data.avgPercentage}% avg</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${data.avgPercentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 cbt-shadow space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 block pb-2 border-b border-slate-100">
                CHAPTER ACCURACY
              </span>
              <div className="space-y-2.5">
                {Object.entries(stats.chapterStats).map(([chap, data]) => (
                  <div key={chap} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-slate-900 truncate max-w-xs">{chap}</span>
                      <span className="text-slate-600">Acc: {data.accuracy}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${data.accuracy}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Test Paper Attempt History */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-5 cbt-shadow space-y-3 w-full">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 block pb-2 border-b border-slate-100">
              RECENT EXAM ATTEMPTS
            </span>

            {/* Desktop & Tablet Table View */}
            <div className="hidden sm:block overflow-x-auto w-full">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                    <th className="py-2 pr-3">PAPER</th>
                    <th className="py-2 px-3">SUBJECT</th>
                    <th className="py-2 px-3">SCORE</th>
                    <th className="py-2 px-3">PERCENT</th>
                    <th className="py-2 px-3">ACCURACY</th>
                    <th className="py-2 px-3">TIME</th>
                    <th className="py-2 px-3">DATE</th>
                    <th className="py-2 pl-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.recentAttempts.map((attempt) => (
                    <tr key={attempt.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 pr-3 font-bold text-slate-900 truncate max-w-[180px]">
                        {attempt.examTitle}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {attempt.subject}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {attempt.score}/{attempt.maxScore}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-indigo-700">
                        {attempt.percentage}%
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {attempt.accuracy}%
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {formatSeconds(attempt.timeTakenSeconds)}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                        {new Date(attempt.timestamp).toLocaleDateString()}
                      </td>
                      <td className="py-2.5 pl-3 text-right">
                        <button
                          onClick={() => onReviewAttempt(attempt)}
                          className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                        >
                          REVIEW
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View (No horizontal scrolling) */}
            <div className="sm:hidden divide-y divide-slate-100 font-mono">
              {stats.recentAttempts.map((attempt) => (
                <div key={attempt.id} className="py-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xs font-sans font-bold text-slate-900 leading-snug">
                        {attempt.examTitle}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                        <span className="uppercase text-indigo-600 font-semibold">{attempt.subject}</span>
                        <span>•</span>
                        <span>{new Date(attempt.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onReviewAttempt(attempt)}
                      className="px-2.5 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded transition-colors cursor-pointer shrink-0"
                    >
                      REVIEW
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 bg-slate-50 p-2 rounded text-center text-xs">
                    <div>
                      <div className="text-[9px] uppercase text-slate-500 font-semibold">Score</div>
                      <div className="font-bold text-slate-900 mt-0.5">
                        {attempt.score}/{attempt.maxScore}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase text-slate-500 font-semibold">Accuracy</div>
                      <div className="font-bold text-slate-900 mt-0.5">
                        {attempt.accuracy}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase text-slate-500 font-semibold">Duration</div>
                      <div className="font-bold text-slate-700 mt-0.5">
                        {formatSeconds(attempt.timeTakenSeconds)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { localStore } from '../storage/localStore';
import { useAuth } from '../context/AuthContext';
import { syncBookmarkAction } from '../lib/firestore';
import { Question } from '../types/exam';
import { Bookmark, Play, Trash2 } from 'lucide-react';
import { allQuestions } from '../data/questions/sampleExams';

interface SavedQuestionsViewProps {
  onStartBookmarkExam: (questions: Question[]) => void;
  onGoToExams: () => void;
}

export const SavedQuestionsView: React.FC<SavedQuestionsViewProps> = ({
  onStartBookmarkExam,
  onGoToExams
}) => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [revealedMap, setRevealedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setBookmarks(localStore.getBookmarks());
  }, []);

  const savedQuestions = allQuestions.filter((q) => bookmarks.includes(q.id));

  const handleRemoveBookmark = (id: string) => {
    localStore.toggleBookmark(id);
    setBookmarks((prev) => prev.filter((b) => b !== id));
    if (user) {
      syncBookmarkAction(user.uid, id, false).catch(() => {});
    }
  };

  const handleStartPractice = () => {
    if (savedQuestions.length > 0) {
      onStartBookmarkExam(savedQuestions);
    }
  };

  const toggleExplanation = (id: string) => {
    setRevealedMap((prev) => ({
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
          <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest text-amber-700">
            SAVED QUESTION VAULT
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            Bookmarked Questions
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Questions flagged for periodic conceptual revision and mastery drills.
          </p>
        </div>

        {savedQuestions.length > 0 && (
          <button
            onClick={handleStartPractice}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors self-start sm:self-auto shadow-xs cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>PRACTICE BOOKMARKS ({savedQuestions.length})</span>
          </button>
        )}
      </div>

      {savedQuestions.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 text-center max-w-md mx-auto space-y-3 cbt-shadow">
          <Bookmark className="w-8 h-8 text-amber-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Bookmarked Questions</h3>
          <p className="text-xs text-slate-500 font-sans">
            Bookmark tricky questions while taking an exam or reviewing results to practice them here in isolation.
          </p>
          <button
            onClick={onGoToExams}
            className="px-4 py-2 text-xs font-mono font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-xs cursor-pointer"
          >
            BROWSE EXAMS
          </button>
        </div>
      ) : (
        <div className="space-y-3 w-full">
          {savedQuestions.map((q) => {
            const isRevealed = !!revealedMap[q.id];
            const correctIdx = typeof q.correctAnswer === 'number' ? q.correctAnswer : -1;

            return (
              <div
                key={q.id}
                className="bg-white rounded-lg border border-slate-200 p-4 sm:p-5 cbt-shadow space-y-3 w-full"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="font-bold text-indigo-700 uppercase">
                      {q.subject}
                    </span>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-600">{q.chapter}</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-500 uppercase">{q.topic}</span>
                  </div>

                  <button
                    onClick={() => handleRemoveBookmark(q.id)}
                    className="text-slate-400 hover:text-rose-600 flex items-center gap-1 text-[11px] transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>REMOVE</span>
                  </button>
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
      )}
    </div>
  );
};

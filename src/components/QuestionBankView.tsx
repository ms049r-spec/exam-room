import React, { useState } from 'react';
import { allQuestions } from '../data/questions/sampleExams';
import { useUserData } from '../context/UserDataContext';
import { Search, Bookmark } from 'lucide-react';

interface QuestionBankViewProps {
  onBookmarkChange: () => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({ onBookmarkChange }) => {
  const { isBookmarked, toggleBookmark } = useUserData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  const subjects = ['all', ...Array.from(new Set(allQuestions.map((q) => q.subject)))];

  const filteredQuestions = allQuestions.filter((q) => {
    if (selectedSubject !== 'all' && q.subject !== selectedSubject) return false;
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      const inQ = q.question.toLowerCase().includes(lower);
      const inTopic = q.topic.toLowerCase().includes(lower);
      const inChapter = q.chapter.toLowerCase().includes(lower);
      if (!inQ && !inTopic && !inChapter) return false;
    }
    return true;
  });

  const handleToggleBookmark = async (id: string) => {
    await toggleBookmark(id);
    onBookmarkChange();
  };

  const toggleAnswer = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getOptionLetter = (idx: number) => ['A', 'B', 'C', 'D', 'E', 'F'][idx] || `${idx + 1}`;

  return (
    <div className="max-w-6xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-8 pb-12 sm:pb-16 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-slate-200 w-full">
        <div>
          <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest text-indigo-700">
            ITEM POOL REPOSITORY
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            Master Question Bank
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Comprehensive question repository with verified keys and complete anatomical/physical explanations.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-600 bg-white border border-slate-300 px-3 py-1 rounded shrink-0 self-start sm:self-auto">
          {filteredQuestions.length} / {allQuestions.length} ITEMS MATCHING
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="liquid-glass-panel rounded-2xl border border-white/80 p-3.5 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search keywords, topics, or chapters..."
            className="liquid-glass-input w-full pl-10 pr-3 py-2 text-xs sm:text-sm font-sans rounded-xl"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto font-mono text-xs">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="liquid-glass-input flex-1 sm:flex-initial px-3 py-2 rounded-xl text-slate-800 uppercase font-semibold cursor-pointer"
          >
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'ALL SUBJECTS' : s.toUpperCase()}
              </option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="liquid-glass-input flex-1 sm:flex-initial px-3 py-2 rounded-xl text-slate-800 uppercase font-semibold cursor-pointer"
          >
            <option value="all">ALL DIFFICULTIES</option>
            <option value="easy">EASY</option>
            <option value="moderate">MODERATE</option>
            <option value="hard">HARD</option>
          </select>
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-3.5 w-full">
        {filteredQuestions.map((q) => {
          const isRevealed = !!revealedIds[q.id];
          const isBookmarkedQuestion = isBookmarked(q.id);
          const correctIdx = typeof q.correctAnswer === 'number' ? q.correctAnswer : -1;

          return (
            <div
              key={q.id}
              className="liquid-glass-panel rounded-2xl border border-white/80 p-5 sm:p-6 shadow-sm space-y-3.5 w-full"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="font-bold text-indigo-700 uppercase">
                    {q.subject}
                  </span>
                  <span className="text-slate-300">/</span>
                  <span className="text-slate-600">{q.chapter}</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-slate-500 uppercase">{q.difficulty}</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-slate-600">+{q.marks.correct}/{q.marks.incorrect}</span>
                </div>

                <button
                  onClick={() => handleToggleBookmark(q.id)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded border transition-colors cursor-pointer shrink-0 ${
                    isBookmarkedQuestion
                      ? 'border-amber-300 bg-amber-50 text-amber-900 font-bold'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <Bookmark className={`w-3 h-3 ${isBookmarkedQuestion ? 'fill-amber-500 text-amber-600' : 'text-slate-400'}`} />
                  <span>{isBookmarkedQuestion ? 'SAVED' : 'SAVE'}</span>
                </button>
              </div>

              <p className="text-sm font-semibold text-slate-950 leading-relaxed">
                {q.question}
              </p>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {q.options.map((opt, idx) => {
                  const isCorrect = isRevealed && correctIdx === idx;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-2.5 transition-colors ${
                        isCorrect
                          ? 'border-emerald-400 bg-emerald-500/15 text-emerald-950 font-semibold shadow-xs'
                          : 'border-white/80 bg-white/40 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-500 bg-black/5 w-5 h-5 rounded-md flex items-center justify-center text-[11px] shrink-0">{getOptionLetter(idx)}</span>
                        <span>{formatMathText(opt)}</span>
                      </div>
                      {isCorrect && (
                        <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase shrink-0 bg-emerald-100/90 px-1.5 py-0.5 rounded-md">
                          CORRECT
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <button
                  onClick={() => toggleAnswer(q.id)}
                  className="text-xs font-mono text-[#4A4E69] hover:text-[#22223B] font-bold cursor-pointer transition-colors"
                >
                  {isRevealed ? 'Hide Official Solution ▲' : 'Show Official Solution ▼'}
                </button>
              </div>

              {isRevealed && (
                <div className="p-3.5 bg-indigo-500/10 border border-indigo-200/70 rounded-xl text-xs space-y-1.5 mt-2 backdrop-blur-xs">
                  <span className="font-mono font-bold uppercase text-[10px] text-[#22223B] tracking-wider block">
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
  );
};

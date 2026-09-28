/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  ExamDefinition,
  ExamConfig,
  ActiveExamSession,
  ExamResult,
  Question
} from './types/exam';
import { examDefinitions, allQuestions } from './data/questions/sampleExams';
import { excretorySystemQuestions } from './data/questions/excretorySystem';
import { localStore } from './storage/localStore';
import { shuffleArray, shuffleQuestionOptions } from './utils/examEngine';
import {
  getAllPracticeExams,
  getPublishedExams,
  getFeaturedExams
} from './lib/examRegistry';

// Components
import { Navbar } from './components/Navbar';
import { ExamCard } from './components/ExamCard';
import { ExamConfigModal } from './components/ExamConfigModal';
import { ExamEngine } from './components/ExamEngine';
import { ResultDashboard } from './components/ResultDashboard';
import { QuestionBankView } from './components/QuestionBankView';
import { MistakesView } from './components/MistakesView';
import { SavedQuestionsView } from './components/SavedQuestionsView';
import { AnalyticsView } from './components/AnalyticsView';
import { ExamGeneratorModal } from './components/ExamGeneratorModal';
import { AuthModal } from './components/AuthModal';
import { AccountView } from './components/AccountView';
import { LeaderboardView } from './components/LeaderboardView';
import { FeaturedExamCarousel } from './components/FeaturedExamCarousel';

import { useAuth } from './context/AuthContext';
import { useUserData } from './context/UserDataContext';

import { Sparkles, AlertCircle, Play, BookOpen, Search, X, ChevronDown, ChevronRight } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('exams');
  const allExams: ExamDefinition[] = getAllPracticeExams();
  const [selectedExamForConfig, setSelectedExamForConfig] = useState<ExamDefinition | null>(null);
  const [activeSession, setActiveSession] = useState<ActiveExamSession | null>(null);
  const [currentResult, setCurrentResult] = useState<ExamResult | null>(null);
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);

  // Exam Library Search and Subject Filter State
  const [examSearchTerm, setExamSearchTerm] = useState<string>('');
  const [selectedExamSubject, setSelectedExamSubject] = useState<string>('all');
  // State for collapsible subject dropdowns
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({});

  // Authentication & Authoritative User Records (Firestore-first)
  const { user } = useAuth();
  const { bookmarks, mistakesList, getExamBestScore, recordExamResult } = useUserData();

  const bookmarksCount = bookmarks.length;
  const mistakesCount = mistakesList.length;

  const publishedExams = getPublishedExams(allExams);
  const featuredExams = getFeaturedExams(allExams);

  const availableSubjects = useMemo(() => [
    'all',
    ...Array.from(new Set(publishedExams.map((e) => e.subject).filter(Boolean)))
  ], [publishedExams]);

  const activeSubjectsToDisplay = useMemo(() => {
    if (selectedExamSubject !== 'all') {
      return [selectedExamSubject];
    }
    return availableSubjects.filter((s) => s !== 'all');
  }, [availableSubjects, selectedExamSubject]);

  const filteredExamsBySubject = useMemo(() => {
    const term = examSearchTerm.trim().toLowerCase();
    const result: { [subject: string]: ExamDefinition[] } = {};

    activeSubjectsToDisplay.forEach((subj) => {
      const exams = publishedExams.filter((exam) => {
        if (exam.subject.toLowerCase() !== subj.toLowerCase()) return false;
        if (!term) return true;
        const titleMatch = exam.title.toLowerCase().includes(term);
        const subjectMatch = exam.subject.toLowerCase().includes(term);
        const chapterMatch = (exam.chapter || '').toLowerCase().includes(term);
        const descMatch = (exam.description || '').toLowerCase().includes(term);
        const tagMatch = (exam.tag || '').toLowerCase().includes(term);
        return titleMatch || subjectMatch || chapterMatch || descMatch || tagMatch;
      });
      if (exams.length > 0) {
        result[subj] = exams;
      }
    });

    return result;
  }, [activeSubjectsToDisplay, publishedExams, examSearchTerm]);

  const totalFilteredExamsCount = useMemo(() => {
    return Object.values(filteredExamsBySubject).reduce((acc, list) => acc + list.length, 0);
  }, [filteredExamsBySubject]);

  // Resume notification banner if active session found on refresh
  const [resumePrompt, setResumePrompt] = useState<ActiveExamSession | null>(null);

  useEffect(() => {
    // Check for active session recovery for the active account
    const saved = localStore.getActiveSession();
    if (saved && saved.questions.length > 0) {
      setResumePrompt(saved);
    } else {
      setResumePrompt(null);
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = localStore.subscribe(() => {
      const saved = localStore.getActiveSession();
      if (saved && saved.questions.length > 0) {
        setResumePrompt(saved);
      } else {
        setResumePrompt(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Launching an exam from configuration
  const handleStartExamWithConfig = (exam: ExamDefinition, config: ExamConfig) => {
    let finalQuestions = [...exam.questions];

    if (config.shuffleQuestions) {
      finalQuestions = shuffleArray(finalQuestions);
    }

    if (config.shuffleOptions) {
      finalQuestions = finalQuestions.map((q) => shuffleQuestionOptions(q));
    }

    const duration = config.timeMode === 'timed'
      ? (config.durationMinutes || exam.defaultDurationMinutes || 45)
      : 0;

    const newSession: ActiveExamSession = {
      examId: exam.id,
      examTitle: exam.title,
      subject: exam.subject,
      chapter: exam.chapter || '',
      questions: finalQuestions,
      answers: {},
      markedForReview: {},
      currentIndex: 0,
      timeMode: config.timeMode,
      durationMinutes: duration,
      startedAt: Date.now(),
      targetEndTime: duration > 0 ? Date.now() + duration * 60 * 1000 : null,
      markingScheme: exam.markingScheme || { correct: 4, incorrect: -1, unattempted: 0 }
    };

    localStore.saveActiveSession(newSession);
    setActiveSession(newSession);
    setSelectedExamForConfig(null);
    setCurrentView('taking_exam');
  };

  // Resume an interrupted session
  const handleResumeSession = () => {
    if (resumePrompt) {
      setActiveSession(resumePrompt);
      setResumePrompt(null);
      setCurrentView('taking_exam');
    }
  };

  const handleDiscardResume = () => {
    localStore.clearActiveSession();
    setResumePrompt(null);
  };

  // Exam completion
  const handleFinishExam = async (result: ExamResult) => {
    setCurrentResult(result);
    setActiveSession(null);
    setCurrentView('result');
    await recordExamResult(result);
  };

  // Retake current exam
  const handleRetakeExam = (options: { shuffleQuestions: boolean; shuffleOptions: boolean }) => {
    if (!currentResult) return;

    // Find original exam definition or construct from current result
    const original = examDefinitions.find((e) => e.id === currentResult.examId);
    const baseQuestions = original ? original.questions : currentResult.questions;

    let finalQuestions = [...baseQuestions];
    if (options.shuffleQuestions) {
      finalQuestions = shuffleArray(finalQuestions);
    }
    if (options.shuffleOptions) {
      finalQuestions = finalQuestions.map((q) => shuffleQuestionOptions(q));
    }

    const duration = currentResult.isTimed && currentResult.totalTimeSeconds
      ? Math.round(currentResult.totalTimeSeconds / 60)
      : 45;

    const newSession: ActiveExamSession = {
      examId: currentResult.examId,
      examTitle: currentResult.examTitle,
      subject: currentResult.subject,
      chapter: currentResult.chapter,
      questions: finalQuestions,
      answers: {},
      markedForReview: {},
      currentIndex: 0,
      timeMode: currentResult.isTimed ? 'timed' : 'untimed',
      durationMinutes: duration,
      startedAt: Date.now(),
      targetEndTime: currentResult.isTimed ? Date.now() + duration * 60 * 1000 : null,
      markingScheme: { correct: 4, incorrect: -1, unattempted: 0 }
    };

    localStore.saveActiveSession(newSession);
    setActiveSession(newSession);
    setCurrentView('taking_exam');
  };

  // Practice only wrong questions
  const handlePracticeWrongQuestions = (wrongQuestions: Question[]) => {
    const wrongExam: ExamDefinition = {
      id: `mistakes-session-${Date.now()}`,
      title: 'Targeted Mistake Remediation',
      subject: wrongQuestions[0]?.subject || 'Mixed',
      chapter: 'Mistake Drill',
      description: `Targeted practice session containing ${wrongQuestions.length} questions previously answered incorrectly.`,
      questionCount: wrongQuestions.length,
      difficulty: 'Moderate',
      defaultDurationMinutes: Math.max(5, Math.ceil(wrongQuestions.length * 1.5)),
      markingScheme: { correct: 4, incorrect: -1, unattempted: 0 },
      tag: 'Mistake Practice',
      questions: wrongQuestions
    };

    setSelectedExamForConfig(wrongExam);
  };

  // Practice bookmarked questions
  const handlePracticeBookmarks = (bookmarkQuestions: Question[]) => {
    const bookmarkExam: ExamDefinition = {
      id: `bookmarks-session-${Date.now()}`,
      title: 'Saved Bookmarks Review',
      subject: bookmarkQuestions[0]?.subject || 'Mixed',
      chapter: 'Bookmark Practice',
      description: `Targeted practice session containing ${bookmarkQuestions.length} bookmarked questions.`,
      questionCount: bookmarkQuestions.length,
      difficulty: 'Moderate',
      defaultDurationMinutes: Math.max(5, Math.ceil(bookmarkQuestions.length * 1.5)),
      markingScheme: { correct: 4, incorrect: -1, unattempted: 0 },
      tag: 'Bookmarks Review',
      questions: bookmarkQuestions
    };

    setSelectedExamForConfig(bookmarkExam);
  };

  // Daily practice quick launcher
  const handleStartDailyPractice = () => {
    const shuffled = shuffleArray(allQuestions);
    const questions = shuffled.slice(0, 10);

    const dailyExam: ExamDefinition = {
      id: `daily-practice-${new Date().toISOString().split('T')[0]}`,
      title: 'Daily Practice Drill',
      subject: 'Mixed Disciplines',
      chapter: 'Curated Random Selection',
      description: 'Quick 10-question sprint across multiple topics designed for rapid conceptual reinforcement.',
      questionCount: 10,
      difficulty: 'Moderate',
      defaultDurationMinutes: 10,
      markingScheme: { correct: 4, incorrect: -1, unattempted: 0 },
      tag: 'Daily Sprint',
      questions
    };

    setSelectedExamForConfig(dailyExam);
  };

  // Quick launch for high-yield topic drills
  const handleStartTopicDrill = (topicName: string) => {
    const topicQuestions = excretorySystemQuestions.filter((q) => q.chapter === topicName);
    const questions = topicQuestions.length > 0 ? topicQuestions : excretorySystemQuestions.slice(0, 5);

    const topicExam: ExamDefinition = {
      id: `topic-drill-${topicName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      title: `${topicName} Topic Drill`,
      subject: 'Biology',
      chapter: topicName,
      description: `Targeted high-yield drill focusing on core concepts from ${topicName}.`,
      questionCount: questions.length,
      difficulty: 'Moderate',
      defaultDurationMinutes: Math.max(5, Math.ceil(questions.length * 1.5)),
      markingScheme: { correct: 4, incorrect: -1, unattempted: 0 },
      tag: 'Topic Drill',
      questions
    };

    setSelectedExamForConfig(topicExam);
  };

  // Top navigation dispatcher
  const handleNavigate = (view: string) => {
    if (view === 'start-daily-practice') {
      handleStartDailyPractice();
      return;
    }
    if (view.startsWith('start-topic-drill:')) {
      const topicName = view.replace('start-topic-drill:', '');
      handleStartTopicDrill(topicName);
      return;
    }
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen liquid-glass-ambient flex flex-col antialiased selection:bg-[#22223B] selection:text-[#F2E9E4]">
      {/* Top Navbar Header (Hidden during CBT Exam taking mode) */}
      {currentView !== 'taking_exam' && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          bookmarksCount={bookmarksCount}
          mistakesCount={mistakesCount}
          onStartDailyPractice={handleStartDailyPractice}
        />
      )}

      {/* Floating Session Resume Banner */}
      {resumePrompt && currentView !== 'taking_exam' && (
        <div className="bg-[#22223B] text-[#F2E9E4] px-4 py-2.5 shadow-md flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 max-w-xl truncate">
            <AlertCircle className="w-4 h-4 text-[#C9ADA7] shrink-0" />
            <span className="truncate">
              Interrupted Session Found: <strong>{resumePrompt.examTitle}</strong> (Q{resumePrompt.currentIndex + 1}/{resumePrompt.questions.length})
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleResumeSession}
              className="px-3 py-1 bg-[#F2E9E4] hover:bg-white text-[#22223B] font-bold rounded flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Resume</span>
            </button>
            <button
              onClick={handleDiscardResume}
              className="px-2 py-1 text-[#9A8C98] hover:text-white cursor-pointer"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {/* VIEW: Taking Active Exam */}
      {currentView === 'taking_exam' && activeSession && (
        <ExamEngine
          initialSession={activeSession}
          onFinishExam={handleFinishExam}
          onQuitExam={() => {
            localStore.clearActiveSession();
            setActiveSession(null);
            setCurrentView('exams');
          }}
        />
      )}

      {/* VIEW: Exam Result Analytics */}
      {currentView === 'result' && currentResult && (
        <ResultDashboard
          result={currentResult}
          onRetake={handleRetakeExam}
          onBackToHome={() => setCurrentView('exams')}
          onPracticeWrong={handlePracticeWrongQuestions}
        />
      )}

      {/* VIEW: Question Bank Directory */}
      {currentView === 'bank' && (
        <QuestionBankView onBookmarkChange={() => {}} />
      )}

      {/* VIEW: Mistakes & Remediation Notebook */}
      {currentView === 'mistakes' && (
        <MistakesView
          onStartMistakeExam={handlePracticeWrongQuestions}
          onGoToExams={() => setCurrentView('exams')}
        />
      )}

      {/* VIEW: Saved / Bookmarked Questions */}
      {currentView === 'saved' && (
        <SavedQuestionsView
          onStartBookmarkExam={handlePracticeBookmarks}
          onGoToExams={() => setCurrentView('exams')}
        />
      )}

      {/* VIEW: Analytics & Diagnostics */}
      {currentView === 'analytics' && (
        <AnalyticsView
          onReviewAttempt={(res) => {
            setCurrentResult(res);
            setCurrentView('result');
          }}
          onGoToExams={() => setCurrentView('exams')}
        />
      )}

      {/* VIEW: Public Standings Leaderboard */}
      {currentView === 'leaderboard' && (
        <LeaderboardView
          onGoToAccount={() => setCurrentView('account')}
          onGoToExams={() => setCurrentView('exams')}
          exams={allExams}
        />
      )}

      {/* VIEW: User Account & Settings */}
      {currentView === 'account' && (
        <AccountView
          onReviewAttempt={(res) => {
            setCurrentResult(res);
            setCurrentView('result');
          }}
          onGoToExams={() => setCurrentView('exams')}
          onNavigate={handleNavigate}
        />
      )}

      {/* VIEW: Home / Exam Selection */}
      {currentView === 'exams' && (
        <main className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 py-4 sm:py-6 pb-12 sm:pb-16 flex-1 space-y-5 sm:space-y-8 min-w-0">
          {/* EXAM LIBRARY HEADER */}
          <div className="liquid-glass-panel rounded-2xl p-4 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5 border border-white/80 shadow-sm relative overflow-hidden w-full min-w-0">
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-[#4A4E69] uppercase flex-wrap">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22223B]" />
                <span>EXAM LIBRARY</span>
                <span className="text-[#9A8C98]">/</span>
                <span className="text-[#9A8C98]">STANDARDIZED PRACTICE</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#22223B] break-words">
                Standardized Practice Papers
              </h1>
              <p className="text-xs sm:text-sm text-[#4A4E69] font-sans max-w-2xl leading-relaxed break-words">
                Search and browse all available practice examinations organized by subject. Objective simulations with instant scoring, negative marking, and detailed solutions.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
              <button
                onClick={() => setShowGeneratorModal(true)}
                className="liquid-glass-btn-secondary inline-flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold rounded-xl cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#4A4E69]" />
                <span>CUSTOM EXAM</span>
              </button>
            </div>
          </div>

          {/* FEATURED EXAMS MULTI-CAROUSEL */}
          <FeaturedExamCarousel
            exams={featuredExams}
            onSelectExam={(exam) => setSelectedExamForConfig(exam)}
          />

          {/* EXAM SEARCH & SUBJECT NAVIGATION */}
          <div className="liquid-glass-panel rounded-2xl p-3.5 sm:p-5 border border-white/80 shadow-sm space-y-3.5 w-full min-w-0">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full min-w-0">
              {/* Search Bar */}
              <div className="relative flex-1 w-full min-w-0">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A8C98]" />
                <input
                  type="text"
                  value={examSearchTerm}
                  onChange={(e) => setExamSearchTerm(e.target.value)}
                  placeholder="Search exam title, subject, chapter, or topic..."
                  className="liquid-glass-input w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl text-[#22223B] placeholder-[#9A8C98]"
                />
                {examSearchTerm && (
                  <button
                    type="button"
                    onClick={() => setExamSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A8C98] hover:text-[#22223B] p-1 rounded-md cursor-pointer transition-colors"
                    title="Clear search"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Subject Navigation Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none font-mono text-xs w-full md:w-auto max-w-full min-w-0">
                {availableSubjects.map((subj) => {
                  const isSelected = selectedExamSubject.toLowerCase() === subj.toLowerCase();
                  return (
                    <button
                      key={subj}
                      onClick={() => setSelectedExamSubject(subj)}
                      className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                        isSelected
                          ? 'liquid-glass-btn-primary shadow-xs'
                          : 'liquid-glass-btn-secondary text-[#4A4E69] hover:text-[#22223B]'
                      }`}
                    >
                      {subj === 'all' ? 'All Subjects' : subj}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Filter Summary */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#4A4E69] pt-2 border-t border-[#4A4E69]/15 w-full min-w-0">
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <span className="font-semibold text-[#22223B]">
                  {totalFilteredExamsCount} of {publishedExams.length} {publishedExams.length === 1 ? 'paper' : 'papers'} available
                </span>
                {examSearchTerm && (
                  <span className="text-[#9A8C98] truncate max-w-[200px]">
                    matching &ldquo;<span className="text-[#22223B] font-bold">{examSearchTerm}</span>&rdquo;
                  </span>
                )}
                {selectedExamSubject !== 'all' && (
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#22223B]/10 text-[#22223B] font-bold uppercase">
                    {selectedExamSubject}
                  </span>
                )}
              </div>
              {(examSearchTerm || selectedExamSubject !== 'all') && (
                <button
                  onClick={() => {
                    setExamSearchTerm('');
                    setSelectedExamSubject('all');
                  }}
                  className="text-xs font-bold text-[#4A4E69] hover:text-[#22223B] hover:underline cursor-pointer"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>

          {/* EXAM LIBRARY: COMPACT COLLAPSIBLE SUBJECT DROPDOWN SECTIONS */}
          {totalFilteredExamsCount === 0 ? (
            <div className="liquid-glass-panel rounded-2xl p-8 sm:p-10 text-center space-y-3 border border-white/80 shadow-sm max-w-md mx-auto w-full">
              <BookOpen className="w-8 h-8 text-[#9A8C98] mx-auto" />
              <h3 className="text-base font-bold text-[#22223B]">No examinations found</h3>
              <p className="text-xs text-[#4A4E69] leading-relaxed">
                No practice papers match {examSearchTerm ? `"${examSearchTerm}"` : 'the selected filters'}. Try another query or clear filters.
              </p>
              <button
                onClick={() => {
                  setExamSearchTerm('');
                  setSelectedExamSubject('all');
                }}
                className="liquid-glass-btn-primary px-4 py-2 text-xs font-mono font-bold rounded-xl cursor-pointer"
              >
                Reset search filters
              </button>
            </div>
          ) : (
            <div className="space-y-3.5 sm:space-y-4 w-full min-w-0">
              {Object.entries(filteredExamsBySubject).map(([subjectName, subjectExams]) => {
                const isExpanded = expandedSubjects[subjectName.toLowerCase()] !== false;
                // Sort exams newest first (createdAt DESC)
                const sortedSubjectExams = [...subjectExams].sort((a, b) => {
                  const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                  const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                  return dateB - dateA;
                });

                const toggleDropdown = () => {
                  setExpandedSubjects((prev) => ({
                    ...prev,
                    [subjectName.toLowerCase()]: !isExpanded
                  }));
                };

                return (
                  <div
                    key={subjectName}
                    className="liquid-glass-panel rounded-2xl border border-white/80 overflow-hidden shadow-sm transition-all w-full min-w-0"
                  >
                    {/* Collapsible Subject Row (Clicking row controls the dropdown) */}
                    <button
                      type="button"
                      onClick={toggleDropdown}
                      aria-expanded={isExpanded}
                      className="w-full px-3.5 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-2.5 sm:gap-3 text-left hover:bg-white/60 transition-colors cursor-pointer min-w-0"
                    >
                      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-[#22223B] shrink-0" />
                        <h2 className="text-xs sm:text-base font-mono font-extrabold uppercase tracking-wider text-[#22223B] truncate">
                          {subjectName}
                        </h2>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <span className="text-[10px] sm:text-[11px] font-mono font-bold px-2 sm:px-2.5 py-0.5 rounded-full bg-white/80 border border-[#9A8C98]/30 text-[#4A4E69] shadow-2xs">
                          {subjectExams.length} {subjectExams.length === 1 ? 'PAPER' : 'PAPERS'}
                        </span>
                        <span className="text-[#4A4E69]">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-[#22223B]" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-[#9A8C98]" />
                          )}
                        </span>
                      </div>
                    </button>

                    {/* Compact Exam Rows Underneath */}
                    {isExpanded && (
                      <div className="border-t border-[#4A4E69]/15 px-2.5 sm:px-5 py-2.5 space-y-1.5 bg-white/30 w-full min-w-0">
                        {sortedSubjectExams.map((exam) => {
                          const bestScore = getExamBestScore(exam.id);

                          return (
                            <div
                              key={exam.id}
                              onClick={() => setSelectedExamForConfig(exam)}
                              className="p-3 sm:p-3.5 rounded-xl bg-white/70 hover:bg-white border border-white/80 hover:border-[#9A8C98]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs group w-full min-w-0"
                            >
                              <div className="space-y-1 min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                  <span className="font-bold text-xs sm:text-sm text-[#22223B] group-hover:text-[#22223B] leading-tight break-words">
                                    {exam.title}
                                  </span>
                                  {exam.tag && (
                                    <span className="text-[9px] sm:text-[10px] font-mono font-bold px-1.5 sm:px-2 py-0.5 rounded bg-[#C9ADA7]/25 border border-[#C9ADA7]/40 text-[#4A4E69] uppercase">
                                      {exam.tag}
                                    </span>
                                  )}
                                </div>
                                {exam.chapter && (
                                  <p className="text-[11px] font-mono text-[#9A8C98] line-clamp-1">
                                    {exam.chapter}
                                  </p>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 shrink-0 self-start sm:self-center font-mono text-xs">
                                {bestScore !== undefined && bestScore !== null && (
                                  <span className="px-2 py-0.5 rounded-lg bg-[#C9ADA7]/30 border border-[#C9ADA7]/50 text-[#22223B] font-bold text-[11px] tabular-nums">
                                    Best: {bestScore}%
                                  </span>
                                )}
                                <span className="px-2 py-0.5 rounded-lg bg-white/80 border border-[#9A8C98]/30 text-[#4A4E69] text-[11px] tabular-nums">
                                  {exam.questionCount || exam.questions?.length || 0}Q
                                </span>
                                <span className="px-2 py-0.5 rounded-lg bg-white/80 border border-[#9A8C98]/30 text-[#4A4E69] text-[11px] tabular-nums">
                                  {exam.defaultDurationMinutes}m
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedExamForConfig(exam);
                                  }}
                                  className="liquid-glass-btn-primary px-3 py-1 text-[11px] font-bold rounded-lg uppercase tracking-wider inline-flex items-center gap-1 cursor-pointer shadow-2xs"
                                >
                                  <Play className="w-3 h-3 fill-current" />
                                  <span>Start</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      )}

      {/* Developer Attribution */}
      {currentView !== 'taking_exam' && (
        <footer className="mt-auto py-6 px-4 text-center text-xs font-mono text-[#9A8C98]">
          <p>Built by © 2026 MullaSameer</p>
          <p>
            <a
              href="https://github.com/ms049r-spec"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4A4E69] hover:text-[#22223B] hover:underline transition-colors"
            >
              @ms049r-spec
            </a>
          </p>
        </footer>
      )}

      {/* Exam Configuration Modal */}
      {selectedExamForConfig && (
        <ExamConfigModal
          exam={selectedExamForConfig}
          onClose={() => setSelectedExamForConfig(null)}
          onStart={(config) => handleStartExamWithConfig(selectedExamForConfig, config)}
        />
      )}

      {/* Custom Exam Generator Modal */}
      {showGeneratorModal && (
        <ExamGeneratorModal
          onClose={() => setShowGeneratorModal(false)}
          onStartGeneratedExam={(generatedExam, config) => {
            setShowGeneratorModal(false);
            handleStartExamWithConfig(generatedExam, config);
          }}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal />
    </div>
  );
}

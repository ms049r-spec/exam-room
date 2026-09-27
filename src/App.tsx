/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
import { saveAttemptAutomatically } from './lib/firestore';
import { maybeUpdateLeaderboardOnExamComplete } from './lib/leaderboard';

import { Sparkles, AlertCircle, Play, ShieldAlert, BookOpen, Layers } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('exams');
  const [selectedExamForConfig, setSelectedExamForConfig] = useState<ExamDefinition | null>(null);
  const [activeSession, setActiveSession] = useState<ActiveExamSession | null>(null);
  const [currentResult, setCurrentResult] = useState<ExamResult | null>(null);
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);

  // Authentication
  const { user } = useAuth();

  // Resume notification banner if active session found on refresh
  const [resumePrompt, setResumePrompt] = useState<ActiveExamSession | null>(null);

  // Stats badge counts
  const [bookmarksCount, setBookmarksCount] = useState<number>(0);
  const [mistakesCount, setMistakesCount] = useState<number>(0);

  // Best score map per exam
  const [bestScores, setBestScores] = useState<Record<string, number>>({});

  const refreshCounts = () => {
    setBookmarksCount(localStore.getBookmarks().length);
    setMistakesCount(Object.keys(localStore.getMistakes()).length);

    // Compute best scores
    const history = localStore.getHistory();
    const map: Record<string, number> = {};
    history.forEach((h) => {
      if (map[h.examId] === undefined || h.percentage > map[h.examId]) {
        map[h.examId] = h.percentage;
      }
    });
    setBestScores(map);
  };

  useEffect(() => {
    refreshCounts();

    // Check for active session recovery
    const saved = localStore.getActiveSession();
    if (saved && saved.questions.length > 0) {
      setResumePrompt(saved);
    }
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

    const now = Date.now();
    const targetEndTime = config.timeMode === 'timed'
      ? now + config.durationMinutes * 60 * 1000
      : null;

    const newSession: ActiveExamSession = {
      examId: exam.id,
      examTitle: exam.title,
      subject: exam.subject,
      chapter: exam.chapter,
      questions: finalQuestions,
      answers: {},
      markedForReview: {},
      currentIndex: 0,
      timeMode: config.timeMode,
      durationMinutes: config.durationMinutes,
      startedAt: now,
      targetEndTime,
      markingScheme: exam.markingScheme
    };

    localStore.saveActiveSession(newSession);
    setActiveSession(newSession);
    setSelectedExamForConfig(null);
    setResumePrompt(null);
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
  const handleFinishExam = (result: ExamResult) => {
    setCurrentResult(result);
    setActiveSession(null);
    refreshCounts();
    setCurrentView('result');

    // If authenticated, automatically save to Firestore in background without prompt
    if (user) {
      saveAttemptAutomatically(user.uid, result).catch((err) => {
        console.warn('Automatic attempt sync queued:', err);
      });

      // Also check if user has opted into leaderboards and update their entry if it's a new best
      maybeUpdateLeaderboardOnExamComplete(user.uid, result).catch((err) => {
        console.warn('Background leaderboard sync notice:', err);
      });
    }
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

  // Navigation handler
  const handleNavigate = (view: string) => {
    if (view === 'generator') {
      setShowGeneratorModal(true);
    } else {
      setCurrentView(view);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navbar: only displayed outside active exam mode for true CBT fullscreen immersion */}
      {currentView !== 'taking_exam' && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          bookmarksCount={bookmarksCount}
          mistakesCount={mistakesCount}
          onStartDailyPractice={handleStartDailyPractice}
        />
      )}

      {/* Active Session Recovery Banner (If user refreshed while taking exam) */}
      {resumePrompt && currentView !== 'taking_exam' && (
        <div className="bg-amber-600 text-white px-4 py-2 text-xs font-mono">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-200" />
              <span>
                <strong>SESSION RECOVERY:</strong> Unfinished attempt detected for "{resumePrompt.examTitle}".
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDiscardResume}
                className="px-2.5 py-1 bg-amber-700 hover:bg-amber-800 rounded text-amber-100 font-bold uppercase transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleResumeSession}
                className="px-3 py-1 bg-white text-slate-900 hover:bg-amber-50 rounded font-bold uppercase transition-colors shadow-2xs"
              >
                Resume Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: Taking Exam (Full-screen CBT layout) */}
      {currentView === 'taking_exam' && activeSession && (
        <ExamEngine
          initialSession={activeSession}
          onFinishExam={handleFinishExam}
          onQuitExam={() => {
            if (window.confirm('Exit exam? Your progress will remain saved locally.')) {
              setCurrentView('exams');
            }
          }}
        />
      )}

      {/* VIEW: Result Dashboard */}
      {currentView === 'result' && currentResult && (
        <ResultDashboard
          result={currentResult}
          onRetake={handleRetakeExam}
          onPracticeWrong={handlePracticeWrongQuestions}
          onBackToHome={() => setCurrentView('exams')}
        />
      )}

      {/* VIEW: Leaderboard */}
      {currentView === 'leaderboard' && (
        <LeaderboardView
          onGoToAccount={() => setCurrentView('account')}
          onGoToExams={() => setCurrentView('exams')}
        />
      )}

      {/* VIEW: Question Bank */}
      {currentView === 'bank' && (
        <QuestionBankView onBookmarkChange={refreshCounts} />
      )}

      {/* VIEW: Mistakes Bank */}
      {currentView === 'mistakes' && (
        <MistakesView
          onStartMistakeExam={handlePracticeWrongQuestions}
          onGoToExams={() => setCurrentView('exams')}
        />
      )}

      {/* VIEW: Saved Questions / Bookmarks */}
      {currentView === 'saved' && (
        <SavedQuestionsView
          onStartBookmarkExam={handlePracticeWrongQuestions}
          onGoToExams={() => setCurrentView('exams')}
        />
      )}

      {/* VIEW: Analytics */}
      {currentView === 'analytics' && (
        <AnalyticsView
          onReviewAttempt={(res) => {
            setCurrentResult(res);
            setCurrentView('result');
          }}
          onGoToExams={() => setCurrentView('exams')}
        />
      )}

      {/* VIEW: Account / Cloud Sync */}
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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-12 sm:pb-16 flex-1 space-y-6">
          {/* Compact Introductory Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono font-bold tracking-widest text-indigo-700 uppercase">
                <span>ONLINE PRACTICE EXAMS</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500">COMPUTER-BASED TESTING</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
                Standardized Practice Papers
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Objective test simulations with instant scoring, negative marking, and detailed solutions. Practice freely with no account required.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => setShowGeneratorModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold text-slate-700 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 rounded transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>CUSTOM EXAM</span>
              </button>
            </div>
          </div>

          {/* FEATURED EXAMS MULTI-CAROUSEL */}
          <FeaturedExamCarousel
            exams={examDefinitions.filter((e) => e.featured)}
            onSelectExam={(exam) => setSelectedExamForConfig(exam)}
          />

          {/* ALL PRACTICE PAPERS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800">
                ALL PRACTICE PAPERS
              </span>
              <span className="text-xs font-mono text-slate-500">
                {examDefinitions.length} PAPERS AVAILABLE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {examDefinitions.map((exam) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  onSelect={(selected) => setSelectedExamForConfig(selected)}
                  bestScorePercentage={bestScores[exam.id]}
                />
              ))}
            </div>
          </div>
        </main>
      )}

      {/* Developer Attribution */}
      {currentView !== 'taking_exam' && (
        <footer className="mt-auto py-6 px-4 text-center text-xs font-mono text-slate-400">
          <p>Built by © 2026 MullaSameer</p>
          <p>
            <a
              href="https://github.com/ms049r-spec"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-indigo-600 hover:underline transition-colors"
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

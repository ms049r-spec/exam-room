export type QuestionType =
  | 'single-choice'
  | 'multiple-choice'
  | 'true-false-combo'
  | 'assertion-reason'
  | 'match-following';

export interface MatchingPair {
  key: string;
  text: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer: number | number[]; // index or indices
  explanation: string;
  subject: string;
  chapter: string;
  topic: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  marks: {
    correct: number;
    incorrect: number;
    unattempted: number;
  };
  // Optional fields for specific question types
  statements?: string[];
  assertion?: string;
  reason?: string;
  columnA?: MatchingPair[];
  columnB?: MatchingPair[];
}

export interface ExamDefinition {
  id: string;
  title: string;
  subject: string;
  chapter?: string;
  description?: string;
  questionCount: number;
  difficulty?: 'Easy' | 'Moderate' | 'Hard' | 'Mixed';
  defaultDurationMinutes: number;
  duration?: number; // Duration in minutes (canonical)
  markingScheme: {
    correct: number;
    incorrect: number;
    unattempted: number;
  };
  tag?: string;
  category?: string;
  type?: string;
  questions: Question[];
  published?: boolean;
  featured?: boolean;
  createdAt?: string | number;
  updatedAt?: string | number;
  createdBy?: string;
  isBuiltIn?: boolean;
}

export interface ExamConfig {
  timeMode: 'timed' | 'untimed';
  durationMinutes: number;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
}

export interface ActiveExamSession {
  examId: string;
  examTitle: string;
  subject: string;
  chapter?: string;
  questions: Question[];
  answers: Record<string, number | number[]>;
  markedForReview: Record<string, boolean>;
  currentIndex: number;
  timeMode: 'timed' | 'untimed';
  durationMinutes: number;
  startedAt: number;
  targetEndTime: number | null; // null if untimed
  markingScheme: {
    correct: number;
    incorrect: number;
    unattempted: number;
  };
}

export interface ExamResult {
  id: string;
  examId: string;
  examTitle: string;
  subject: string;
  chapter?: string;
  timestamp: number;
  totalQuestions: number;
  attemptedCount: number;
  correctCount: number;
  wrongCount: number;
  unattemptedCount: number;
  score: number;
  maxScore: number;
  percentage: number;
  accuracy: number;
  timeTakenSeconds: number;
  totalTimeSeconds: number | null;
  isTimed: boolean;
  answers: Record<string, number | number[]>;
  questions: Question[];
  incorrectQuestionIds: string[];
  topicBreakdown: Record<string, { total: number; correct: number; wrong: number }>;
}

export interface MistakeEntry {
  questionId: string;
  wrongCount: number;
  lastAttempt: number;
  question: Question;
}

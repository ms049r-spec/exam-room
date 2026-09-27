import { Question, ExamResult, ActiveExamSession } from '../types/exam';

export function isAnswerCorrect(
  question: Question,
  userAnswer: number | number[] | undefined
): boolean {
  if (userAnswer === undefined) return false;

  if (question.type === 'multiple-choice') {
    if (!Array.isArray(userAnswer) || !Array.isArray(question.correctAnswer)) return false;
    if (userAnswer.length !== question.correctAnswer.length) return false;
    const sortedUser = [...userAnswer].sort();
    const sortedCorrect = [...question.correctAnswer].sort();
    return sortedUser.every((val, idx) => val === sortedCorrect[idx]);
  }

  return userAnswer === question.correctAnswer;
}

export function isAnswerAttempted(userAnswer: number | number[] | undefined): boolean {
  if (userAnswer === undefined) return false;
  if (Array.isArray(userAnswer)) return userAnswer.length > 0;
  return true;
}

export function calculateExamResult(
  session: ActiveExamSession,
  completedAt: number = Date.now()
): ExamResult {
  const { questions, answers, examId, examTitle, subject, chapter, startedAt, targetEndTime, timeMode, markingScheme } = session;

  let totalQuestions = questions.length;
  let correctCount = 0;
  let wrongCount = 0;
  let unattemptedCount = 0;
  let totalScore = 0;
  let maxPossibleScore = 0;
  const incorrectQuestionIds: string[] = [];
  const topicBreakdown: Record<string, { total: number; correct: number; wrong: number }> = {};

  questions.forEach((q) => {
    // Topic breakdown init
    const topicName = q.topic || 'General';
    if (!topicBreakdown[topicName]) {
      topicBreakdown[topicName] = { total: 0, correct: 0, wrong: 0 };
    }
    topicBreakdown[topicName].total += 1;

    const qMarks = q.marks || markingScheme;
    maxPossibleScore += qMarks.correct;

    const userAns = answers[q.id];
    const isAttempted = isAnswerAttempted(userAns);

    if (!isAttempted) {
      unattemptedCount += 1;
      totalScore += qMarks.unattempted;
    } else {
      const correct = isAnswerCorrect(q, userAns);
      if (correct) {
        correctCount += 1;
        totalScore += qMarks.correct;
        topicBreakdown[topicName].correct += 1;
      } else {
        wrongCount += 1;
        totalScore += qMarks.incorrect;
        topicBreakdown[topicName].wrong += 1;
        incorrectQuestionIds.push(q.id);
      }
    }
  });

  const attemptedCount = correctCount + wrongCount;
  const percentage = maxPossibleScore > 0 ? Math.max(0, Math.round(((totalScore / maxPossibleScore) * 100) * 10) / 10) : 0;
  const accuracy = attemptedCount > 0 ? Math.round(((correctCount / attemptedCount) * 100) * 10) / 10 : 0;

  // Time calculation
  let timeTakenSeconds = Math.max(1, Math.round((completedAt - startedAt) / 1000));
  const isTimed = timeMode === 'timed';
  const totalTimeSeconds = isTimed && targetEndTime ? Math.round((targetEndTime - startedAt) / 1000) : null;
  if (totalTimeSeconds && timeTakenSeconds > totalTimeSeconds) {
    timeTakenSeconds = totalTimeSeconds;
  }

  return {
    id: `result-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    examId,
    examTitle,
    subject,
    chapter,
    timestamp: completedAt,
    totalQuestions,
    attemptedCount,
    correctCount,
    wrongCount,
    unattemptedCount,
    score: totalScore,
    maxScore: maxPossibleScore,
    percentage,
    accuracy,
    timeTakenSeconds,
    totalTimeSeconds,
    isTimed,
    answers,
    questions,
    incorrectQuestionIds,
    topicBreakdown
  };
}

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function shuffleQuestionOptions(question: Question): Question {
  // If not single-choice or true-false-combo, don't shuffle options to avoid breaking matching / complex structures
  if (question.type !== 'single-choice') {
    return question;
  }

  const originalOptions = question.options;
  const originalCorrect = question.correctAnswer as number;
  const correctOptionText = originalOptions[originalCorrect];

  const indexed = originalOptions.map((opt, idx) => ({ text: opt, wasCorrect: idx === originalCorrect }));
  const shuffled = shuffleArray(indexed);

  const newOptions = shuffled.map((item) => item.text);
  const newCorrectIndex = shuffled.findIndex((item) => item.text === correctOptionText);

  return {
    ...question,
    options: newOptions,
    correctAnswer: newCorrectIndex
  };
}

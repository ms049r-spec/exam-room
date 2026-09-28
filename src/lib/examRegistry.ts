import { ExamDefinition } from '../types/exam';
import { examDefinitions as staticExamDefinitions } from '../data/questions/sampleExams';

/**
 * Normalizes an exam definition into canonical ExamDefinition format.
 */
function normalizeExam(exam: ExamDefinition): ExamDefinition {
  return {
    ...exam,
    published: exam.published !== false,
    duration: exam.duration || exam.defaultDurationMinutes || 45,
    defaultDurationMinutes: exam.defaultDurationMinutes || exam.duration || 45,
    createdAt: exam.createdAt || '2026-01-01T00:00:00.000Z',
    updatedAt: exam.updatedAt || exam.createdAt || '2026-01-01T00:00:00.000Z'
  };
}

/**
 * Safely parses the createdAt property of an exam into a numeric epoch timestamp (ms).
 * Handles ISO strings ('2026-01-01T00:00:00.000Z'), numeric epoch ms, or fallbacks.
 */
export function getExamCreatedAtTimestamp(exam: ExamDefinition): number {
  if (!exam || !exam.createdAt) return 0;
  if (typeof exam.createdAt === 'number') {
    return isNaN(exam.createdAt) ? 0 : exam.createdAt;
  }
  const parsed = Date.parse(exam.createdAt);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * ONE Central Static Exam Registry.
 * All standardized examination papers available in the CBT platform.
 * Single source of truth for Featured carousel, All Practice Papers, and Exam Engine.
 */
export const staticExams: ExamDefinition[] = staticExamDefinitions.map(normalizeExam);

/**
 * Backwards-compatibility alias for static built-in exams
 */
export const builtInExams: ExamDefinition[] = staticExams;

/**
 * Get all practice papers, sorted by createdAt descending (newest created exam first).
 * Editing source code or metadata of an older exam does NOT move that exam to the top.
 */
export function getAllPracticeExams(): ExamDefinition[] {
  return [...staticExams]
    .filter((e) => e.published !== false)
    .sort((a, b) => {
      const timeA = getExamCreatedAtTimestamp(a);
      const timeB = getExamCreatedAtTimestamp(b);
      if (timeB !== timeA) {
        return timeB - timeA; // Descending: newest created exam first
      }
      return a.title.localeCompare(b.title);
    });
}

/**
 * Filter for active student-facing published exams, sorted by createdAt descending.
 */
export function getPublishedExams(exams: ExamDefinition[] = staticExams): ExamDefinition[] {
  return [...exams]
    .filter((e) => e.published !== false)
    .sort((a, b) => {
      const timeA = getExamCreatedAtTimestamp(a);
      const timeB = getExamCreatedAtTimestamp(b);
      if (timeB !== timeA) {
        return timeB - timeA; // Descending: newest created exam first
      }
      return a.title.localeCompare(b.title);
    });
}

/**
 * Filter for Featured Exam Carousel:
 * Supports EXACTLY TWO featured exam slots.
 * There can NEVER be more than 2 featured exams displayed.
 *
 * Rules:
 * - Filtered by `featured: true`
 * - Sorted by `createdAt` descending (newest first). NOT `updatedAt`.
 * - Exactly sliced to 2 slots (.slice(0, 2)).
 * - If more than two exams are marked featured, the two newest occupy the slots,
 *   and older featured exams are automatically replaced.
 * - If fewer than two exams are marked featured, displays available ones.
 */
export function getFeaturedExams(exams: ExamDefinition[] = staticExams): ExamDefinition[] {
  return [...exams]
    .filter((e) => e.published !== false && e.featured === true)
    .sort((a, b) => {
      const timeA = getExamCreatedAtTimestamp(a);
      const timeB = getExamCreatedAtTimestamp(b);
      if (timeB !== timeA) {
        return timeB - timeA; // Descending: newest createdAt first
      }
      return a.title.localeCompare(b.title);
    })
    .slice(0, 2); // Enforce exactly max 2 featured slots
}

/**
 * Retrieve an individual exam definition by ID from the central static registry.
 */
export function getExamById(id: string): ExamDefinition | undefined {
  return staticExams.find((e) => e.id === id);
}

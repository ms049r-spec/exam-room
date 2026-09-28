import { Question, QuestionType } from '../types/exam';

export interface ParsedQuestionItem {
  rawIndex: number;
  questionNumber?: number;
  questionText: string;
  options: string[];
  correctAnswer: number; // 0-based index or -1 if invalid
  answerRaw?: string;
  explanation: string;
  type: QuestionType;
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ParseBatchResult {
  totalDetected: number;
  validCount: number;
  invalidCount: number;
  items: ParsedQuestionItem[];
}

/**
 * Robust parser for Exam Room markdown/text question blocks.
 * Preserves verbatim text, options, answers, and explanations.
 */
export function parseQuestionsFromText(inputText: string): ParseBatchResult {
  if (!inputText || !inputText.trim()) {
    return { totalDetected: 0, validCount: 0, invalidCount: 0, items: [] };
  }

  // Normalize line breaks
  const normalized = inputText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Split questions on headings or question number patterns
  // Examples:
  // "## Question 1", "Question 1.", "Question 1:", "Q1.", "Q. 1"
  const questionHeaderRegex = /(?:^|\n)(?=##\s*Question\s+\d+|Question\s+\d+[\.:]?|Q(?:uestion)?\s*[\.:]?\s*\d+[\.:]?)/i;

  let rawBlocks = normalized.split(questionHeaderRegex).map((b) => b.trim()).filter(Boolean);

  // If regex split produced only 1 block or nothing, try splitting on double line-breaks with Question / Q
  if (rawBlocks.length <= 1) {
    const secondaryRegex = /(?:^|\n\n+)(?=(?:##|\*\*|#)?\s*(?:Question|Q\.?)\s*\d+)/i;
    const secondTry = normalized.split(secondaryRegex).map((b) => b.trim()).filter(Boolean);
    if (secondTry.length > rawBlocks.length) {
      rawBlocks = secondTry;
    }
  }

  const items: ParsedQuestionItem[] = [];

  rawBlocks.forEach((block, index) => {
    const parsed = parseSingleQuestionBlock(block, index);
    if (parsed) {
      items.push(parsed);
    }
  });

  const validCount = items.filter((q) => q.isValid).length;
  const invalidCount = items.length - validCount;

  return {
    totalDetected: items.length,
    validCount,
    invalidCount,
    items
  };
}

/**
 * Parses an individual block of text representing one question.
 */
function parseSingleQuestionBlock(block: string, rawIndex: number): ParsedQuestionItem | null {
  const lines = block.split('\n');
  if (lines.length === 0) return null;

  const errors: string[] = [];
  const warnings: string[] = [];

  let questionNumber: number | undefined = undefined;
  let questionText = '';
  const options: string[] = [];
  let answerRaw = '';
  let correctAnswer = -1;
  let explanation = '';

  // Extract question number from first line if present
  const firstLine = lines[0].trim();
  const numMatch = firstLine.match(/(?:Question|Q\.?)\s*(\d+)/i);
  if (numMatch) {
    questionNumber = parseInt(numMatch[1], 10);
  }

  // State machine to process lines
  type ParserState = 'HEADER' | 'QUESTION' | 'OPTIONS' | 'ANSWER' | 'EXPLANATION';
  let state: ParserState = 'HEADER';

  const questionLines: string[] = [];
  const explanationLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check for Answer line
    // e.g. "**Answer - A. Interfascicular cambium**", "Answer - A", "Answer: A", "Ans - B"
    const ansMatch = trimmed.match(/^(?:\*\*)?\s*(?:Answer|Ans|Correct\s*Option)\s*[-:]\s*(.*?)(?:\*\*)?$/i);
    if (ansMatch) {
      state = 'ANSWER';
      answerRaw = ansMatch[1].trim();
      continue;
    }

    // Check for Explanation line
    // e.g. "**Explanation -** Text...", "Explanation - Text...", "Explanation: ..."
    const expMatch = trimmed.match(/^(?:\*\*)?\s*Explanation\s*[-:]\s*(?:\*\*)?\s*(.*)$/i);
    if (expMatch) {
      state = 'EXPLANATION';
      if (expMatch[1]) {
        explanationLines.push(expMatch[1].trim());
      }
      continue;
    }

    // Check for Options header line: "**Options**" or "Options:"
    if (/^(?:\*\*)?\s*Options\s*:?\s*(?:\*\*)?$/i.test(trimmed)) {
      state = 'OPTIONS';
      continue;
    }

    // Check for option item line: "A. Text", "A) Text", "(A) Text", "1. Text"
    const optMatch = trimmed.match(/^([A-D]|[1-4])[\.\)]\s*(.*)$/i);
    if (optMatch && (state === 'OPTIONS' || state === 'QUESTION')) {
      state = 'OPTIONS';
      options.push(optMatch[2].trim());
      continue;
    }

    // Processing line according to current state
    if (state === 'HEADER') {
      // First line if it's "## Question X"
      if (/^#+\s*Question/i.test(trimmed) || /^(?:\*\*)?Question\s*\d+/i.test(trimmed)) {
        // Skip header line
        state = 'QUESTION';
        continue;
      } else {
        state = 'QUESTION';
        if (trimmed) questionLines.push(line);
      }
    } else if (state === 'QUESTION') {
      questionLines.push(line);
    } else if (state === 'OPTIONS') {
      // If continuation of previous option line
      if (options.length > 0 && trimmed && !optMatch) {
        options[options.length - 1] += ' ' + trimmed;
      }
    } else if (state === 'EXPLANATION') {
      explanationLines.push(line);
    }
  }

  questionText = questionLines.join('\n').trim();
  explanation = explanationLines.join('\n').trim();

  // Strip leading bolding or clean up question text
  questionText = questionText.replace(/^\*\*|\*\*$/g, '').trim();

  // Parse correct answer letter or number into 0-based index
  if (answerRaw) {
    const cleanAns = answerRaw.replace(/^\*\*|\*\*$/g, '').trim();
    // Look for initial letter: A, B, C, D or 1, 2, 3, 4
    const letterMatch = cleanAns.match(/^([A-D])/i);
    const digitMatch = cleanAns.match(/^([1-4])/);
    if (letterMatch) {
      const letter = letterMatch[1].toUpperCase();
      correctAnswer = letter.charCodeAt(0) - 'A'.charCodeAt(0);
    } else if (digitMatch) {
      correctAnswer = parseInt(digitMatch[1], 10) - 1;
    }
  }

  // Detect Question Type
  let detectedType: QuestionType = 'single-choice';
  const lowerQ = questionText.toLowerCase();
  if (
    lowerQ.includes('assertion') &&
    lowerQ.includes('reason') &&
    (lowerQ.includes('(a)') || lowerQ.includes('assertion (a)'))
  ) {
    detectedType = 'assertion-reason';
  } else if (lowerQ.includes('match') && lowerQ.includes('column')) {
    detectedType = 'match-following';
  }

  // Validate
  if (!questionText) {
    errors.push('Question text is missing.');
  }

  if (options.length < 2) {
    errors.push(`Found ${options.length} option(s); at least 2 options are required.`);
  }

  if (correctAnswer < 0 || correctAnswer >= (options.length || 4)) {
    errors.push(`Could not determine valid answer index from "${answerRaw || 'missing'}".`);
  }

  if (!explanation) {
    warnings.push('Explanation is missing.');
  }

  const isValid = errors.length === 0;

  return {
    rawIndex,
    questionNumber,
    questionText,
    options,
    correctAnswer: correctAnswer >= 0 ? correctAnswer : 0,
    answerRaw,
    explanation,
    type: detectedType,
    isValid,
    errors,
    warnings
  };
}

/**
 * Converts verified parsed items into canonical Question array
 */
export function convertParsedToQuestions(
  items: ParsedQuestionItem[],
  examSubject: string = 'Biology',
  examChapter: string = 'General'
): Question[] {
  return items.map((item, index) => {
    const qNum = item.questionNumber || index + 1;
    return {
      id: `q_${Date.now()}_${index + 1}`,
      type: item.type,
      question: item.questionText,
      options: item.options.length > 0 ? item.options : ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: item.correctAnswer,
      explanation: item.explanation || 'No explanation provided.',
      subject: examSubject,
      chapter: examChapter,
      topic: examChapter,
      difficulty: 'moderate',
      marks: { correct: 4, incorrect: -1, unattempted: 0 }
    };
  });
}

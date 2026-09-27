export interface AuraEvaluation {
  points: number;
  pointsDisplay: string;
  category: string;
}

/**
 * Calculates Aura Points and category based on the exam's final percentage and score.
 * 
 * Mark categories:
 * - 95–100%: +1000 Aura, "MAXIMUM AURA"
 * - 85–94%:  +750 Aura,  "HIGH AURA"
 * - 70–84%:  +500 Aura,  "SOLID AURA"
 * - 50–69%:  +250 Aura,  "AURA DETECTED"
 * - 30–49%:  +100 Aura,  "AURA STRUGGLING"
 * - 1–29%:   +25 Aura,   "BARELY ANY AURA"
 * - 0% or negative: -100 Aura, "AURA DEPLETED"
 */
export function calculateAuraPoints(percentage: number, score?: number): AuraEvaluation {
  // Negative scores, 0%, or unattempted (< 1%)
  if ((score !== undefined && score < 0) || percentage < 1) {
    return {
      points: -100,
      pointsDisplay: '-100 AURA',
      category: 'AURA DEPLETED'
    };
  }

  if (percentage >= 95) {
    return {
      points: 1000,
      pointsDisplay: '+1000 AURA',
      category: 'MAXIMUM AURA'
    };
  }

  if (percentage >= 85) {
    return {
      points: 750,
      pointsDisplay: '+750 AURA',
      category: 'HIGH AURA'
    };
  }

  if (percentage >= 70) {
    return {
      points: 500,
      pointsDisplay: '+500 AURA',
      category: 'SOLID AURA'
    };
  }

  if (percentage >= 50) {
    return {
      points: 250,
      pointsDisplay: '+250 AURA',
      category: 'AURA DETECTED'
    };
  }

  if (percentage >= 30) {
    return {
      points: 100,
      pointsDisplay: '+100 AURA',
      category: 'AURA STRUGGLING'
    };
  }

  // 1–29%
  return {
    points: 25,
    pointsDisplay: '+25 AURA',
    category: 'BARELY ANY AURA'
  };
}

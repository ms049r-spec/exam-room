import memeAcademicWeapon from '../assets/images/meme_academic_weapon_1790321875944.jpg';
import memeSolidStudy from '../assets/images/meme_solid_study_1790321886905.jpg';
import memeNeedsRevision from '../assets/images/meme_needs_revision_1790321898028.jpg';
import memeCatastrophic from '../assets/images/meme_catastrophic_1790321911256.jpg';

export interface ReactionItem {
  id: string;
  theme: string;
  title: string;
  caption: string;
  image?: string;
  tagline?: string;
  tone: 'celebratory' | 'positive' | 'neutral' | 'gentle-roast' | 'playful';
}

export interface ScoreBandReactions {
  band: string;
  minPercent: number;
  maxPercent: number;
  reactions: ReactionItem[];
}

export const BAND_REACTIONS: ScoreBandReactions[] = [
  {
    band: '95-100',
    minPercent: 95,
    maxPercent: 100,
    reactions: [
      {
        id: 'band-95-1',
        theme: 'Academic Weapon',
        title: 'At this point, the question paper needs to study you.',
        caption: 'The examiner has questions. You clearly have all the answers.',
        image: memeAcademicWeapon,
        tagline: 'Top Tier Mastery',
        tone: 'celebratory'
      },
      {
        id: 'band-95-2',
        theme: 'Academic Weapon',
        title: 'Bro came fully prepared.',
        caption: 'Synapses firing with surgical precision. Not a single neuron was wasted today.',
        image: memeAcademicWeapon,
        tagline: 'Unstoppable Execution',
        tone: 'celebratory'
      },
      {
        id: 'band-95-3',
        theme: 'Academic Weapon',
        title: 'The textbook salutes you.',
        caption: 'Even the edge-case exceptions couldn’t throw you off course.',
        image: memeAcademicWeapon,
        tagline: 'Flawless Form',
        tone: 'celebratory'
      }
    ]
  },
  {
    band: '85-94',
    minPercent: 85,
    maxPercent: 94.99,
    reactions: [
      {
        id: 'band-85-1',
        theme: 'Very Strong',
        title: 'Okay, someone actually studied.',
        caption: 'The neurons have reported for duty and delivered outstanding results.',
        image: memeSolidStudy,
        tagline: 'Distinction Caliber',
        tone: 'positive'
      },
      {
        id: 'band-85-2',
        theme: 'Very Strong',
        title: 'That went suspiciously well.',
        caption: 'High retention detected. The syllabus barely put up a fight.',
        image: memeSolidStudy,
        tagline: 'High Retention',
        tone: 'positive'
      },
      {
        id: 'band-85-3',
        theme: 'Very Strong',
        title: 'Almost illegal precision.',
        caption: 'Just a stray question or two slipped through your net.',
        image: memeSolidStudy,
        tagline: 'Precision Work',
        tone: 'positive'
      }
    ]
  },
  {
    band: '70-84',
    minPercent: 70,
    maxPercent: 84.99,
    reactions: [
      {
        id: 'band-70-1',
        theme: 'Solid',
        title: 'Not bad. The syllabus survived.',
        caption: 'You cooked. Just not the entire kitchen quite yet.',
        image: memeSolidStudy,
        tagline: 'Dependable Foundation',
        tone: 'positive'
      },
      {
        id: 'band-70-2',
        theme: 'Solid',
        title: 'Pretty solid. A few neurons took a coffee break.',
        caption: 'The fundamentals are locked in. Polish those edge cases and watch the numbers climb.',
        image: memeSolidStudy,
        tagline: 'Firm Grounding',
        tone: 'neutral'
      },
      {
        id: 'band-70-3',
        theme: 'Solid',
        title: 'Comfortably in control.',
        caption: 'Good instinct, clean execution, and clear room for that final jump to mastery.',
        image: memeSolidStudy,
        tagline: 'Clear Potential',
        tone: 'neutral'
      }
    ]
  },
  {
    band: '50-69',
    minPercent: 50,
    maxPercent: 69.99,
    reactions: [
      {
        id: 'band-50-1',
        theme: 'Needs Revision',
        title: 'The potential is there. The revision isn’t.',
        caption: 'Somewhere, the textbook is sighing softly, waiting for a second read.',
        image: memeNeedsRevision,
        tagline: 'Targeted Review Needed',
        tone: 'gentle-roast'
      },
      {
        id: 'band-50-2',
        theme: 'Needs Revision',
        title: 'A little more revision and this gets dangerous.',
        caption: 'You knew half the answers instantly; the other half were pure vibes.',
        image: memeNeedsRevision,
        tagline: 'Bridge the Gaps',
        tone: 'gentle-roast'
      },
      {
        id: 'band-50-3',
        theme: 'Needs Revision',
        title: 'Half-time analysis.',
        caption: 'Good instincts on the direct questions, but the tricky distractors collected toll.',
        image: memeNeedsRevision,
        tagline: 'Review Mistakes',
        tone: 'neutral'
      }
    ]
  },
  {
    band: '30-49',
    minPercent: 30,
    maxPercent: 49.99,
    reactions: [
      {
        id: 'band-30-1',
        theme: 'Academic Damage',
        title: 'The question paper won this round.',
        caption: 'That was less of an exam and more of a reconnaissance mission.',
        image: memeNeedsRevision,
        tagline: 'Strategic Retreat',
        tone: 'playful'
      },
      {
        id: 'band-30-2',
        theme: 'Academic Damage',
        title: 'Immediate friendship with the textbook recommended.',
        caption: 'We have identified several concept zones requiring an urgent peace treaty.',
        image: memeNeedsRevision,
        tagline: 'Time to Regroup',
        tone: 'playful'
      }
    ]
  },
  {
    band: '0-29',
    minPercent: 0,
    maxPercent: 29.99,
    reactions: [
      {
        id: 'band-0-1',
        theme: 'Catastrophic',
        title: 'The mitochondria would like to know what happened.',
        caption: 'The powerhouse of the cell is running low on explanations.',
        image: memeCatastrophic,
        tagline: 'Total Reset Required',
        tone: 'playful'
      },
      {
        id: 'band-0-2',
        theme: 'Catastrophic',
        title: 'Respectfully... what on earth was that?',
        caption: 'The syllabus has filed an official missing-person report.',
        image: memeCatastrophic,
        tagline: 'Uncharted Territory',
        tone: 'playful'
      },
      {
        id: 'band-0-3',
        theme: 'Catastrophic',
        title: 'At least the submit button worked.',
        caption: 'Every master begins with a disastrous first attempt. Nowhere to go but up.',
        image: memeCatastrophic,
        tagline: 'Blank Slate Ahead',
        tone: 'playful'
      }
    ]
  }
];

export const SPECIAL_REACTIONS = {
  perfectScore: {
    id: 'special-perfect',
    theme: 'Perfect Score',
    title: 'Perfect. Absolutely nothing to discuss.',
    caption: '100% precision. Clean sheet. The exam paper folded before question 10.',
    image: memeAcademicWeapon,
    tagline: 'Cent Percent Legend',
    tone: 'celebratory' as const
  },
  zeroCorrect: {
    id: 'special-zero',
    theme: 'Zero Correct',
    title: 'Zero casualties... on the question paper’s side.',
    caption: 'Statistically, random guessing would have scored higher. An impressively rare achievement.',
    image: memeCatastrophic,
    tagline: 'Statistical Miracle',
    tone: 'playful' as const
  },
  speedrun: {
    id: 'special-speedrun',
    theme: 'Speedrun Detected',
    title: 'Speedrun verified.',
    caption: 'Finished in record time with deadly accuracy. Did you write the questions?',
    image: memeAcademicWeapon,
    tagline: 'Lightning Precision',
    tone: 'celebratory' as const
  },
  allAttempted: {
    id: 'special-all-attempted',
    theme: 'No Question Left Behind',
    title: 'No question left behind.',
    caption: '100% attempt rate. You stared down every single problem without flinching.',
    image: memeSolidStudy,
    tagline: 'Zero Hesitation',
    tone: 'positive' as const
  }
};

export function getMemeForPerformance(
  percentage: number,
  correctCount: number,
  totalQuestions: number,
  timeTakenSeconds: number,
  totalTimeSeconds: number | null,
  isTimed: boolean
): ReactionItem {
  // Special checks
  if (percentage >= 100 && totalQuestions >= 5) {
    return SPECIAL_REACTIONS.perfectScore;
  }
  if (correctCount === 0 && totalQuestions >= 4) {
    return SPECIAL_REACTIONS.zeroCorrect;
  }
  if (
    isTimed &&
    totalTimeSeconds &&
    timeTakenSeconds < totalTimeSeconds * 0.25 &&
    percentage >= 85 &&
    totalQuestions >= 5
  ) {
    return SPECIAL_REACTIONS.speedrun;
  }

  // Band lookup
  const band = BAND_REACTIONS.find(
    (b) => percentage >= b.minPercent && percentage <= b.maxPercent
  ) || BAND_REACTIONS[BAND_REACTIONS.length - 1];

  const randomIndex = Math.floor(Math.random() * band.reactions.length);
  return band.reactions[randomIndex];
}

export function getRandomReactionFromBand(currentReactionId: string, percentage: number): ReactionItem {
  const band = BAND_REACTIONS.find(
    (b) => percentage >= b.minPercent && percentage <= b.maxPercent
  ) || BAND_REACTIONS[BAND_REACTIONS.length - 1];

  const pool = band.reactions.filter((r) => r.id !== currentReactionId);
  if (pool.length === 0) return band.reactions[0];
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

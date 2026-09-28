import { Question, ExamDefinition } from '../../types/exam';
import { excretorySystemQuestions } from './excretorySystem';
import { anatomyOfFloweringPlantsQuestions } from './anatomyOfFloweringPlants';

export const cellBiologyQuestions: Question[] = [
  {
    id: 'cell-001',
    type: 'single-choice',
    question: 'During which phase of the cell cycle does DNA replication and synthesis of histones occur?',
    options: ['G1 phase', 'S phase', 'G2 phase', 'M phase'],
    correctAnswer: 1,
    explanation: 'DNA replication and duplication of chromosomes as well as histone synthesis occur during the S (Synthesis) phase of interphase.',
    subject: 'Biology',
    chapter: 'Cell Cycle and Cell Division',
    topic: 'Interphase',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'cell-002',
    type: 'single-choice',
    question: 'Crossing over between homologous chromosomes occurs during which specific substage of Meiosis I?',
    options: ['Leptotene', 'Zygotene', 'Pachytene', 'Diplotene'],
    correctAnswer: 2,
    explanation: 'Crossing over is an enzyme-mediated process (catalyzed by recombinase) taking place between non-sister chromatids of homologous chromosomes during the Pachytene stage of Prophase I.',
    subject: 'Biology',
    chapter: 'Cell Cycle and Cell Division',
    topic: 'Meiosis',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'cell-003',
    type: 'assertion-reason',
    question: 'Given below are two statements: Assertion (A) and Reason (R). Choose the correct option.',
    assertion: 'Meiosis is referred to as reductional division.',
    reason: 'The chromosome number of the parent cell is reduced to half in the resulting daughter cells after Meiosis I.',
    options: [
      'Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).',
      'Both Assertion (A) and Reason (R) are true but Reason (R) is NOT the correct explanation of Assertion (A).',
      'Assertion (A) is true but Reason (R) is false.',
      'Assertion (A) is false but Reason (R) is true.'
    ],
    correctAnswer: 0,
    explanation: 'Meiosis is called reductional division because the diploid chromosome number (2n) is halved to haploid (n) following homologous chromosome separation in anaphase I.',
    subject: 'Biology',
    chapter: 'Cell Cycle and Cell Division',
    topic: 'Meiosis',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'cell-004',
    type: 'single-choice',
    question: 'Kinetochores serve as the site of attachment for:',
    options: [
      'Spindle fibres to centromeres of chromosomes',
      'Centrioles to nuclear membrane',
      'Chromatids to nucleolus',
      'Ribosomes to endoplasmic reticulum'
    ],
    correctAnswer: 0,
    explanation: 'Small disc-shaped structures at the surface of centromeres are called kinetochores, which serve as points of attachment for spindle fibers during mitosis and meiosis.',
    subject: 'Biology',
    chapter: 'Cell Cycle and Cell Division',
    topic: 'Mitosis',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'cell-005',
    type: 'match-following',
    question: 'Match the stages of Prophase I in Column I with their hallmarks in Column II:',
    columnA: [
      { key: 'A', text: 'Zygotene' },
      { key: 'B', text: 'Pachytene' },
      { key: 'C', text: 'Diplotene' },
      { key: 'D', text: 'Diakinesis' }
    ],
    columnB: [
      { key: 'i', text: 'Chiasmata formation and dissolution of synaptonemal complex' },
      { key: 'ii', text: 'Synapsis and formation of bivalents' },
      { key: 'iii', text: 'Terminalisation of chiasmata' },
      { key: 'iv', text: 'Crossing over between non-sister chromatids' }
    ],
    options: [
      'A-ii, B-iv, C-i, D-iii',
      'A-ii, B-i, C-iv, D-iii',
      'A-iv, B-ii, C-i, D-iii',
      'A-i, B-iv, C-ii, D-iii'
    ],
    correctAnswer: 0,
    explanation: 'Zygotene involves synapsis; Pachytene exhibits crossing over; Diplotene reveals chiasmata as synaptonemal complex dissolves; Diakinesis is marked by terminalisation of chiasmata.',
    subject: 'Biology',
    chapter: 'Cell Cycle and Cell Division',
    topic: 'Meiosis Prophase I',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  }
];

export const physicsKinematicsQuestions: Question[] = [
  {
    id: 'phys-001',
    type: 'single-choice',
    question: 'A particle moves along a straight line such that its displacement x at time t is given by x = 3t² - 6t + 4. What is the velocity of the particle when its acceleration is zero?',
    options: [
      '-6 m/s',
      '0 m/s',
      '6 m/s',
      'Acceleration is constant and never zero'
    ],
    correctAnswer: 3,
    explanation: 'Velocity v = dx/dt = 6t - 6. Acceleration a = dv/dt = 6 m/s². The acceleration is constant and equals 6 m/s² for all t, hence it is never zero.',
    subject: 'Physics',
    chapter: 'Motion in a Straight Line',
    topic: 'Kinematics',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'phys-002',
    type: 'single-choice',
    question: 'A ball is thrown vertically upwards with a velocity of 20 m/s from the top of a building 25 m high. Taking g = 10 m/s², the time taken by the ball to reach the ground is:',
    options: ['3 s', '4 s', '5 s', '6 s'],
    correctAnswer: 2,
    explanation: 'Taking upward direction as positive: y = y0 + ut - 1/2 gt² => 0 = 25 + 20t - 5t² => 5t² - 20t - 25 = 0 => t² - 4t - 5 = 0 => (t - 5)(t + 1) = 0. Since time cannot be negative, t = 5 seconds.',
    subject: 'Physics',
    chapter: 'Motion in a Straight Line',
    topic: 'Free Fall',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'phys-003',
    type: 'assertion-reason',
    question: 'Given below are two statements: Assertion (A) and Reason (R). Choose the correct option.',
    assertion: 'The area under the velocity-time graph gives the displacement of the particle.',
    reason: 'The slope of the velocity-time graph represents the instantaneous velocity.',
    options: [
      'Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).',
      'Both Assertion (A) and Reason (R) are true but Reason (R) is NOT the correct explanation of Assertion (A).',
      'Assertion (A) is true but Reason (R) is false.',
      'Assertion (A) is false but Reason (R) is true.'
    ],
    correctAnswer: 2,
    explanation: 'Assertion is true (integral of v dt = displacement). Reason is false because the slope of the velocity-time graph represents instantaneous acceleration, not velocity.',
    subject: 'Physics',
    chapter: 'Motion in a Straight Line',
    topic: 'Kinematics Graphs',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'phys-004',
    type: 'single-choice',
    question: 'If the displacement of a body is proportional to the square of time (x ∝ t²), then the body is moving with:',
    options: [
      'Uniform velocity',
      'Uniform acceleration',
      'Decreasing acceleration',
      'Increasing acceleration'
    ],
    correctAnswer: 1,
    explanation: 'If x = k t², then v = dx/dt = 2kt, and a = dv/dt = 2k (a constant non-zero value). Therefore, the body moves with uniform (constant) acceleration.',
    subject: 'Physics',
    chapter: 'Motion in a Straight Line',
    topic: 'Uniform Acceleration',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'phys-005',
    type: 'true-false-combo',
    question: 'Consider the following statements regarding scalar and vector quantities in one-dimensional kinematics:',
    statements: [
      'I. Distance traveled by a moving particle is always greater than or equal to the magnitude of displacement.',
      'II. Average speed can be zero even if average velocity is non-zero.',
      'III. A body can have zero instantaneous velocity and non-zero acceleration simultaneously.'
    ],
    options: [
      'Statements I and III are correct, while II is incorrect',
      'Statements I and II are correct, while III is incorrect',
      'Statements II and III are correct, while I is incorrect',
      'All statements I, II, and III are correct'
    ],
    correctAnswer: 0,
    explanation: 'Statements I and III are true (e.g. at the apex of vertical throw, v = 0 while a = -g). Statement II is false because distance is always >= displacement, so if average speed is zero, the body has remained stationary, making average velocity strictly zero.',
    subject: 'Physics',
    chapter: 'Motion in a Straight Line',
    topic: 'Kinematics Principles',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  }
];

export const chemistryBondingQuestions: Question[] = [
  {
    id: 'chem-001',
    type: 'single-choice',
    question: 'According to VSEPR theory, what is the geometry and shape of the ClF₃ molecule?',
    options: [
      'Trigonal planar',
      'T-shaped with trigonal bipyramidal electron geometry',
      'Tetrahedral',
      'Square planar'
    ],
    correctAnswer: 1,
    explanation: 'Chlorine has 7 valence electrons, sharing 3 with fluorines, leaving 2 lone pairs. The steric number is 3 + 2 = 5 (trigonal bipyramidal geometry). Lone pairs occupy equatorial positions, producing a bent T-shaped molecular structure.',
    subject: 'Chemistry',
    chapter: 'Chemical Bonding and Molecular Structure',
    topic: 'VSEPR Theory',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chem-002',
    type: 'single-choice',
    question: 'Which of the following diatomic molecules has a bond order of 3 and is diamagnetic?',
    options: ['O₂', 'N₂', 'B₂', 'C₂'],
    correctAnswer: 1,
    explanation: 'N₂ has 14 electrons. Its MO configuration has 10 bonding and 4 antibonding electrons. Bond order = (10 - 4)/2 = 3. All electrons are paired, making N₂ diamagnetic.',
    subject: 'Chemistry',
    chapter: 'Chemical Bonding and Molecular Structure',
    topic: 'Molecular Orbital Theory',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chem-003',
    type: 'single-choice',
    question: 'The hybridization of the central sulfur atom in SF₆ and its molecular geometry are respectively:',
    options: [
      'sp³d², Octahedral',
      'sp³d, Trigonal bipyramidal',
      'dsp², Square planar',
      'sp³, Tetrahedral'
    ],
    correctAnswer: 0,
    explanation: 'SF₆ has 6 bonding pairs and 0 lone pairs around sulfur (steric number = 6). Hence, the hybridization is sp³d² and the molecular geometry is octahedral with bond angles of 90° and 180°.',
    subject: 'Chemistry',
    chapter: 'Chemical Bonding and Molecular Structure',
    topic: 'Hybridization',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chem-004',
    type: 'assertion-reason',
    question: 'Given below are two statements: Assertion (A) and Reason (R). Choose the correct option.',
    assertion: 'The dipole moment of NH₃ is greater than that of NF₃.',
    reason: 'In NH₃, the orbital dipole due to the lone pair is in the same direction as the resultant dipole moment of the N-H bonds, whereas in NF₃ it opposes the resultant dipole of N-F bonds.',
    options: [
      'Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).',
      'Both Assertion (A) and Reason (R) are true but Reason (R) is NOT the correct explanation of Assertion (A).',
      'Assertion (A) is true but Reason (R) is false.',
      'Assertion (A) is false but Reason (R) is true.'
    ],
    correctAnswer: 0,
    explanation: 'In NH₃, electronegativity of N > H, so bond dipoles point toward N reinforcing the lone pair dipole. In NF₃, F is more electronegative than N, so bond dipoles point away from N and counteract the lone pair dipole. Therefore, NH₃ has a substantially higher dipole moment than NF₃.',
    subject: 'Chemistry',
    chapter: 'Chemical Bonding and Molecular Structure',
    topic: 'Dipole Moment',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chem-005',
    type: 'match-following',
    question: 'Match the molecules in Column I with their corresponding bond angles in Column II:',
    columnA: [
      { key: 'A', text: 'CH₄' },
      { key: 'B', text: 'NH₃' },
      { key: 'C', text: 'H₂O' },
      { key: 'D', text: 'BF₃' }
    ],
    columnB: [
      { key: 'i', text: '104.5°' },
      { key: 'ii', text: '107°' },
      { key: 'iii', text: '109.5°' },
      { key: 'iv', text: '120°' }
    ],
    options: [
      'A-iii, B-ii, C-i, D-iv',
      'A-iii, B-i, C-ii, D-iv',
      'A-iv, B-ii, C-i, D-iii',
      'A-ii, B-iii, C-i, D-iv'
    ],
    correctAnswer: 0,
    explanation: 'BF₃ is trigonal planar (120°); CH₄ is regular tetrahedron (109.5°); NH₃ with 1 lone pair is 107°; H₂O with 2 lone pairs suffers more repulsion, compressing to 104.5°.',
    subject: 'Chemistry',
    chapter: 'Chemical Bonding and Molecular Structure',
    topic: 'Molecular Geometry',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  }
];

export const allQuestions: Question[] = [
  ...excretorySystemQuestions,
  ...anatomyOfFloweringPlantsQuestions,
  ...cellBiologyQuestions,
  ...physicsKinematicsQuestions,
  ...chemistryBondingQuestions
];

export const examDefinitions: ExamDefinition[] = [
  {
    id: 'exam-excretory-34',
    title: 'Excretory Products and Their Elimination',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    description: 'Comprehensive 34-question paper covering nitrogenous waste modes, nephron histology, counter-current mechanism, RAAS regulation, and renal pathologies.',
    questionCount: 34,
    difficulty: 'Moderate',
    defaultDurationMinutes: 45,
    markingScheme: { correct: 4, incorrect: -1, unattempted: 0 },
    tag: 'NEET Standard',
    featured: true,
    createdAt: '2026-01-01T12:00:00.000Z',
    updatedAt: '2026-01-01T12:00:00.000Z',
    questions: excretorySystemQuestions
  },
  {
    id: 'exam-anatomy-plants-45',
    title: 'Anatomy of Flowering Plants',
    subject: 'Biology',
    chapter: 'Anatomy of Flowering Plants',
    description: 'Comprehensive 45-question paper covering meristematic tissues, simple & complex permanent tissues, vascular bundles, and organ anatomy.',
    questionCount: 45,
    difficulty: 'Moderate',
    defaultDurationMinutes: 45,
    markingScheme: { correct: 4, incorrect: -1, unattempted: 0 },
    tag: 'NEET Standard',
    featured: true,
    createdAt: '2026-01-02T10:00:00.000Z',
    updatedAt: '2026-01-02T10:00:00.000Z',
    questions: anatomyOfFloweringPlantsQuestions
  },
  {
    id: 'exam-cell-cycle-5',
    title: 'Cell Cycle and Cell Division',
    subject: 'Biology',
    chapter: 'Cell Cycle and Cell Division',
    description: 'Targeted assessment of interphase events, checkpoints, prophase I substages, and karyokinesis mechanisms.',
    questionCount: 5,
    difficulty: 'Moderate',
    defaultDurationMinutes: 10,
    markingScheme: { correct: 4, incorrect: -1, unattempted: 0 },
    tag: 'Quick Sprint',
    createdAt: '2026-01-01T09:00:00.000Z',
    updatedAt: '2026-01-01T09:00:00.000Z',
    questions: cellBiologyQuestions
  },
  {
    id: 'exam-physics-kinematics-5',
    title: 'Motion in a Straight Line',
    subject: 'Physics',
    chapter: 'Motion in a Straight Line',
    description: 'Calculus and graph-based one-dimensional kinematics evaluation covering velocity, constant acceleration, and vertical free-fall.',
    questionCount: 5,
    difficulty: 'Moderate',
    defaultDurationMinutes: 15,
    markingScheme: { correct: 4, incorrect: -1, unattempted: 0 },
    tag: 'Concept Drill',
    createdAt: '2026-01-01T08:00:00.000Z',
    updatedAt: '2026-01-01T08:00:00.000Z',
    questions: physicsKinematicsQuestions
  },
  {
    id: 'exam-chemistry-bonding-5',
    title: 'Chemical Bonding and Molecular Structure',
    subject: 'Chemistry',
    chapter: 'Chemical Bonding and Molecular Structure',
    description: 'Core evaluation of VSEPR geometry, hybridization states, molecular orbital paramagnetism, and molecular dipole vectors.',
    questionCount: 5,
    difficulty: 'Moderate',
    defaultDurationMinutes: 15,
    markingScheme: { correct: 4, incorrect: -1, unattempted: 0 },
    tag: 'High Yield',
    createdAt: '2026-01-01T07:00:00.000Z',
    updatedAt: '2026-01-01T07:00:00.000Z',
    questions: chemistryBondingQuestions
  }
];

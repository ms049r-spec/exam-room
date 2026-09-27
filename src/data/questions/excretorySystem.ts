import { Question } from '../../types/exam';

export const excretorySystemQuestions: Question[] = [
  {
    id: 'excr-001',
    type: 'single-choice',
    question: 'Which of the following nitrogenous wastes requires the minimum amount of water for its elimination from the animal body?',
    options: [
      'Ammonia',
      'Urea',
      'Uric acid',
      'Creatinine'
    ],
    correctAnswer: 2,
    explanation: 'Uric acid is the least toxic nitrogenous waste and is insoluble in water. It requires the minimum loss of water (excreted as a paste or pellet) compared to urea and ammonia, which is an adaptation for water conservation in terrestrial animals like reptiles, birds, land snails, and insects.',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Modes of Excretion',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-002',
    type: 'single-choice',
    question: 'The presence of which of the following epithelial linings in the Proximal Convoluted Tubule (PCT) increases the surface area for reabsorption?',
    options: [
      'Simple squamous epithelium',
      'Simple cuboidal brush border epithelium',
      'Ciliated columnar epithelium',
      'Non-keratinized stratified squamous epithelium'
    ],
    correctAnswer: 1,
    explanation: 'The Proximal Convoluted Tubule (PCT) is lined by simple cuboidal brush border epithelium. The microvilli forming the brush border vastly increase the surface area available for reabsorption of water, electrolytes, and essential nutrients.',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Nephron Structure',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-003',
    type: 'single-choice',
    question: 'In the human kidney, approximately how much glomerular filtrate is produced per day by both kidneys combined?',
    options: [
      '1.5 litres',
      '18 litres',
      '180 litres',
      '500 litres'
    ],
    correctAnswer: 2,
    explanation: 'Glomerular Filtration Rate (GFR) in a healthy adult is approximately 125 mL/min, which amounts to roughly 180 litres of filtrate per day. Out of this, nearly 99% is reabsorbed by the renal tubules, resulting in about 1.5 litres of urine excreted per day.',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Urine Formation',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-004',
    type: 'single-choice',
    question: 'Which of the following structures is absent or highly reduced in cortical nephrons as compared to juxtamedullary nephrons?',
    options: [
      'Bowman\'s capsule',
      'Proximal Convoluted Tubule (PCT)',
      'Vasa recta',
      'Glomerulus'
    ],
    correctAnswer: 2,
    explanation: 'In cortical nephrons (which comprise ~85% of total nephrons), the loop of Henle is short and extends only very little into the medulla, and the vasa recta is either absent or highly reduced. In juxtamedullary nephrons (~15%), the loop of Henle is long and dips deep into the medulla, accompanied by well-developed vasa recta.',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Nephron Structure',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-005',
    type: 'assertion-reason',
    question: 'Given below are two statements: one is labelled as Assertion (A) and the other is labelled as Reason (R). Choose the correct option.',
    assertion: 'The descending limb of Henle\'s loop is permeable to water but almost impermeable to electrolytes.',
    reason: 'As the filtrate moves down the descending limb of Henle\'s loop, it progressively becomes hypertonic to blood plasma.',
    options: [
      'Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).',
      'Both Assertion (A) and Reason (R) are true but Reason (R) is NOT the correct explanation of Assertion (A).',
      'Assertion (A) is true but Reason (R) is false.',
      'Assertion (A) is false but Reason (R) is true.'
    ],
    correctAnswer: 1,
    explanation: 'Both statements are true facts from NCERT. The descending limb is permeable to water and impermeable to electrolytes (Assertion is true). Because water exits into the hypertonic medullary interstitium, the filtrate concentrates and becomes hypertonic (Reason is true). However, Reason does not explain the physiological permeability property of the epithelial cells of the descending limb itself.',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Urine Concentration Mechanism',
    difficulty: 'hard',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-006',
    type: 'match-following',
    question: 'Match the excretory structures in Column I with the representative organisms in Column II and select the correct option:',
    columnA: [
      { key: 'A', text: 'Protonephridia (Flame cells)' },
      { key: 'B', text: 'Nephridia' },
      { key: 'C', text: 'Malpighian tubules' },
      { key: 'D', text: 'Antennal glands (Green glands)' }
    ],
    columnB: [
      { key: 'i', text: 'Prawn (Crustaceans)' },
      { key: 'ii', text: 'Planaria (Flatworms)' },
      { key: 'iii', text: 'Cockroach (Insects)' },
      { key: 'iv', text: 'Earthworm (Annelids)' }
    ],
    options: [
      'A-ii, B-iv, C-iii, D-i',
      'A-ii, B-iii, C-iv, D-i',
      'A-iv, B-ii, C-iii, D-i',
      'A-i, B-iv, C-iii, D-ii'
    ],
    correctAnswer: 0,
    explanation: 'Protonephridia/flame cells are excretory structures in Platyhelminthes (Planaria); Nephridia are tubular excretory structures of Earthworms and other annelids; Malpighian tubules are excretory structures of most insects including cockroaches; Antennal/Green glands perform excretory function in crustaceans like prawns.',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Excretory Organs in Animals',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-007',
    type: 'true-false-combo',
    question: 'Consider the following statements regarding the human urinary bladder and micturition:',
    statements: [
      'I. Micturition is a reflex action initiated by stretch receptors on the wall of the urinary bladder.',
      'II. The central nervous system passes motor messages to initiate the contraction of smooth muscles of the bladder and simultaneous relaxation of the urethral sphincter.',
      'III. An adult human excretes, on average, 25 to 30 grams of urea per day.',
      'IV. Glycosuria and Ketonuria in urine are indicative of diabetes insipidus.'
    ],
    options: [
      'Only statements I and II are correct',
      'Statements I, II, and III are correct, while IV is incorrect',
      'Statements I, III, and IV are correct, while II is incorrect',
      'All statements I, II, III, and IV are correct'
    ],
    correctAnswer: 1,
    explanation: 'Statements I, II, and III are correct facts from NCERT. Statement IV is incorrect because presence of glucose (Glycosuria) and ketone bodies (Ketonuria) in urine are indicative of Diabetes Mellitus, not Diabetes Insipidus (which is caused by deficiency of ADH).',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Micturition & Clinical Signs',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-008',
    type: 'single-choice',
    question: 'Which of the following hormone is released when there is an increase in blood flow to the atria of the heart, acting as a check on the Renin-Angiotensin mechanism?',
    options: [
      'Antidiuretic Hormone (ADH)',
      'Atrial Natriuretic Factor (ANF)',
      'Aldosterone',
      'Erythropoietin'
    ],
    correctAnswer: 1,
    explanation: 'An increase in blood flow to the atria of the heart stimulates the release of Atrial Natriuretic Factor (ANF). ANF causes vasodilation of blood vessels and increases excretion of sodium (natriuresis), thereby decreasing blood pressure. It acts as an antagonist and check on the renin-angiotensin-aldosterone mechanism.',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Regulation of Kidney Function',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-009',
    type: 'single-choice',
    question: 'The medullary interstitial gradient of osmolarity increases from the cortex to the inner medulla, reaching up to:',
    options: [
      '300 mOsmol L⁻¹',
      '600 mOsmol L⁻¹',
      '1200 mOsmol L⁻¹',
      '2000 mOsmol L⁻¹'
    ],
    correctAnswer: 2,
    explanation: 'The osmolarity increases progressively from about 300 mOsmol L⁻¹ in the renal cortex to about 1200 mOsmol L⁻¹ in the inner medulla. This gradient is mainly maintained by NaCl and urea through the counter-current mechanism.',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Urine Concentration Mechanism',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-010',
    type: 'assertion-reason',
    question: 'Given below are two statements: one is labelled as Assertion (A) and the other is labelled as Reason (R). Choose the correct option.',
    assertion: 'Angiotensin II is a powerful vasoconstrictor and increases glomerular blood pressure thereby increasing GFR.',
    reason: 'Angiotensin II also activates the adrenal cortex to release Aldosterone, which induces reabsorption of Na⁺ and water from the distal parts of the tubule.',
    options: [
      'Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).',
      'Both Assertion (A) and Reason (R) are true but Reason (R) is NOT the correct explanation of Assertion (A).',
      'Assertion (A) is true but Reason (R) is false.',
      'Assertion (A) is false but Reason (R) is true.'
    ],
    correctAnswer: 1,
    explanation: 'Both statements are true. Angiotensin II increases GFR directly because it is a potent vasoconstrictor that elevates glomerular hydrostatic pressure. It also activates the adrenal cortex to release aldosterone for Na⁺ and water reabsorption. While both statements are accurate functions of Angiotensin II, the release of aldosterone does not explain why Angiotensin II itself acts as a vasoconstrictor.',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Regulation of Kidney Function',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-011',
    type: 'single-choice',
    question: 'Which of the following substances are actively reabsorbed from the renal tubule into the peritubular capillaries?',
    options: [
      'Glucose, amino acids, and Na⁺',
      'Urea, water, and creatinine',
      'Nitrogenous wastes and water only',
      'H⁺ ions and K⁺ ions only'
    ],
    correctAnswer: 0,
    explanation: 'Substances like glucose, amino acids, and Na⁺ in the filtrate are reabsorbed actively, requiring energy (ATP), whereas nitrogenous wastes are absorbed by passive transport. Reabsorption of water also occurs passively in the initial segments of the nephron.',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Tubular Reabsorption',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-012',
    type: 'match-following',
    question: 'Match the parts of the nephron in Column I with their primary physiological roles in Column II:',
    columnA: [
      { key: 'A', text: 'Proximal Convoluted Tubule (PCT)' },
      { key: 'B', text: 'Ascending limb of Henle\'s loop' },
      { key: 'C', text: 'Distal Convoluted Tubule (DCT)' },
      { key: 'D', text: 'Collecting duct' }
    ],
    columnB: [
      { key: 'i', text: 'Conditional reabsorption of Na⁺ and water under hormonal control' },
      { key: 'ii', text: 'Reabsorption of 70-80% of electrolytes and water' },
      { key: 'iii', text: 'Impermeable to water, allows active/passive transport of NaCl' },
      { key: 'iv', text: 'Extends from cortex to medulla, allows passage of small amount of urea into interstitium' }
    ],
    options: [
      'A-ii, B-iii, C-i, D-iv',
      'A-ii, B-i, C-iii, D-iv',
      'A-iii, B-ii, C-i, D-iv',
      'A-i, B-iv, C-ii, D-iii'
    ],
    correctAnswer: 0,
    explanation: 'PCT reabsorbs nearly 70-80% of electrolytes and water; Ascending limb of Henle\'s loop is impermeable to water and transports NaCl; DCT carries out conditional reabsorption of Na⁺ and water; Collecting duct allows reabsorption of large amounts of water to concentrate urine and small amount of urea into medullary interstitium to maintain osmolarity.',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Nephron Physiology',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-013',
    type: 'single-choice',
    question: 'The Juxtaglomerular Apparatus (JGA) is a specialized cellular structure formed by modifications in which two parts?',
    options: [
      'Efferent arteriole and Proximal Convoluted Tubule',
      'Afferent arteriole and Distal Convoluted Tubule',
      'Bowman\'s capsule and Descending limb of Henle\'s loop',
      'Peritubular capillaries and Collecting duct'
    ],
    correctAnswer: 1,
    explanation: 'The Juxtaglomerular Apparatus (JGA) is formed by cellular modifications in the Distal Convoluted Tubule (macula densa) and the Afferent arteriole (juxtaglomerular cells) at the point where they come in direct contact with each other.',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Juxtaglomerular Apparatus',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-014',
    type: 'true-false-combo',
    question: 'Evaluate the following statements concerning dialysis and kidney transplantation in patients suffering from uremia:',
    statements: [
      'I. During hemodialysis, the dialysing fluid has the same composition as plasma except that it lacks nitrogenous wastes.',
      'II. Heparin is added to the blood before pumping it into the dialysing unit to prevent clotting.',
      'III. Anti-heparin is added to the cleared blood before restoring it to the patient\'s body through a vein.',
      'IV. Kidney transplantation involves replacing both damaged kidneys with a synthetic artificial prosthesis permanently.'
    ],
    options: [
      'Statements I and II only are correct',
      'Statements I, II, and III are correct, while IV is incorrect',
      'Statements II, III, and IV are correct, while I is incorrect',
      'All statements I, II, III, and IV are correct'
    ],
    correctAnswer: 1,
    explanation: 'Statements I, II, and III are completely correct descriptions of hemodialysis. Statement IV is incorrect: Kidney transplantation involves grafting a functional living donor kidney (preferably from a close relative to minimize graft rejection by the immune system), not a synthetic artificial prosthesis.',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Disorders & Dialysis',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-015',
    type: 'single-choice',
    question: 'What is the Net Filtration Pressure (NFP) responsible for glomerular filtration under normal physiological conditions?',
    options: [
      '~10 to 20 mm Hg',
      '~50 to 60 mm Hg',
      '~75 to 80 mm Hg',
      '~120 mm Hg'
    ],
    correctAnswer: 0,
    explanation: 'Net Filtration Pressure (NFP) = Glomerular Hydrostatic Pressure (GHP ~60 mm Hg) - [Blood Colloid Osmotic Pressure (BCOP ~32 mm Hg) + Capsular Hydrostatic Pressure (CHP ~18 mm Hg)] = 60 - (32 + 18) = 10 mm Hg (typically cited as 10 to 20 mm Hg in physiological textbooks).',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Glomerular Filtration',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-016',
    type: 'single-choice',
    question: 'Podocytes are specialized epithelial cells present in which specific layer of the filtration membrane?',
    options: [
      'Endothelium of glomerular blood vessels',
      'Basement membrane separating the two layers',
      'Visceral layer of Bowman\'s capsule',
      'Parietal layer of Bowman\'s capsule'
    ],
    correctAnswer: 2,
    explanation: 'Podocytes are specialized epithelial cells arranged in an intricate manner in the visceral layer of Bowman\'s capsule. Their foot-like processes leave minute spaces called filtration slits or slit pores through which blood is filtered so finely that almost all constituents of plasma except proteins pass into the lumen.',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Nephron Structure',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-017',
    type: 'assertion-reason',
    question: 'Given below are two statements: one is labelled as Assertion (A) and the other is labelled as Reason (R). Choose the correct option.',
    assertion: 'Deficiency of Antidiuretic Hormone (ADH) leads to excessive loss of dilute water in urine, a condition known as Diabetes Insipidus.',
    reason: 'ADH facilitates water reabsorption from the distal convoluted tubule and collecting duct by incorporating aquaporin channels.',
    options: [
      'Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).',
      'Both Assertion (A) and Reason (R) are true but Reason (R) is NOT the correct explanation of Assertion (A).',
      'Assertion (A) is true but Reason (R) is false.',
      'Assertion (A) is false but Reason (R) is true.'
    ],
    correctAnswer: 0,
    explanation: 'ADH (vasopressin) acts on DCT and collecting ducts to increase water permeability (via aquaporins) and reabsorption, preventing diuresis. In its deficiency, water cannot be reabsorbed in adequate amounts, producing large volumes of dilute urine (polyuria) accompanied by intense thirst (polydipsia) characteristic of Diabetes Insipidus. Thus, Reason correctly explains the Assertion.',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Regulation of Kidney Function',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-018',
    type: 'single-choice',
    question: 'Which of the following other human organs eliminate excretory wastes in addition to kidneys?',
    options: [
      'Lungs eliminate CO₂ and water',
      'Liver eliminates bile pigments like bilirubin and biliverdin',
      'Sweat glands eliminate NaCl, small amounts of urea, and lactic acid',
      'All of the above'
    ],
    correctAnswer: 3,
    explanation: 'Our lungs remove large amounts of CO₂ (approx. 200 mL/minute) and significant quantities of water every day; liver excretes bile-containing substances like bilirubin, biliverdin, cholesterol, degraded steroid hormones, vitamins and drugs; skin sweat glands excrete NaCl, urea, and lactic acid; sebaceous glands eliminate sterols, hydrocarbons, and waxes.',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Role of Other Organs in Excretion',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-019',
    type: 'single-choice',
    question: 'A fall in Glomerular Filtration Rate (GFR) activates the JG cells of the juxtaglomerular apparatus to release:',
    options: [
      'Renin',
      'Rennin',
      'Angiotensinogen',
      'Aldosterone'
    ],
    correctAnswer: 0,
    explanation: 'A fall in GFR / glomerular blood flow / blood pressure activates the juxtaglomerular cells to release Renin (an enzyme). Note the spelling: "Renin" with a single \'n\' is the hormone/enzyme of the kidney, whereas "Rennin" with a double \'n\' is the milk-coagulating enzyme found in the gastric juice of infants.',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Regulation of Kidney Function',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-020',
    type: 'single-choice',
    question: 'Renal calculi refer to which pathological condition of the human excretory system?',
    options: [
      'Inflammation of the glomeruli of kidney',
      'Accumulation of urea in blood due to kidney failure',
      'Insoluble mass of crystallized salts like oxalates formed within the kidney',
      'Bacterial infection of the urinary bladder'
    ],
    correctAnswer: 2,
    explanation: 'Renal calculi (kidney stones) are insoluble masses of crystallized salts (principally calcium oxalates, phosphates, or urates) formed within the kidney. Inflammation of glomeruli is called glomerulonephritis, and accumulation of urea in blood is uremia.',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Disorders of the Excretory System',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-021',
    type: 'single-choice',
    question: 'During urine formation, tubular secretion helps in the maintenance of ionic and acid-base balance of body fluids by secreting which ions into the filtrate?',
    options: [
      'Na⁺ and Cl⁻ ions',
      'H⁺, K⁺, and NH₃ (ammonia)',
      'Glucose and amino acids',
      'HCO₃⁻ and water only'
    ],
    correctAnswer: 1,
    explanation: 'During tubular secretion, tubular epithelial cells secrete substances like H⁺, K⁺, and ammonia into the filtrate, while reabsorbing HCO₃⁻. This active process is essential for maintaining the pH and ionic balance of body fluids.',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Urine Formation',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-022',
    type: 'true-false-combo',
    question: 'Read the following statements regarding the counter-current multiplier and exchanger mechanisms in the mammalian kidney:',
    statements: [
      'I. The flow of filtrate in the two limbs of Henle\'s loop is in opposite directions and thus forms a counter current.',
      'II. The flow of blood through the two limbs of vasa recta also shows a counter current pattern.',
      'III. NaCl is transported by the ascending limb of Henle\'s loop which is exchanged with the descending limb of vasa recta.',
      'IV. Urea enters the thin segment of the ascending limb of Henle\'s loop and is transported back to the interstitium by the collecting tubule.'
    ],
    options: [
      'Statements I and II only are correct',
      'Statements I, II, and III only are correct',
      'Statements I, III, and IV only are correct',
      'All statements I, II, III, and IV are correct'
    ],
    correctAnswer: 3,
    explanation: 'All four statements are accurate facts from the NCERT mechanism of concentration of filtrate. The counter current flow in Henle\'s loop and vasa recta, the exchange of NaCl between Henle\'s loop and vasa recta, and the recycling of urea from the collecting duct into the thin ascending limb maintain the medullary osmotic gradient.',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Urine Concentration Mechanism',
    difficulty: 'hard',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-023',
    type: 'single-choice',
    question: 'Sebaceous glands eliminate certain substances through sebum. Which of the following substances are eliminated through sebum?',
    options: [
      'Sterols, hydrocarbons, and waxes',
      'Urea, uric acid, and creatinine',
      'Bilirubin, biliverdin, and bile salts',
      'Glucose, amino acids, and lactic acid'
    ],
    correctAnswer: 0,
    explanation: 'Sebaceous glands eliminate certain substances like sterols, hydrocarbons, and waxes through sebum. This secretion also provides a protective oily covering for the skin.',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Role of Other Organs in Excretion',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-024',
    type: 'assertion-reason',
    question: 'Given below are two statements: one is labelled as Assertion (A) and the other is labelled as Reason (R). Choose the correct option.',
    assertion: 'Human kidneys can produce urine nearly four times more concentrated than the initial filtrate formed.',
    reason: 'The proximity between Henle\'s loop and vasa recta, as well as the counter-current pattern of flow in them, helps in maintaining an increasing osmolarity towards the inner medullary interstitium.',
    options: [
      'Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).',
      'Both Assertion (A) and Reason (R) are true but Reason (R) is NOT the correct explanation of Assertion (A).',
      'Assertion (A) is true but Reason (R) is false.',
      'Assertion (A) is false but Reason (R) is true.'
    ],
    correctAnswer: 0,
    explanation: 'Mammals can concentrate urine up to 1200 mOsmol L⁻¹, which is four times the osmolarity of blood plasma/initial filtrate (300 mOsmol L⁻¹). This high concentration is achieved specifically by the hypertonic medullary gradient created and maintained by the counter-current multiplier system of Henle\'s loop and counter-current exchanger of vasa recta.',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Urine Concentration Mechanism',
    difficulty: 'hard',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-025',
    type: 'single-choice',
    question: 'What is the characteristic pH of normal human urine under standard physiological conditions?',
    options: [
      'Strongly alkaline (~8.4)',
      'Slightly acidic (~6.0)',
      'Neutral (exactly 7.0)',
      'Extremely acidic (~2.5)'
    ],
    correctAnswer: 1,
    explanation: 'Normal human urine is slightly acidic with an average pH of 6.0 (range 4.5 to 8.0 depending on diet and metabolic status).',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Micturition & Urine Properties',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-026',
    type: 'match-following',
    question: 'Match the clinical disorders of the excretory system in Column I with their descriptions in Column II:',
    columnA: [
      { key: 'A', text: 'Uremia' },
      { key: 'B', text: 'Glomerulonephritis' },
      { key: 'C', text: 'Ketonuria' },
      { key: 'D', text: 'Renal Calculi' }
    ],
    columnB: [
      { key: 'i', text: 'Inflammation of glomeruli of kidney' },
      { key: 'ii', text: 'Accumulation of urea in blood due to kidney malfunction' },
      { key: 'iii', text: 'Crystallized stone formed of calcium oxalate salts in kidney' },
      { key: 'iv', text: 'Presence of ketone bodies in urine' }
    ],
    options: [
      'A-ii, B-i, C-iv, D-iii',
      'A-ii, B-iii, C-iv, D-i',
      'A-i, B-ii, C-iv, D-iii',
      'A-iv, B-i, C-ii, D-iii'
    ],
    correctAnswer: 0,
    explanation: 'Uremia is accumulation of urea in blood; Glomerulonephritis is inflammation of renal glomeruli; Ketonuria is presence of ketone bodies in urine (seen in diabetes); Renal calculi are crystallized stones of oxalates.',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Disorders of the Excretory System',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-027',
    type: 'single-choice',
    question: 'Which of the following animals is uricotelic in nature?',
    options: [
      'Bony fishes and tadpole of frog',
      'Mammals and terrestrial amphibians',
      'Reptiles, birds, land snails, and insects',
      'Aquatic insects and aquatic amphibians'
    ],
    correctAnswer: 2,
    explanation: 'Reptiles, birds, land snails, and insects excrete nitrogenous wastes as uric acid in the form of pellet or paste with minimum water loss, and are called uricotelic animals. Bony fishes are ammonotelic; mammals and adult amphibians are ureotelic.',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Modes of Excretion',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-028',
    type: 'single-choice',
    question: 'The Columns of Bertini in the human kidney represent extensions of:',
    options: [
      'Renal pelvis into calyces',
      'Cortex of kidney projecting between medullary pyramids',
      'Medullary pyramids projecting into renal cortex',
      'Fibrous capsule into ureter'
    ],
    correctAnswer: 1,
    explanation: 'Inside the kidney, the cortex extends in between the medullary pyramids as renal columns called Columns of Bertini (or Bertin\'s columns).',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Kidney Anatomy',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-029',
    type: 'single-choice',
    question: 'Which part of the nephron plays a critical role in the conditional reabsorption of HCO₃⁻ and selective secretion of hydrogen and potassium ions to maintain blood pH?',
    options: [
      'Descending limb of Henle\'s loop',
      'Ascending thin limb of Henle\'s loop',
      'Distal Convoluted Tubule (DCT)',
      'Bowman\'s capsule'
    ],
    correctAnswer: 2,
    explanation: 'DCT is capable of conditional reabsorption of HCO₃⁻ and selective secretion of hydrogen and potassium ions and NH₃ to maintain the pH and sodium-potassium balance in blood.',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Nephron Physiology',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-030',
    type: 'true-false-combo',
    question: 'Consider the following statements regarding the glomerular filtration barrier:',
    statements: [
      'I. Blood is filtered through three layers: the endothelium of glomerular blood vessels, the epithelium of Bowman\'s capsule, and a basement membrane between them.',
      'II. The epithelial cells of Bowman\'s capsule called podocytes leave intricate spaces called filtration slits or slit pores.',
      'III. Blood is filtered so finely through these membranes that all the constituents of the plasma except the proteins pass into the lumen of Bowman\'s capsule.',
      'IV. Glomerular filtration is an active transport process consuming abundant metabolic energy (ATP).'
    ],
    options: [
      'Statements I, II, and III are correct, while IV is incorrect',
      'Statements I and II only are correct',
      'Statements II, III, and IV are correct, while I is incorrect',
      'All statements I, II, III, and IV are correct'
    ],
    correctAnswer: 0,
    explanation: 'Statements I, II, and III accurately describe ultrafiltration in Bowman\'s capsule. Statement IV is incorrect because glomerular filtration is a passive process driven entirely by hydrostatic blood pressure differences generated by heart pumping and arteriole resistance, not active transport requiring cellular ATP expenditure.',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Glomerular Filtration',
    difficulty: 'hard',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-031',
    type: 'single-choice',
    question: 'In an artificial kidney (hemodialyzer), cellophane membrane works as a:',
    options: [
      'Completely impermeable membrane',
      'Selectively permeable (semi-permeable) membrane',
      'Freely permeable membrane to all molecules including proteins',
      'Active ionic transport pump'
    ],
    correctAnswer: 1,
    explanation: 'The dialyzing unit contains a coiled cellophane tube surrounded by a fluid (dialyzing fluid) having the same composition as plasma except the nitrogenous wastes. The porous cellophane membrane allows the passage of molecules based on concentration gradient (semi-permeable), enabling nitrogenous wastes to diffuse out freely.',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Disorders & Dialysis',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-032',
    type: 'single-choice',
    question: 'Which of the following blood vessels carries the least amount of urea in the human body under normal physiological conditions?',
    options: [
      'Hepatic vein',
      'Hepatic artery',
      'Renal vein',
      'Renal artery'
    ],
    correctAnswer: 2,
    explanation: 'The renal vein carries blood that has just undergone filtration and excretion of urea by the kidneys, hence it contains the lowest concentration of urea in the body. Conversely, the hepatic vein has the highest concentration of urea because urea is synthesized in the liver via the ornithine (urea) cycle.',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Circulation & Excretory Dynamics',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-033',
    type: 'assertion-reason',
    question: 'Given below are two statements: one is labelled as Assertion (A) and the other is labelled as Reason (R). Choose the correct option.',
    assertion: 'Terrestrial adaptation necessitated the production of lesser toxic nitrogenous wastes like urea and uric acid for conservation of water.',
    reason: 'Ammonia is readily soluble in water and is excreted by simple diffusion across body surfaces or gill surfaces, requiring large volumes of water.',
    options: [
      'Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).',
      'Both Assertion (A) and Reason (R) are true but Reason (R) is NOT the correct explanation of Assertion (A).',
      'Assertion (A) is true but Reason (R) is false.',
      'Assertion (A) is false but Reason (R) is true.'
    ],
    correctAnswer: 0,
    explanation: 'Ammonia requires large quantities of water for excretion due to its high toxicity and high solubility. Because terrestrial animals have limited access to continuous water, they adapted to convert toxic ammonia into less toxic forms like urea or insoluble uric acid, conserving vital body water.',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Modes of Excretion',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'excr-034',
    type: 'single-choice',
    question: 'A Malpighian body (Renal corpuscle) consists of:',
    options: [
      'Glomerulus along with Bowman\'s capsule',
      'Proximal Convoluted Tubule and Distal Convoluted Tubule',
      'Loop of Henle and Collecting duct',
      'Afferent and efferent arterioles only'
    ],
    correctAnswer: 0,
    explanation: 'Glomerulus along with Bowman\'s capsule is collectively called the Malpighian body or renal corpuscle. It represents the filtration unit of each nephron.',
    subject: 'Biology',
    chapter: 'Excretory Products and Their Elimination',
    topic: 'Nephron Structure',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  }
];

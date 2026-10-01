import { Question } from '../../types/exam';

export const chemicalEquilibriumQuestions: Question[] = [
  {
    id: 'chemeq-001',
    type: 'single-choice',
    question: 'For a reversible reaction at equilibrium, which statement is necessarily correct?',
    options: [
      'The concentrations of reactants and products are equal.',
      'The forward and reverse reactions have stopped.',
      'The rates of the forward and reverse reactions are equal.',
      'The forward reaction is faster because products are continuously formed.'
    ],
    correctAnswer: 2,
    explanation: 'Chemical equilibrium is dynamic. The forward and reverse reactions continue, but their rates become equal. Concentrations remain constant, but they need not be equal.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Dynamic Nature of Equilibrium',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-002',
    type: 'single-choice',
    question: 'A reversible reaction can establish equilibrium only when the reacting system is:',
    options: [
      'Open to the surroundings',
      'Closed with respect to the reacting species',
      'Continuously supplied with reactants',
      'Maintained at zero pressure'
    ],
    correctAnswer: 1,
    explanation: 'Equilibrium requires the forward and reverse processes to occur without continuous loss or addition of reacting species. Hence equilibrium is established in a closed system.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Closed System Requirement',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-003',
    type: 'single-choice',
    question: 'At equilibrium, which quantity necessarily remains constant with time?',
    options: [
      'Concentration of every species must be equal',
      'Rate of the forward reaction only',
      'Macroscopic properties of the system',
      'Amount of products must be greater than reactants'
    ],
    correctAnswer: 2,
    explanation: 'At equilibrium, macroscopic properties such as concentration, pressure and colour remain constant with time. Reactant and product concentrations need not be equal.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Constancy of Macroscopic Properties',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-004',
    type: 'single-choice',
    question: 'For the general reaction\n\naA + bB ⇌ cC + dD\n\nwhich expression correctly represents Kc?',
    options: [
      '[A]ᵃ[B]ᵇ / [C]ᶜ[D]ᵈ',
      '[C]ᶜ[D]ᵈ / [A]ᵃ[B]ᵇ',
      '([C] + [D]) / ([A] + [B])',
      '[C][D] / [A][B]'
    ],
    correctAnswer: 1,
    explanation: 'For a reaction at equilibrium, the equilibrium constant in terms of concentration is written as the concentration of products divided by the concentration of reactants, with each concentration raised to its stoichiometric coefficient.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Law of Mass Action and Kc Expression',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-005',
    type: 'single-choice',
    question: 'In the equilibrium\n\nCaCO₃(s) ⇌ CaO(s) + CO₂(g)\n\nwhich species are omitted from Kc?',
    options: [
      'CaCO₃ only',
      'CaO only',
      'CaCO₃ and CaO',
      'CO₂ only'
    ],
    correctAnswer: 2,
    explanation: 'Pure solids have constant activity and are omitted from the equilibrium expression. Therefore only gaseous CO₂ appears in the expression.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Heterogeneous Equilibrium and Pure Solids',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-006',
    type: 'single-choice',
    question: 'Which statement about pure solids and pure liquids in an equilibrium expression is correct?',
    options: [
      'Their concentrations must always be included.',
      'Their activities are treated as constant and they are omitted.',
      'They are included only when their amount is small.',
      'They change the value of K whenever their amount changes.'
    ],
    correctAnswer: 1,
    explanation: 'The activity of a pure solid or pure liquid is effectively constant under the usual equilibrium treatment, so they are omitted from the equilibrium expression.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Activity of Pure Solids and Liquids',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-007',
    type: 'single-choice',
    question: 'For a gaseous equilibrium, the relationship between Kₚ and K𝑐 is:',
    options: [
      'Kₚ = K𝑐(RT)⁻Δn',
      'Kₚ = K𝑐(RT)Δn',
      'Kₚ = K𝑐 + RT',
      'Kₚ = K𝑐/RT for every reaction'
    ],
    correctAnswer: 1,
    explanation: 'For gaseous equilibria:\n\nKₚ = K𝑐(RT)Δn\n\nwhere Δn is the difference between gaseous moles of products and gaseous moles of reactants.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Relationship Between Kp and Kc',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-008',
    type: 'single-choice',
    question: 'For a gaseous equilibrium, when Δn = 0, which statement is correct?',
    options: [
      'Kₚ = K𝑐',
      'Kₚ = K𝑐RT',
      'Kₚ = K𝑐/RT',
      'Kₚ always becomes 1'
    ],
    correctAnswer: 0,
    explanation: 'When Δn = 0:\n\nKₚ = K𝑐(RT)⁰ = K𝑐\n\nThus Kₚ and K𝑐 are equal when the change in gaseous moles is zero.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Condition for Kp = Kc',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-009',
    type: 'single-choice',
    question: 'For which equilibrium is Kₚ equal to K𝑐 at a given temperature?',
    options: [
      'N₂(g) + 3H₂(g) ⇌ 2NH₃(g)',
      'N₂O₄(g) ⇌ 2NO₂(g)',
      'H₂(g) + I₂(g) ⇌ 2HI(g)',
      'PCl₅(g) ⇌ PCl₃(g) + Cl₂(g)'
    ],
    correctAnswer: 2,
    explanation: 'For H₂ + I₂ ⇌ 2HI:\n\nΔn = 2 − 2 = 0\n\nTherefore Kₚ = K𝑐.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Reactions with Δn = 0',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-010',
    type: 'single-choice',
    question: 'For the equilibrium\n\nN₂O₄(g) ⇌ 2NO₂(g)\n\nwhich statement about Δn is correct?',
    options: [
      'Δn = −1',
      'Δn = 0',
      'Δn = +1',
      'Δn = +2'
    ],
    correctAnswer: 2,
    explanation: 'There is 1 mole of gaseous reactant and 2 moles of gaseous product.\n\nΔn = 2 − 1 = +1.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Calculation of Δn',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-011',
    type: 'single-choice',
    question: 'Which statement correctly describes the significance of a large equilibrium constant?',
    options: [
      'The reaction reaches equilibrium very rapidly.',
      'Products are favoured at equilibrium.',
      'The forward reaction has a very low activation energy.',
      'The reaction necessarily goes to completion.'
    ],
    correctAnswer: 1,
    explanation: 'A large K indicates that products are favoured at equilibrium. It does not tell us how fast the reaction reaches equilibrium or whether the reaction goes completely to products.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Significance of the Magnitude of K',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-012',
    type: 'single-choice',
    question: 'Which statement about the magnitude of K is correct?',
    options: [
      'K determines the rate of the reaction.',
      'K indicates the extent to which products are favoured at equilibrium.',
      'K changes whenever concentration changes.',
      'K is always greater than one.'
    ],
    correctAnswer: 1,
    explanation: 'The equilibrium constant indicates the extent of reaction at equilibrium. It does not measure reaction rate.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Meaning of Equilibrium Constant K',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-013',
    type: 'single-choice',
    question: 'For a reaction at a particular instant, Qc < Kc. The system will:',
    options: [
      'Move in the reverse direction',
      'Move in the forward direction',
      'Remain permanently unchanged',
      'Change the value of Kc until Qc becomes equal to Kc'
    ],
    correctAnswer: 1,
    explanation: 'When Qc < Kc, the system has relatively more reactant and less product than required at equilibrium. The net reaction proceeds forward until Qc = Kc.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Direction of Reaction when Qc < Kc',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-014',
    type: 'single-choice',
    question: 'For a reaction at a particular instant, Qc > Kc. Which statement is correct?',
    options: [
      'The reaction proceeds forward.',
      'The reaction proceeds backward.',
      'Kc decreases until it equals Qc.',
      'The system is necessarily at equilibrium.'
    ],
    correctAnswer: 1,
    explanation: 'When Qc > Kc, there is relatively more product than required at equilibrium. The reaction proceeds in the reverse direction until Qc becomes equal to Kc.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Direction of Reaction when Qc > Kc',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-015',
    type: 'single-choice',
    question: 'Which statement correctly distinguishes Qc from Kc?',
    options: [
      'Qc is calculated only at equilibrium, whereas Kc is calculated before equilibrium.',
      'Qc and Kc are always numerically different.',
      'Qc can be calculated at any instant, whereas Kc represents the equilibrium condition at a given temperature.',
      'Qc changes with temperature but Kc does not.'
    ],
    correctAnswer: 2,
    explanation: 'The reaction quotient Q can be calculated for the composition at any instant. K is the corresponding equilibrium value at a specified temperature.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Distinction Between Qc and Kc',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-016',
    type: 'single-choice',
    question: 'At equilibrium, the relationship between Qc and Kc is:',
    options: [
      'Qc < Kc',
      'Qc > Kc',
      'Qc = Kc',
      'Qc = 1 in every reaction'
    ],
    correctAnswer: 2,
    explanation: 'At equilibrium, the reaction quotient has reached its equilibrium value:\n\nQc = Kc.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Equilibrium Condition: Qc = Kc',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-017',
    type: 'single-choice',
    question: 'If a reversible reaction is written in the reverse direction, the new equilibrium constant is:',
    options: [
      'K',
      '−K',
      '1/K',
      'K²'
    ],
    correctAnswer: 2,
    explanation: 'Reversing the reaction reverses the equilibrium expression. Therefore the new equilibrium constant is the reciprocal of the original K.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Reversing a Reaction and K',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-018',
    type: 'single-choice',
    question: 'If all stoichiometric coefficients of a reaction are multiplied by n, the new equilibrium constant becomes:',
    options: [
      'K/n',
      'nK',
      'Kⁿ',
      'K + n'
    ],
    correctAnswer: 2,
    explanation: 'When a chemical equation is multiplied by n, every exponent in the equilibrium expression is multiplied by n. Therefore K\' = Kⁿ.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Multiplying Coefficients by n and K',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-019',
    type: 'single-choice',
    question: 'When two or more chemical equations are added to obtain an overall reaction, their equilibrium constants are:',
    options: [
      'Added',
      'Subtracted',
      'Multiplied',
      'Averaged'
    ],
    correctAnswer: 2,
    explanation: 'When reactions are added, their equilibrium expressions multiply. Therefore the overall equilibrium constant is the product of the individual equilibrium constants.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Adding Reactions and Multiplying K',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-020',
    type: 'single-choice',
    question: 'A reactant is added to a system already at equilibrium at constant temperature. Which statement is correct?',
    options: [
      'K immediately increases.',
      'Q changes and the system shifts toward products.',
      'K immediately decreases.',
      'The system remains at equilibrium because temperature is unchanged.'
    ],
    correctAnswer: 1,
    explanation: 'Adding a reactant changes the composition and therefore changes Q. The system responds by consuming some of the added reactant, shifting toward products. K remains unchanged because temperature is unchanged.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Effect of Adding Reactant',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-021',
    type: 'single-choice',
    question: 'A product is removed continuously from a system at equilibrium. The equilibrium tends to:',
    options: [
      'Shift toward reactants',
      'Shift toward products',
      'Remain unchanged because K is constant',
      'Stop the forward reaction'
    ],
    correctAnswer: 1,
    explanation: 'Removing a product disturbs equilibrium. The system responds by producing more product, so the equilibrium shifts in the forward direction.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Effect of Removing Product',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-022',
    type: 'single-choice',
    question: 'For the equilibrium\n\nA(g) ⇌ 2B(g)\n\nwhich change favours B?',
    options: [
      'Increasing pressure',
      'Decreasing pressure',
      'Adding an inert gas at constant volume',
      'Increasing the concentration of A is the only possible way'
    ],
    correctAnswer: 1,
    explanation: 'The product side contains more gaseous moles. Decreasing pressure favours the side with more gaseous moles, so equilibrium shifts toward B.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Pressure Effect on Gaseous Equilibrium',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-023',
    type: 'single-choice',
    question: 'For the equilibrium\n\nN₂(g) + 3H₂(g) ⇌ 2NH₃(g)\n\nincreasing pressure at constant temperature favours:',
    options: [
      'N₂ and H₂',
      'NH₃',
      'Neither side',
      'Both sides equally'
    ],
    correctAnswer: 1,
    explanation: 'The reactant side contains 4 gaseous moles while the product side contains 2. Increasing pressure favours the side with fewer gaseous moles, so NH₃ is favoured.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Haber Process Pressure Shift',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-024',
    type: 'single-choice',
    question: 'For the equilibrium\n\nH₂(g) + I₂(g) ⇌ 2HI(g)\n\nchanging pressure at constant temperature does not shift the equilibrium because:',
    options: [
      'Kp changes with pressure.',
      'Both sides contain the same number of gaseous moles.',
      'HI is always favoured.',
      'The reaction is irreversible.'
    ],
    correctAnswer: 1,
    explanation: 'There are 2 gaseous moles on each side. Therefore changing pressure does not favour either side.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Equilibrium with Equal Moles of Gas',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-025',
    type: 'single-choice',
    question: 'For a gaseous equilibrium, increasing pressure at constant temperature can change the equilibrium position when:',
    options: [
      'The number of gaseous moles differs between the two sides.',
      'Kp is greater than one.',
      'The reaction is exothermic.',
      'A catalyst is present.'
    ],
    correctAnswer: 0,
    explanation: 'Pressure affects equilibrium position when the total number of gaseous moles differs between the reactant and product sides.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Criteria for Pressure Sensitivity',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-026',
    type: 'single-choice',
    question: 'An inert gas is added to a gaseous equilibrium at constant volume. What happens to the equilibrium position?',
    options: [
      'It shifts toward more gaseous moles.',
      'It shifts toward fewer gaseous moles.',
      'It does not shift.',
      'It always shifts toward products.'
    ],
    correctAnswer: 2,
    explanation: 'At constant volume, addition of an inert gas does not change the partial pressures or concentrations of the reacting species. Therefore Q remains unchanged and there is no shift.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Inert Gas Addition at Constant Volume',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-027',
    type: 'single-choice',
    question: 'An inert gas is added to a gaseous equilibrium at constant pressure. Which statement is correct?',
    options: [
      'The volume decreases and equilibrium is unaffected.',
      'The volume increases and the partial pressures of reacting gases decrease.',
      'Kp immediately decreases.',
      'The inert gas always favours products.'
    ],
    correctAnswer: 1,
    explanation: 'At constant pressure, adding an inert gas increases the total volume. The partial pressures of the reacting gases decrease, and the equilibrium may shift depending on the difference in gaseous moles.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Inert Gas Addition at Constant Pressure',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-028',
    type: 'single-choice',
    question: 'For an exothermic forward reaction:\n\nA + B ⇌ C + heat\n\nincreasing temperature causes equilibrium to:',
    options: [
      'Shift toward C and increase K.',
      'Shift toward A + B and decrease K.',
      'Remain unchanged and keep K constant.',
      'Shift toward C but decrease K.'
    ],
    correctAnswer: 1,
    explanation: 'Heat behaves as a product in an exothermic reaction. Increasing temperature favours the reverse direction. For an exothermic reaction, increasing temperature also decreases K.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Temperature Effect on Exothermic Reactions',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-029',
    type: 'single-choice',
    question: 'For an endothermic forward reaction:\n\nA + B + heat ⇌ C\n\ndecreasing temperature causes equilibrium to:',
    options: [
      'Shift toward C.',
      'Shift toward reactants.',
      'Increase K.',
      'Have no effect because K is constant.'
    ],
    correctAnswer: 1,
    explanation: 'Heat behaves as a reactant in an endothermic reaction. Decreasing temperature favours the direction that produces heat, i.e. the reverse direction toward reactants.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Temperature Effect on Endothermic Reactions',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-030',
    type: 'single-choice',
    question: 'Which change can alter the value of an equilibrium constant?',
    options: [
      'Changing concentration at constant temperature',
      'Changing pressure at constant temperature',
      'Adding a catalyst',
      'Changing temperature'
    ],
    correctAnswer: 3,
    explanation: 'For a given reaction, the equilibrium constant changes with temperature. Concentration, pressure and catalysts can affect equilibrium position or rate but do not change K at constant temperature.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Factors Affecting K',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-031',
    type: 'assertion-reason',
    question: 'Given below are two statements: Assertion (A) and Reason (R). Choose the correct option.',
    assertion: 'A catalyst does not change the equilibrium constant.',
    reason: 'A catalyst affects the rates of both the forward and reverse reactions.',
    options: [
      'Both A and R are true, and R correctly explains A.',
      'Both A and R are true, but R does not correctly explain A.',
      'A is true, but R is false.',
      'A is false, but R is true.'
    ],
    correctAnswer: 0,
    explanation: 'A catalyst lowers the activation barrier for both directions. Thus both forward and reverse reactions become faster, while the equilibrium position and K remain unchanged.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Catalyst and Equilibrium',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-032',
    type: 'assertion-reason',
    question: 'Given below are two statements: Assertion (A) and Reason (R). Choose the correct option.',
    assertion: 'Increasing temperature can change the equilibrium constant.',
    reason: 'The equilibrium constant is independent of temperature.',
    options: [
      'Both A and R are true, and R correctly explains A.',
      'Both A and R are true, but R does not correctly explain A.',
      'A is true, but R is false.',
      'A is false, but R is true.'
    ],
    correctAnswer: 2,
    explanation: 'The assertion is true because K depends on temperature. The reason is false because K is not independent of temperature.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Temperature Dependence of K',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-033',
    type: 'assertion-reason',
    question: 'Given below are two statements: Assertion (A) and Reason (R). Choose the correct option.',
    assertion: 'Increasing pressure does not always shift a gaseous equilibrium.',
    reason: 'If the total number of gaseous moles is the same on both sides, pressure does not favour either side.',
    options: [
      'Both A and R are true, and R correctly explains A.',
      'Both A and R are true, but R does not correctly explain A.',
      'A is true, but R is false.',
      'A is false, but R is true.'
    ],
    correctAnswer: 0,
    explanation: 'When the number of gaseous moles is equal on both sides, changing pressure does not favour either side. Therefore the reason correctly explains the assertion.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Pressure Invariance with Equal Moles',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-034',
    type: 'assertion-reason',
    question: 'Given below are two statements: Assertion (A) and Reason (R). Choose the correct option.',
    assertion: 'Addition of an inert gas at constant volume does not shift a gaseous equilibrium.',
    reason: 'The partial pressures of the reacting gases remain unchanged.',
    options: [
      'Both A and R are true, and R correctly explains A.',
      'Both A and R are true, but R does not correctly explain A.',
      'A is true, but R is false.',
      'A is false, but R is true.'
    ],
    correctAnswer: 0,
    explanation: 'At constant volume, the partial pressures of the reacting gases do not change when an inert gas is added. Hence Q remains unchanged and equilibrium does not shift.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Inert Gas Constant Volume Mechanism',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-035',
    type: 'true-false-combo',
    question: 'Which statements are correct for a system at equilibrium?',
    statements: [
      'I. Forward and reverse reaction rates are equal.',
      'II. Reactant and product concentrations must be equal.',
      'III. Macroscopic properties remain constant.'
    ],
    options: [
      'I only',
      'II only',
      'I and III only',
      'I, II and III'
    ],
    correctAnswer: 2,
    explanation: 'Forward and reverse rates are equal and macroscopic properties remain constant. However, reactant and product concentrations need not be equal.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Equilibrium Conditions Evaluation',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-036',
    type: 'true-false-combo',
    question: 'Which statements about the equilibrium constant are correct?',
    statements: [
      'I. It changes with temperature.',
      'II. It changes when a catalyst is added.',
      'III. It is independent of initial concentrations at a fixed temperature.'
    ],
    options: [
      'I only',
      'I and III only',
      'II and III only',
      'I, II and III'
    ],
    correctAnswer: 1,
    explanation: 'K changes with temperature. A catalyst does not change K. At a fixed temperature, K has a definite value independent of the initial concentrations.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Properties of Equilibrium Constant',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-037',
    type: 'true-false-combo',
    question: 'Consider:\n\nCaCO₃(s) ⇌ CaO(s) + CO₂(g)\n\nWhich statements are correct?',
    statements: [
      'I. CaCO₃ is omitted from the equilibrium expression.',
      'II. CaO is omitted from the equilibrium expression.',
      'III. CO₂ appears in the equilibrium expression.',
      'IV. Increasing pressure favours CaCO₃.'
    ],
    options: [
      'I and II only',
      'I, II and III only',
      'II, III and IV only',
      'I, II, III and IV'
    ],
    correctAnswer: 3,
    explanation: 'The pure solids are omitted from the equilibrium expression and gaseous CO₂ is included. Increasing pressure favours the side with fewer gaseous moles, which is the side containing CaCO₃.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Heterogeneous Decomposition of CaCO3',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-038',
    type: 'true-false-combo',
    question: 'Consider:\n\nN₂(g) + 3H₂(g) ⇌ 2NH₃(g)\n\nWhich statements are correct?',
    statements: [
      'I. Increasing pressure favours NH₃.',
      'II. Decreasing pressure favours N₂ and H₂.',
      'III. Increasing pressure changes Kp at constant temperature.'
    ],
    options: [
      'I only',
      'I and II only',
      'II and III only',
      'I, II and III'
    ],
    correctAnswer: 1,
    explanation: 'The product side has fewer gaseous moles, so increasing pressure favours NH₃ and decreasing pressure favours the reactant side. Kp does not change with pressure at constant temperature.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Pressure Effects on Haber Equilibrium',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-039',
    type: 'true-false-combo',
    question: 'Which statements correctly describe Q and K?',
    statements: [
      'I. Q < K indicates a forward shift.',
      'II. Q > K indicates a backward shift.',
      'III. Q = K indicates equilibrium.',
      'IV. Changing concentration at constant temperature changes K.'
    ],
    options: [
      'I and II only',
      'I, II and III only',
      'II, III and IV only',
      'I, II, III and IV'
    ],
    correctAnswer: 1,
    explanation: 'Q < K indicates a forward tendency, Q > K indicates a reverse tendency, and Q = K at equilibrium. Changing concentration changes Q, not K, when temperature is constant.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Reaction Quotient and Shift Direction',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-040',
    type: 'true-false-combo',
    question: 'For the equilibrium\n\nAB(g) ⇌ A(g) + B(g)\n\nwhich statements are correct?',
    statements: [
      'I. Increasing pressure favours AB.',
      'II. Decreasing pressure favours A + B.',
      'III. Increasing pressure increases the degree of dissociation.',
      'IV. The product side contains more gaseous moles.'
    ],
    options: [
      'I and II only',
      'I, II and IV only',
      'II and III only',
      'I, II, III and IV'
    ],
    correctAnswer: 1,
    explanation: 'The reaction produces more gaseous moles on the right. Increasing pressure favours AB, while decreasing pressure favours A + B. Therefore pressure increase decreases dissociation.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Dissociation and Pressure Response',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-041',
    type: 'true-false-combo',
    question: 'For a gaseous equilibrium, which statements are correct?',
    statements: [
      'I. Kp depends on temperature.',
      'II. Kp is unaffected by a change in pressure at constant temperature.',
      'III. Kp and Kc are equal whenever Δn = 0.',
      'IV. Kp always equals Kc.'
    ],
    options: [
      'I and II only',
      'I, II and III only',
      'II and IV only',
      'I, II, III and IV'
    ],
    correctAnswer: 1,
    explanation: 'Kp depends on temperature and remains unchanged when pressure changes at constant temperature. Kp = Kc when Δn = 0, but they are not always equal.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Kp Characteristics and Relationships',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-042',
    type: 'true-false-combo',
    question: 'Which statements about a catalyst are correct?',
    statements: [
      'I. It increases the rate of the forward reaction.',
      'II. It increases the rate of the reverse reaction.',
      'III. It changes the equilibrium constant.',
      'IV. It allows equilibrium to be reached faster.'
    ],
    options: [
      'I and II only',
      'I, II and IV only',
      'II and III only',
      'I, II, III and IV'
    ],
    correctAnswer: 1,
    explanation: 'A catalyst affects both forward and reverse reaction rates and allows equilibrium to be reached faster. It does not change K or the equilibrium position.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Catalyst Impact on Rates vs K',
    difficulty: 'moderate',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-043',
    type: 'single-choice',
    question: 'Which statement about homogeneous and heterogeneous equilibrium is correct?',
    options: [
      'Homogeneous equilibrium contains species in different phases.',
      'Heterogeneous equilibrium contains species in the same phase only.',
      'Homogeneous equilibrium has all reacting species in the same phase.',
      'The distinction depends on the magnitude of K.'
    ],
    correctAnswer: 2,
    explanation: 'In a homogeneous equilibrium, all species are present in the same phase. In a heterogeneous equilibrium, species occur in different phases.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Homogeneous vs Heterogeneous Equilibrium',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-044',
    type: 'single-choice',
    question: 'For the equilibrium\n\nAB(g) ⇌ A(g) + B(g)\n\nwhich statement about degree of dissociation is correct?',
    options: [
      'Increasing pressure favours dissociation because more gas is formed.',
      'Increasing pressure favours the undissociated species.',
      'Pressure has no effect on dissociation.',
      'Increasing pressure changes Kp at constant temperature.'
    ],
    correctAnswer: 1,
    explanation: 'Dissociation increases the number of gaseous moles. Increasing pressure therefore favours the side with fewer gaseous moles, namely undissociated AB. Kp remains unchanged at constant temperature.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Degree of Dissociation and Pressure',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  },
  {
    id: 'chemeq-045',
    type: 'single-choice',
    question: 'Which statement correctly summarizes the effects of concentration, pressure, temperature and catalyst on equilibrium?',
    options: [
      'Concentration, pressure and catalyst change K; temperature changes only position.',
      'Concentration and pressure can change equilibrium position, temperature can change both position and K, while a catalyst changes only the rate.',
      'Pressure and temperature change position, while concentration changes K.',
      'A catalyst changes both equilibrium position and K.'
    ],
    correctAnswer: 1,
    explanation: 'At constant temperature, concentration and pressure can change the equilibrium position without changing K. Temperature can change the equilibrium position and the value of K. A catalyst changes the rate of reaching equilibrium but does not change K or the equilibrium position.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    topic: 'Comprehensive Equilibrium Principles',
    difficulty: 'easy',
    marks: { correct: 4, incorrect: -1, unattempted: 0 }
  }
];

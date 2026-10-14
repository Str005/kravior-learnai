import { BKTParameters, LearnerMastery } from '../types';

export const DEFAULT_BKT_PARAMS: BKTParameters = {
  pL0: 0.20, // Initial prior mastery
  pT: 0.22,  // Transition / learning rate
  pG: 0.20,  // Guess probability (standard 4-choice MCQ = 0.25, slightly lower for mixed)
  pS: 0.12,  // Slip probability (knows the concept but made arithmetic/reading slip)
};

/**
 * Updates topic mastery using Standard Bayesian Knowledge Tracing (Corbett & Anderson).
 * Computes posterior probability given observation (correct/incorrect) and adds transition.
 */
export function updateBKT(
  currentPL: number,
  isCorrect: boolean,
  params: BKTParameters = DEFAULT_BKT_PARAMS
): { newPL: number; delta: number } {
  const { pT, pG, pS } = params;

  let pLObs: number;

  if (isCorrect) {
    const numerator = currentPL * (1 - pS);
    const denominator = currentPL * (1 - pS) + (1 - currentPL) * pG;
    pLObs = denominator > 0 ? numerator / denominator : currentPL;
  } else {
    const numerator = currentPL * pS;
    const denominator = currentPL * pS + (1 - currentPL) * (1 - pG);
    pLObs = denominator > 0 ? numerator / denominator : currentPL;
  }

  // Knowledge transition step
  const newPL = pLObs + (1 - pLObs) * pT;
  const clampedPL = Math.min(0.999, Math.max(0.01, newPL));
  const delta = clampedPL - currentPL;

  return { newPL: Number(clampedPL.toFixed(3)), delta: Number(delta.toFixed(3)) };
}

/**
 * Computes Ebbinghaus Forgetting Curve memory retention: R(t) = e^(-t / S)
 * @param daysElapsed Days since last study interaction
 * @param reviewCount Number of prior successful repetitions (increases stability S)
 */
export function calculateRetention(daysElapsed: number, reviewCount: number = 1): number {
  const stability = 3.5 * Math.pow(1.8, Math.min(5, reviewCount));
  const retention = Math.exp(-daysElapsed / stability);
  return Number(Math.max(0.15, Math.min(1.0, retention)).toFixed(2));
}

/**
 * Categorizes mastery score into clear pedagogical mastery bands
 */
export function getMasteryLevel(pL: number): {
  label: string;
  colorClass: string;
  badgeBg: string;
  status: 'novice' | 'developing' | 'competent' | 'mastered';
} {
  if (pL >= 0.85) {
    return {
      label: 'Mastered',
      colorClass: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
      status: 'mastered',
    };
  }
  if (pL >= 0.65) {
    return {
      label: 'Competent',
      colorClass: 'text-blue-400',
      badgeBg: 'bg-blue-500/15 border-blue-500/30 text-blue-300',
      status: 'competent',
    };
  }
  if (pL >= 0.40) {
    return {
      label: 'Developing',
      colorClass: 'text-amber-400',
      badgeBg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
      status: 'developing',
    };
  }
  return {
    label: 'Novice (Needs Practice)',
    colorClass: 'text-rose-400',
    badgeBg: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
    status: 'novice',
  };
}

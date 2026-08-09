import { BlackjackHand } from './hand';
import { Card, getCardValue } from './card';

export type RecommendedAction = 'HIT' | 'STAND' | 'DOUBLE' | 'SPLIT' | 'SURRENDER';

export interface HandAnalysis {
  playerScore: number;
  isSoft: boolean;
  dealerUpcardValue: number;
  recommendedAction: RecommendedAction;
  actualAction: RecommendedAction;
  isOptimal: boolean;
  explanation: string;
}

export function getRecommendedAction(
  hand: BlackjackHand,
  dealerUpcard: Card,
  canSplit: boolean = false,
  canDouble: boolean = false,
  canSurrender: boolean = false
): RecommendedAction {
  const pEval = hand.evaluate();
  const dVal = getCardValue(dealerUpcard.rank);

  // Check Pairs first if split is possible
  if (canSplit && hand.cards.length === 2 && hand.cards[0].rank === hand.cards[1].rank) {
    const pairRank = hand.cards[0].rank;

    if (pairRank === 'A' || pairRank === '8') return 'SPLIT';
    if (pairRank === '9') {
      if ([7, 10, 11].includes(dVal)) return 'STAND';
      return 'SPLIT';
    }
    if (pairRank === '7') {
      if (dVal <= 7) return 'SPLIT';
      return 'HIT';
    }
    if (pairRank === '6') {
      if (dVal >= 3 && dVal <= 6) return 'SPLIT';
      return 'HIT';
    }
    if (pairRank === '5') {
      if (dVal <= 9 && canDouble) return 'DOUBLE';
      return 'HIT';
    }
    if (pairRank === '4') {
      if ([5, 6].includes(dVal)) return 'SPLIT';
      return 'HIT';
    }
    if (['2', '3'].includes(pairRank)) {
      if (dVal <= 7) return 'SPLIT';
      return 'HIT';
    }
  }

  // Soft hands (Ace count > 0)
  if (pEval.isSoft && hand.cards.length === 2) {
    const nonAceValue = pEval.score - 11;
    if (nonAceValue >= 9) return 'STAND'; // A,9 or A,10 -> 20, 21
    if (nonAceValue === 8) { // A,8 -> 19
      if (dVal === 6 && canDouble) return 'DOUBLE';
      return 'STAND';
    }
    if (nonAceValue === 7) { // A,7 -> 18
      if (dVal <= 6 && canDouble) return 'DOUBLE';
      if ([2, 7, 8].includes(dVal)) return 'STAND';
      return 'HIT';
    }
    if (nonAceValue === 6) { // A,6 -> 17
      if (dVal >= 3 && dVal <= 6 && canDouble) return 'DOUBLE';
      return 'HIT';
    }
    if (nonAceValue === 4 || nonAceValue === 5) { // A,4 or A,5
      if (dVal >= 4 && dVal <= 6 && canDouble) return 'DOUBLE';
      return 'HIT';
    }
    if (nonAceValue === 2 || nonAceValue === 3) { // A,2 or A,3
      if ([5, 6].includes(dVal) && canDouble) return 'DOUBLE';
      return 'HIT';
    }
  }

  // Hard hands
  const score = pEval.score;

  if (score >= 17) return 'STAND';
  if (score === 16) {
    if (canSurrender && [9, 10, 11].includes(dVal)) return 'SURRENDER';
    if (dVal <= 6) return 'STAND';
    return 'HIT';
  }
  if (score === 15) {
    if (canSurrender && dVal === 10) return 'SURRENDER';
    if (dVal <= 6) return 'STAND';
    return 'HIT';
  }
  if (score === 13 || score === 14) {
    if (dVal <= 6) return 'STAND';
    return 'HIT';
  }
  if (score === 12) {
    if (dVal >= 4 && dVal <= 6) return 'STAND';
    return 'HIT';
  }
  if (score === 11) {
    if (canDouble) return 'DOUBLE';
    return 'HIT';
  }
  if (score === 10) {
    if (dVal <= 9 && canDouble) return 'DOUBLE';
    return 'HIT';
  }
  if (score === 9) {
    if (dVal >= 3 && dVal <= 6 && canDouble) return 'DOUBLE';
    return 'HIT';
  }

  return 'HIT'; // 8 or lower
}

export function analyzeDecision(
  hand: BlackjackHand,
  dealerUpcard: Card,
  actualAction: RecommendedAction,
  canSplit: boolean = false,
  canDouble: boolean = false,
  canSurrender: boolean = false
): HandAnalysis {
  const recommended = getRecommendedAction(hand, dealerUpcard, canSplit, canDouble, canSurrender);
  const pEval = hand.evaluate();
  const dVal = getCardValue(dealerUpcard.rank);
  const isOptimal = recommended === actualAction;

  let explanation = '';
  if (isOptimal) {
    explanation = `Excellente décision ! Statistiquement, ${recommended} est l'action optimale avec un total de ${pEval.score} contre un ${dVal} du croupier.`;
  } else {
    explanation = `Vous aviez ${pEval.score}${pEval.isSoft ? ' (Soft)' : ''} face à la carte visible ${dVal} du croupier. Votre décision : ${actualAction}. La stratégie de base recommande : ${recommended}. Statistiquement, ${recommended} offre une meilleure espérance de gain dans cette situation.`;
  }

  return {
    playerScore: pEval.score,
    isSoft: pEval.isSoft,
    dealerUpcardValue: dVal,
    recommendedAction: recommended,
    actualAction,
    isOptimal,
    explanation,
  };
}

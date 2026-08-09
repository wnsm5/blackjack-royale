import { BlackjackHand } from './hand';
import { Card } from './card';

export interface GameRules {
  numDecks: number;
  dealerHitsSoft17: boolean; // false = Dealer stands on Soft 17 (As + 6 = 17 -> STAND)
  blackjackPayoutRatio: number; // 1.5 (3:2)
  insurancePayoutRatio: number; // 2.0 (2:1)
  allowSurrender: boolean;
  allowDoubleAfterSplit: boolean;
  maxSplitHands: number; // 4
  evenMoneyAllowed: boolean;
}

export const DEFAULT_RULES: GameRules = {
  numDecks: 6,
  dealerHitsSoft17: false, // Rule #9: Croupier reste sur Soft 17 (As + 6 = 17 -> STAND)
  blackjackPayoutRatio: 1.5,
  insurancePayoutRatio: 2.0,
  allowSurrender: true,
  allowDoubleAfterSplit: true,
  maxSplitHands: 4,
  evenMoneyAllowed: true,
};

/**
 * Returns true if the dealer MUST hit, false if dealer MUST stand.
 */
export function shouldDealerHit(dealerCards: Card[], rules: GameRules = DEFAULT_RULES): boolean {
  const dummyHand = new BlackjackHand('dealer', 0, dealerCards);
  const { score, isSoft } = dummyHand.evaluate();

  if (score < 17) {
    return true;
  }
  if (score > 17) {
    return false;
  }
  // score === 17
  if (isSoft && rules.dealerHitsSoft17) {
    return true;
  }
  // Soft 17 and dealerHitsSoft17 is false -> STAND
  return false;
}

export function calculateHandOutcome(
  playerHand: BlackjackHand,
  dealerHand: BlackjackHand
): { result: 'WIN' | 'LOSS' | 'PUSH' | 'BLACKJACK' | 'SURRENDER'; payout: number } {
  if (playerHand.status === 'SURRENDER') {
    const refund = Math.floor(playerHand.bet * 0.5);
    return { result: 'SURRENDER', payout: refund };
  }

  const pEval = playerHand.evaluate();
  const dEval = dealerHand.evaluate();

  if (pEval.isBust) {
    return { result: 'LOSS', payout: 0 };
  }

  if (pEval.isBlackjack) {
    if (dEval.isBlackjack) {
      return { result: 'PUSH', payout: playerHand.bet };
    }
    // 3:2 payout -> bet + 1.5 * bet
    const payout = Math.floor(playerHand.bet + playerHand.bet * DEFAULT_RULES.blackjackPayoutRatio);
    return { result: 'BLACKJACK', payout };
  }

  if (dEval.isBlackjack) {
    return { result: 'LOSS', payout: 0 };
  }

  if (dEval.isBust) {
    return { result: 'WIN', payout: playerHand.bet * 2 };
  }

  if (pEval.score > dEval.score) {
    return { result: 'WIN', payout: playerHand.bet * 2 };
  } else if (pEval.score < dEval.score) {
    return { result: 'LOSS', payout: 0 };
  } else {
    return { result: 'PUSH', payout: playerHand.bet };
  }
}

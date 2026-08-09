import { describe, it, expect } from 'vitest';
import { shouldDealerHit, calculateHandOutcome, DEFAULT_RULES } from '../src/blackjack/rules';
import { BlackjackHand } from '../src/blackjack/hand';

describe('Rules & Dealer Logic Module', () => {
  it('dealer should hit on 16 or less and stand on 17 or more', () => {
    const hand16 = [
      { id: '1', suit: 'spades', rank: '10', faceUp: true },
      { id: '2', suit: 'hearts', rank: '6', faceUp: true },
    ] as any;
    expect(shouldDealerHit(hand16, DEFAULT_RULES)).toBe(true);

    const hand18 = [
      { id: '1', suit: 'spades', rank: '10', faceUp: true },
      { id: '2', suit: 'hearts', rank: '8', faceUp: true },
    ] as any;
    expect(shouldDealerHit(hand18, DEFAULT_RULES)).toBe(false);
  });

  it('dealer MUST stand on Soft 17 (Ace + 6) per rule #9', () => {
    const soft17 = [
      { id: '1', suit: 'spades', rank: 'A', faceUp: true },
      { id: '2', suit: 'hearts', rank: '6', faceUp: true },
    ] as any;
    expect(shouldDealerHit(soft17, DEFAULT_RULES)).toBe(false);
  });

  it('should calculate 3:2 payout for natural blackjack', () => {
    const playerBJ = new BlackjackHand('1', 100, [
      { id: '1', suit: 'spades', rank: 'A', faceUp: true },
      { id: '2', suit: 'hearts', rank: 'K', faceUp: true },
    ]);
    const dealerHand = new BlackjackHand('dealer', 0, [
      { id: '3', suit: 'diamonds', rank: '10', faceUp: true },
      { id: '4', suit: 'clubs', rank: '7', faceUp: true },
    ]);

    const outcome = calculateHandOutcome(playerBJ, dealerHand);
    expect(outcome.result).toBe('BLACKJACK');
    expect(outcome.payout).toBe(250); // 100 + 1.5*100 = 250
  });

  it('should return 50% refund on Late Surrender', () => {
    const playerHand = new BlackjackHand('1', 100, [
      { id: '1', suit: 'spades', rank: '10', faceUp: true },
      { id: '2', suit: 'hearts', rank: '6', faceUp: true },
    ]);
    playerHand.status = 'SURRENDER';
    const dealerHand = new BlackjackHand('dealer', 0, []);

    const outcome = calculateHandOutcome(playerHand, dealerHand);
    expect(outcome.result).toBe('SURRENDER');
    expect(outcome.payout).toBe(50); // 50% of 100
  });
});

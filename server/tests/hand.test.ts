import { describe, it, expect } from 'vitest';
import { BlackjackHand } from '../src/blackjack/hand';
import { Card } from '../src/blackjack/card';

describe('BlackjackHand Module', () => {
  it('should calculate hard totals accurately', () => {
    const hand = new BlackjackHand('1', 100, [
      { id: '1', suit: 'spades', rank: '10', faceUp: true },
      { id: '2', suit: 'hearts', rank: '7', faceUp: true },
    ]);
    const evalRes = hand.evaluate();
    expect(evalRes.score).toBe(17);
    expect(evalRes.isSoft).toBe(false);
    expect(evalRes.isBust).toBe(false);
  });

  it('should calculate soft totals and convert Ace to 1 if score > 21', () => {
    const hand = new BlackjackHand('1', 100, [
      { id: '1', suit: 'spades', rank: 'A', faceUp: true },
      { id: '2', suit: 'hearts', rank: '6', faceUp: true },
    ]);
    expect(hand.evaluate().score).toBe(17);
    expect(hand.evaluate().isSoft).toBe(true);

    hand.addCard({ id: '3', suit: 'clubs', rank: '9', faceUp: true });
    // A + 6 + 9 = 16 (Ace converted to 1)
    expect(hand.evaluate().score).toBe(16);
    expect(hand.evaluate().isSoft).toBe(false);
    expect(hand.evaluate().isBust).toBe(false);
  });

  it('should detect Natural Blackjack exclusively on 2 cards (A + 10-value)', () => {
    const naturalBJ = new BlackjackHand('1', 100, [
      { id: '1', suit: 'spades', rank: 'A', faceUp: true },
      { id: '2', suit: 'hearts', rank: 'K', faceUp: true },
    ]);
    expect(naturalBJ.evaluate().isBlackjack).toBe(true);

    const threeCard21 = new BlackjackHand('2', 100, [
      { id: '1', suit: 'spades', rank: '7', faceUp: true },
      { id: '2', suit: 'hearts', rank: '7', faceUp: true },
      { id: '3', suit: 'diamonds', rank: '7', faceUp: true },
    ]);
    expect(threeCard21.evaluate().score).toBe(21);
    expect(threeCard21.evaluate().isBlackjack).toBe(false);

    const split21 = new BlackjackHand('3', 100, [
      { id: '1', suit: 'spades', rank: 'A', faceUp: true },
      { id: '2', suit: 'hearts', rank: '10', faceUp: true },
    ], true); // isFromSplit = true
    expect(split21.evaluate().isBlackjack).toBe(false);
  });

  it('should validate double and split rules correctly', () => {
    const pairHand = new BlackjackHand('1', 100, [
      { id: '1', suit: 'spades', rank: '8', faceUp: true },
      { id: '2', suit: 'hearts', rank: '8', faceUp: true },
    ]);
    expect(pairHand.canSplit()).toBe(true);
    expect(pairHand.canDouble()).toBe(true);

    pairHand.addCard({ id: '3', suit: 'clubs', rank: '2', faceUp: true });
    expect(pairHand.canSplit()).toBe(false);
    expect(pairHand.canDouble()).toBe(false);
  });
});

import { describe, it, expect } from 'vitest';
import { BlackjackEngine } from '../src/blackjack/engine';

describe('Payout & Credit Math Validation', () => {
  it('should calculate correct payout and net profit for a standard WIN', () => {
    const engine = new BlackjackEngine('game_win', 6);
    engine.startNewGame(1000);
    
    // Player hand: 20
    engine.hands[0].cards = [
      { suit: 'spades', rank: '10', value: 10, faceUp: true },
      { suit: 'hearts', rank: '10', value: 10, faceUp: true }
    ];
    // Dealer hand: 18
    engine.dealerHand.cards = [
      { suit: 'diamonds', rank: '10', value: 10, faceUp: true },
      { suit: 'clubs', rank: '8', value: 8, faceUp: true }
    ];

    engine.resolveGame();
    const dto = engine.toDTO();

    expect(dto.result).toBe('WIN');
    expect(dto.payout).toBe(2000); // 1000 original bet + 1000 winnings
    expect(dto.netProfit).toBe(1000);
  });

  it('should calculate correct payout for a 3:2 BLACKJACK', () => {
    const engine = new BlackjackEngine('game_bj', 6);
    engine.startNewGame(1000);

    // Player hand: BJ
    engine.hands[0].cards = [
      { suit: 'spades', rank: 'A', value: 11, faceUp: true },
      { suit: 'hearts', rank: 'K', value: 10, faceUp: true }
    ];
    // Dealer hand: 18
    engine.dealerHand.cards = [
      { suit: 'diamonds', rank: '10', value: 10, faceUp: true },
      { suit: 'clubs', rank: '8', value: 8, faceUp: true }
    ];

    engine.resolveGame();
    const dto = engine.toDTO();

    expect(dto.result).toBe('BLACKJACK');
    expect(dto.payout).toBe(2500); // 1000 bet + 1500 BJ win
    expect(dto.netProfit).toBe(1500);
  });

  it('should calculate correct payout for a PUSH (Tie)', () => {
    const engine = new BlackjackEngine('game_push', 6);
    engine.startNewGame(1000);

    // Player: 20
    engine.hands[0].cards = [
      { suit: 'spades', rank: '10', value: 10, faceUp: true },
      { suit: 'hearts', rank: '10', value: 10, faceUp: true }
    ];
    // Dealer: 20
    engine.dealerHand.cards = [
      { suit: 'diamonds', rank: '10', value: 10, faceUp: true },
      { suit: 'clubs', rank: '10', value: 10, faceUp: true }
    ];

    engine.resolveGame();
    const dto = engine.toDTO();

    expect(dto.result).toBe('PUSH');
    expect(dto.payout).toBe(1000); // Refund original bet
    expect(dto.netProfit).toBe(0);
  });

  it('should calculate correct payout for a LOSS', () => {
    const engine = new BlackjackEngine('game_loss', 6);
    engine.startNewGame(1000);

    // Player: 17
    engine.hands[0].cards = [
      { suit: 'spades', rank: '10', value: 10, faceUp: true },
      { suit: 'hearts', rank: '7', value: 7, faceUp: true }
    ];
    // Dealer: 20
    engine.dealerHand.cards = [
      { suit: 'diamonds', rank: '10', value: 10, faceUp: true },
      { suit: 'clubs', rank: '10', value: 10, faceUp: true }
    ];

    engine.resolveGame();
    const dto = engine.toDTO();

    expect(dto.result).toBe('LOSS');
    expect(dto.payout).toBe(0);
    expect(dto.netProfit).toBe(-1000);
  });
});

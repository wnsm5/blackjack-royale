import { describe, it, expect } from 'vitest';
import { BlackjackEngine } from '../src/blackjack/engine';

describe('Statistical & Stress Simulation', () => {
  it('should run 1,000 complete games without state machine errors or crashes', () => {
    let totalGames = 1000;
    let wins = 0;
    let losses = 0;
    let pushes = 0;
    let blackjacks = 0;

    for (let i = 0; i < totalGames; i++) {
      const engine = new BlackjackEngine(`sim_game_${i}`, 6);
      engine.startNewGame(100);

      if (engine.status === 'INSURANCE_OFFER') {
        engine.placeInsurance(false);
      }

      while (engine.status === 'PLAYING') {
        const hand = engine.getCurrentHand();
        const score = hand.evaluate().score;

        if (hand.canSplit() && engine.hands.length < 4 && Math.random() < 0.3) {
          try { engine.split(); continue; } catch {}
        }

        if (hand.canDouble() && score >= 9 && score <= 11 && Math.random() < 0.5) {
          try { engine.doubleDown(); continue; } catch {}
        }

        if (score < 17) {
          engine.hit();
        } else {
          engine.stand();
        }
      }

      expect(['FINISHED', 'RESOLVED']).toContain(engine.status);
      expect(engine.hands.length).toBeGreaterThanOrEqual(1);

      if (engine.gameResult === 'WIN') wins++;
      else if (engine.gameResult === 'LOSS') losses++;
      else if (engine.gameResult === 'PUSH') pushes++;
      else if (engine.gameResult === 'BLACKJACK') blackjacks++;
    }

    console.log(`[Simulation Results over 1,000 games] Wins: ${wins}, Blackjacks: ${blackjacks}, Losses: ${losses}, Pushes: ${pushes}`);
    expect(wins + blackjacks + losses + pushes).toBe(totalGames);
  });
});

import crypto from 'crypto';
import { Card, Rank, Suit } from './card';

const SUITS: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];
const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Penetration threshold: reshuffle when fewer than this many cards remain (approx 25% of shoe)
const RESHUFFLE_THRESHOLD = 52;

export class Deck {
  private cards: Card[] = [];
  private numDecks: number;

  constructor(numDecks: number = 6) {
    this.numDecks = numDecks;
    this.reset(numDecks);
  }

  public reset(numDecks: number = 6): void {
    this.numDecks = numDecks;
    this.cards = [];
    let idCounter = 1;
    for (let d = 0; d < numDecks; d++) {
      for (const suit of SUITS) {
        for (const rank of RANKS) {
          this.cards.push({
            // Each card has a unique ID per deck instance and position
            id: `card_${d}_${suit}_${rank}_${idCounter++}`,
            suit,
            rank,
            faceUp: true,
          });
        }
      }
    }
    this.shuffle();
  }

  /**
   * Cryptographically secure Fisher-Yates shuffle
   */
  public shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const randomIndex = crypto.randomInt(0, i + 1);
      [this.cards[i], this.cards[randomIndex]] = [this.cards[randomIndex], this.cards[i]];
    }
  }

  /**
   * Draw one card from the shoe. If the shoe is exhausted or below the
   * penetration threshold, reshuffle automatically.
   */
  public draw(faceUp: boolean = true): Card {
    if (this.cards.length === 0) {
      // Emergency reshuffle (should not happen in normal flow)
      this.reset(this.numDecks);
    }
    const card = this.cards.pop()!;
    card.faceUp = faceUp;
    return card;
  }

  /**
   * Returns true if the shoe needs to be reshuffled before the next game.
   * We reshuffle between hands, never mid-hand.
   */
  public needsReshuffle(): boolean {
    return this.cards.length < RESHUFFLE_THRESHOLD;
  }

  public getRemainingCount(): number {
    return this.cards.length;
  }

  public getNumDecks(): number {
    return this.numDecks;
  }

  public getCards(): Card[] {
    return [...this.cards];
  }

  /**
   * Restore a deck from a serialised card array (used for persistence).
   */
  public static fromArray(cards: Card[], numDecks: number = 6): Deck {
    const deck = new Deck(0);
    (deck as any).numDecks = numDecks;
    (deck as any).cards = [...cards];
    return deck;
  }
}

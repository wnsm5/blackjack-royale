import { Card, getCardValue } from './card';

export interface HandEvaluation {
  score: number;
  isSoft: boolean;
  isBust: boolean;
  isBlackjack: boolean;
  is21: boolean;
}

export class BlackjackHand {
  public id: string;
  public cards: Card[];
  public bet: number;
  public isFromSplit: boolean;
  public isAceSplit: boolean;
  public doubled: boolean;
  public status: 'IN_PROGRESS' | 'STAND' | 'BUST' | 'BLACKJACK' | 'SURRENDER' | 'FINISHED';
  public result?: string;
  public payout: number;

  constructor(
    id: string = 'hand_1',
    bet: number = 0,
    cards: Card[] = [],
    isFromSplit: boolean = false,
    isAceSplit: boolean = false
  ) {
    this.id = id;
    this.bet = bet;
    this.cards = cards;
    this.isFromSplit = isFromSplit;
    this.isAceSplit = isAceSplit;
    this.doubled = false;
    this.status = 'IN_PROGRESS';
    this.payout = 0;
  }

  public addCard(card: Card): void {
    this.cards.push(card);
    const evalResult = this.evaluate();
    if (evalResult.isBust) {
      this.status = 'BUST';
    } else if (evalResult.isBlackjack) {
      this.status = 'BLACKJACK';
    }
  }

  public evaluate(): HandEvaluation {
    let score = 0;
    let aces = 0;

    for (const card of this.cards) {
      if (!card.faceUp) continue; // Only count visible cards
      if (card.rank === 'A') {
        aces += 1;
        score += 11;
      } else {
        score += getCardValue(card.rank);
      }
    }

    let isSoft = false;
    while (score > 21 && aces > 0) {
      score -= 10;
      aces -= 1;
    }

    if (aces > 0 && score <= 21) {
      isSoft = true;
    }

    const isBust = score > 21;
    const is21 = score === 21;
    const isNaturalBlackjack =
      !this.isFromSplit &&
      this.cards.length === 2 &&
      score === 21 &&
      this.cards.every(c => c.faceUp);

    return {
      score,
      isSoft,
      isBust,
      isBlackjack: isNaturalBlackjack,
      is21,
    };
  }

  public canSplit(): boolean {
    if (this.cards.length !== 2) return false;
    const val1 = getCardValue(this.cards[0].rank);
    const val2 = getCardValue(this.cards[1].rank);
    return val1 === val2;
  }

  public canDouble(): boolean {
    return this.cards.length === 2 && !this.doubled && this.status === 'IN_PROGRESS';
  }

  public canSurrender(): boolean {
    return this.cards.length === 2 && !this.isFromSplit && !this.doubled && this.status === 'IN_PROGRESS';
  }
}

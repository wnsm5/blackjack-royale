import { Card } from './card';
import { Deck } from './deck';
import { BlackjackHand } from './hand';
import { DEFAULT_RULES, GameRules, shouldDealerHit, calculateHandOutcome } from './rules';
import { analyzeDecision, HandAnalysis, RecommendedAction } from './strategy';

export type GameStatus = 'BETTING' | 'INSURANCE_OFFER' | 'PLAYING' | 'DEALER_TURN' | 'RESOLVED' | 'FINISHED';

export interface GameStateDTO {
  id: string;
  status: GameStatus;
  bet: number;
  insuranceBet: number;
  hasInsurance: boolean;
  hands: {
    id: string;
    handIndex: number;
    cards: Card[];
    bet: number;
    status: string;
    score: number;
    isSoft: boolean;
    canHit: boolean;
    canStand: boolean;
    canDouble: boolean;
    canSplit: boolean;
    canSurrender: boolean;
    result?: string;
    payout?: number;
  }[];
  activeHandIndex: number;
  dealerHand: {
    cards: Card[];
    score: number;
    isSoft: boolean;
    isBust: boolean;
  };
  payout: number;
  netProfit: number;
  result?: string;
  analysis?: HandAnalysis[];
  deckRemainingCount: number;
  deckWasReshuffled: boolean;
}

export class BlackjackEngine {
  public id: string;
  public status: GameStatus;
  public deck: Deck;
  public rules: GameRules;
  public hands: BlackjackHand[];
  public activeHandIndex: number;
  public dealerHand: BlackjackHand;
  public insuranceBet: number;
  public initialBet: number;
  public payouts: number[];
  public totalPayout: number;
  public netProfit: number;
  public gameResult?: string;
  public analysisHistory: HandAnalysis[];
  public deckWasReshuffled: boolean;

  constructor(id: string, numDecks: number = 6, rules: GameRules = DEFAULT_RULES, existingDeck?: Deck) {
    this.id = id;
    this.status = 'BETTING';
    this.rules = { ...rules, numDecks };
    // Use the shared shoe if provided, otherwise create a fresh one
    this.deck = existingDeck ?? new Deck(numDecks);
    this.hands = [];
    this.activeHandIndex = 0;
    this.dealerHand = new BlackjackHand('dealer', 0);
    this.insuranceBet = 0;
    this.initialBet = 0;
    this.payouts = [];
    this.totalPayout = 0;
    this.netProfit = 0;
    this.analysisHistory = [];
    this.deckWasReshuffled = false;
  }

  public startNewGame(bet: number): void {
    if (bet <= 0) throw new Error('Mise invalide');

    this.initialBet = bet;
    this.status = 'BETTING';
    this.insuranceBet = 0;
    this.activeHandIndex = 0;
    this.payouts = [];
    this.totalPayout = 0;
    this.netProfit = 0;
    this.gameResult = undefined;
    this.analysisHistory = [];
    this.deckWasReshuffled = false;

    // Reshuffle between hands if shoe is nearly exhausted — never mid-hand
    if (this.deck.needsReshuffle()) {
      this.deck.reset(this.rules.numDecks);
      this.deckWasReshuffled = true;
    }

    // Initial deal
    const pCard1 = this.deck.draw(true);
    const dCard1 = this.deck.draw(true); // Dealer upcard
    const pCard2 = this.deck.draw(true);
    const dCard2 = this.deck.draw(false); // Dealer holecard

    const firstHand = new BlackjackHand('hand_0', bet, [pCard1, pCard2]);
    this.hands = [firstHand];
    this.dealerHand = new BlackjackHand('dealer', 0, [dCard1, dCard2]);

    const pEval = firstHand.evaluate();
    const dUpcard = this.dealerHand.cards[0];

    // Insurance check: if dealer upcard is Ace
    if (dUpcard.rank === 'A') {
      this.status = 'INSURANCE_OFFER';
      return;
    }

    this.checkInitialBlackjacks();
  }

  public placeInsurance(accept: boolean): void {
    if (this.status !== 'INSURANCE_OFFER') {
      throw new Error('Assurance non proposée');
    }

    if (accept) {
      this.insuranceBet = Math.floor(this.initialBet * 0.5);
    } else {
      this.insuranceBet = 0;
    }

    this.checkInitialBlackjacks();
  }

  private checkInitialBlackjacks(): void {
    const playerHand = this.hands[0];
    const pEval = playerHand.evaluate();
    const dEval = this.dealerHand.evaluate();

    if (pEval.isBlackjack || dEval.isBlackjack) {
      // Reveal dealer holecard
      this.dealerHand.cards[1].faceUp = true;
      this.resolveGame();
    } else {
      this.status = 'PLAYING';
    }
  }

  public hit(): void {
    this.assertState('PLAYING');
    const currentHand = this.getCurrentHand();

    if (currentHand.status !== 'IN_PROGRESS') {
      throw new Error('Main non active');
    }

    // Record strategy analysis
    const analysis = analyzeDecision(
      currentHand,
      this.dealerHand.cards[0],
      'HIT',
      currentHand.canSplit() && this.hands.length < this.rules.maxSplitHands,
      currentHand.canDouble(),
      currentHand.canSurrender()
    );
    this.analysisHistory.push(analysis);

    const card = this.deck.draw(true);
    currentHand.addCard(card);

    const evalResult = currentHand.evaluate();
    if (evalResult.isBust || evalResult.is21 || currentHand.isAceSplit) {
      if (evalResult.isBust) {
        currentHand.status = 'BUST';
      } else {
        currentHand.status = 'STAND';
      }
      this.advanceHand();
    }
  }

  public stand(): void {
    this.assertState('PLAYING');
    const currentHand = this.getCurrentHand();

    const analysis = analyzeDecision(
      currentHand,
      this.dealerHand.cards[0],
      'STAND',
      currentHand.canSplit() && this.hands.length < this.rules.maxSplitHands,
      currentHand.canDouble(),
      currentHand.canSurrender()
    );
    this.analysisHistory.push(analysis);

    currentHand.status = 'STAND';
    this.advanceHand();
  }

  public doubleDown(): void {
    this.assertState('PLAYING');
    const currentHand = this.getCurrentHand();

    if (!currentHand.canDouble()) {
      throw new Error('Double impossible');
    }

    const analysis = analyzeDecision(
      currentHand,
      this.dealerHand.cards[0],
      'DOUBLE',
      currentHand.canSplit() && this.hands.length < this.rules.maxSplitHands,
      currentHand.canDouble(),
      currentHand.canSurrender()
    );
    this.analysisHistory.push(analysis);

    currentHand.bet *= 2;
    currentHand.doubled = true;

    const card = this.deck.draw(true);
    currentHand.addCard(card);

    const evalResult = currentHand.evaluate();
    if (evalResult.isBust) {
      currentHand.status = 'BUST';
    } else {
      currentHand.status = 'STAND';
    }
    this.advanceHand();
  }

  public split(): void {
    this.assertState('PLAYING');
    const currentHand = this.getCurrentHand();

    if (!currentHand.canSplit()) {
      throw new Error('Split impossible');
    }

    if (this.hands.length >= this.rules.maxSplitHands) {
      throw new Error(`Maximum ${this.rules.maxSplitHands} mains atteint`);
    }

    const analysis = analyzeDecision(
      currentHand,
      this.dealerHand.cards[0],
      'SPLIT',
      true,
      currentHand.canDouble(),
      currentHand.canSurrender()
    );
    this.analysisHistory.push(analysis);

    const isAceSplit = currentHand.cards[0].rank === 'A';

    // Create 2 new split hands
    const card1 = currentHand.cards[0];
    const card2 = currentHand.cards[1];

    const hand1 = new BlackjackHand(
      `hand_${this.hands.length}`,
      currentHand.bet,
      [card1, this.deck.draw(true)],
      true,
      isAceSplit
    );
    const hand2 = new BlackjackHand(
      `hand_${this.hands.length + 1}`,
      currentHand.bet,
      [card2, this.deck.draw(true)],
      true,
      isAceSplit
    );

    // Replace current hand with hand1 and insert hand2
    this.hands.splice(this.activeHandIndex, 1, hand1, hand2);

    if (isAceSplit) {
      // Ace split: exactly 1 card each, then auto-stand
      hand1.status = 'STAND';
      hand2.status = 'STAND';
      this.advanceHand();
    }
  }

  public surrender(): void {
    this.assertState('PLAYING');
    const currentHand = this.getCurrentHand();

    if (!currentHand.canSurrender()) {
      throw new Error('Surrender impossible');
    }

    const analysis = analyzeDecision(
      currentHand,
      this.dealerHand.cards[0],
      'SURRENDER',
      false,
      currentHand.canDouble(),
      currentHand.canSurrender()
    );
    this.analysisHistory.push(analysis);

    currentHand.status = 'SURRENDER';
    this.advanceHand();
  }

  private advanceHand(): void {
    let nextIndex = this.activeHandIndex;
    while (nextIndex < this.hands.length && this.hands[nextIndex].status !== 'IN_PROGRESS') {
      nextIndex++;
    }

    if (nextIndex < this.hands.length) {
      this.activeHandIndex = nextIndex;
    } else {
      // All player hands finished -> dealer turn
      this.playDealerTurn();
    }
  }

  private playDealerTurn(): void {
    this.status = 'DEALER_TURN';

    // Reveal dealer hole card
    this.dealerHand.cards[1].faceUp = true;

    // If all player hands are BUST or SURRENDER, dealer does not need to draw
    const allHandsDoneNoDraw = this.hands.every(
      h => h.status === 'BUST' || h.status === 'SURRENDER'
    );

    if (!allHandsDoneNoDraw) {
      while (shouldDealerHit(this.dealerHand.cards, this.rules)) {
        const card = this.deck.draw(true);
        this.dealerHand.addCard(card);
      }
    }

    this.resolveGame();
  }

  public resolveGame(): void {
    this.status = 'RESOLVED';
    let totalPayout = 0;
    let totalWagered = this.insuranceBet;

    const dEval = this.dealerHand.evaluate();

    // Calculate Insurance outcome if bet was placed
    if (this.insuranceBet > 0) {
      if (dEval.isBlackjack) {
        totalPayout += this.insuranceBet * 3; // 2:1 payout + original insurance bet
      }
    }

    let overallWin = false;
    let overallLoss = false;
    let overallPush = false;
    let overallBlackjack = false;

    for (const hand of this.hands) {
      totalWagered += hand.bet;
      const outcome = calculateHandOutcome(hand, this.dealerHand);      hand.payout = outcome.payout;
      hand.result = outcome.result;
      totalPayout += outcome.payout;

      if (outcome.result === 'BLACKJACK') overallBlackjack = true;
      if (outcome.result === 'WIN' || outcome.result === 'BLACKJACK') overallWin = true;
      if (outcome.result === 'LOSS') overallLoss = true;
      if (outcome.result === 'PUSH') overallPush = true;
    }

    this.payouts = this.hands.map(h => h.payout);
    this.totalPayout = totalPayout;
    this.netProfit = totalPayout - totalWagered;

    if (overallBlackjack) {
      this.gameResult = 'BLACKJACK';
    } else if (overallWin && !overallLoss) {
      this.gameResult = 'WIN';
    } else if (overallLoss && !overallWin) {
      this.gameResult = 'LOSS';
    } else if (overallWin && overallLoss) {
      this.gameResult = this.netProfit > 0 ? 'WIN' : this.netProfit < 0 ? 'LOSS' : 'PUSH';
    } else {
      this.gameResult = 'PUSH';
    }

    this.status = 'FINISHED';
  }

  public getCurrentHand(): BlackjackHand {
    return this.hands[this.activeHandIndex];
  }

  private assertState(expected: GameStatus): void {
    if (this.status !== expected) {
      throw new Error(`Action non permise dans l'état actuel (${this.status})`);
    }
  }

  public toDTO(): GameStateDTO {
    const dEval = this.dealerHand.evaluate();
    const visibleDealerCards = this.dealerHand.cards.filter(c => c.faceUp);
    const visibleDealerHand = new BlackjackHand('dealer', 0, visibleDealerCards);
    const visibleDEval = visibleDealerHand.evaluate();

    return {
      id: this.id,
      status: this.status,
      bet: this.initialBet,
      insuranceBet: this.insuranceBet,
      hasInsurance: this.insuranceBet > 0,
      hands: this.hands.map((h, index) => {
        const evalRes = h.evaluate();
        return {
          id: h.id,
          handIndex: index,
          cards: h.cards,
          bet: h.bet,
          status: h.status,
          score: evalRes.score,
          isSoft: evalRes.isSoft,
          canHit: this.status === 'PLAYING' && index === this.activeHandIndex && h.status === 'IN_PROGRESS' && !h.isAceSplit,
          canStand: this.status === 'PLAYING' && index === this.activeHandIndex && h.status === 'IN_PROGRESS',
          canDouble: this.status === 'PLAYING' && index === this.activeHandIndex && h.canDouble(),
          canSplit: this.status === 'PLAYING' && index === this.activeHandIndex && h.canSplit() && this.hands.length < this.rules.maxSplitHands,
          canSurrender: this.status === 'PLAYING' && index === this.activeHandIndex && h.canSurrender(),
          result: h.result,
          payout: h.payout,
        };
      }),
      activeHandIndex: this.activeHandIndex,
      dealerHand: {
        cards: this.dealerHand.cards,
        score: this.status === 'FINISHED' || this.status === 'DEALER_TURN' ? dEval.score : visibleDEval.score,
        isSoft: this.status === 'FINISHED' || this.status === 'DEALER_TURN' ? dEval.isSoft : visibleDEval.isSoft,
        isBust: dEval.isBust,
      },
      payout: this.totalPayout,
      netProfit: this.netProfit,
      result: this.gameResult,
      analysis: this.analysisHistory,
      deckRemainingCount: this.deck.getRemainingCount(),
      deckWasReshuffled: this.deckWasReshuffled,
    };
  }
}

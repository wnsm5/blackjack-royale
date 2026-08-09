export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
}

export interface HandDTO {
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
}

export interface HandAnalysis {
  playerScore: number;
  isSoft: boolean;
  dealerUpcardValue: number;
  recommendedAction: 'HIT' | 'STAND' | 'DOUBLE' | 'SPLIT' | 'SURRENDER';
  actualAction: 'HIT' | 'STAND' | 'DOUBLE' | 'SPLIT' | 'SURRENDER';
  isOptimal: boolean;
  explanation: string;
}

export interface GameStateDTO {
  id: string;
  status: 'BETTING' | 'INSURANCE_OFFER' | 'PLAYING' | 'DEALER_TURN' | 'RESOLVED' | 'FINISHED';
  bet: number;
  insuranceBet: number;
  hasInsurance: boolean;
  hands: HandDTO[];
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
  deckWasReshuffled?: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  isGuest: boolean;
}

export interface Profile {
  id: string;
  userId: string;
  avatarUrl: string;
  credits: number;
  level: number;
  xp: number;
  winStreak: number;
  loseStreak: number;
  maxWinStreak: number;
  maxLoseStreak: number;
  lastDailyClaim?: string;
  consecutiveDailyDays: number;
}

export interface Statistics {
  gamesPlayed: number;
  wins: number;
  losses: number;
  pushes: number;
  blackjacks: number;
  busts: number;
  totalWagered: number;
  totalWon: number;
  totalLost: number;
  netProfit: number;
  biggestBet: number;
  biggestWin: number;
  biggestLoss: number;
  hitsCount: number;
  standsCount: number;
  doublesCount: number;
  splitsCount: number;
  surrendersCount: number;
  insurancesCount: number;
  successfulDoubles: number;
  winStreak: number;
  loseStreak: number;
  maxWinStreak: number;
  maxLoseStreak: number;
  winRate: number;
  bjRate: number;
  avgProfit: number;
}

export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  targetValue: number;
  rewardXp: number;
  rewardCredits: number;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string | null;
  progress: number;
}

export interface DailyChallenge {
  id: string;
  code: string;
  title: string;
  description: string;
  targetAmount: number;
  rewardCredits: number;
  rewardXp: number;
  progress: number;
  completed: boolean;
  claimed: boolean;
}

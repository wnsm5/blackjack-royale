import React from 'react';
import { Card } from '../types';
import { CardComponent } from './CardComponent';

interface HandDisplayProps {
  title: string;
  cards: Card[];
  score: number;
  isSoft?: boolean;
  isBust?: boolean;
  isActive?: boolean;
  bet?: number;
  result?: string;
  cardDelayOffset?: number; // Base delay offset in seconds
}

export function calculateCardsScore(cards: Card[]) {
  const visibleCards = cards.filter(c => c.faceUp !== false);
  let total = 0;
  let aces = 0;

  for (const card of visibleCards) {
    if (card.rank === 'A') {
      aces++;
      total += 11;
    } else if (['K', 'Q', 'J', '10'].includes(card.rank)) {
      total += 10;
    } else {
      total += parseInt(card.rank, 10) || 0;
    }
  }

  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  const hasHiddenCard = cards.some(c => c.faceUp === false);

  return {
    score: total,
    isSoft: aces > 0,
    isBust: total > 21,
    hasHiddenCard,
  };
}

export const HandDisplay: React.FC<HandDisplayProps> = ({
  title,
  cards,
  score: fallbackScore,
  isSoft: fallbackIsSoft,
  isBust: fallbackIsBust,
  isActive = false,
  bet,
  result,
  cardDelayOffset = 0,
}) => {
  // Dynamically calculate live score of visible cards
  const live = calculateCardsScore(cards);
  const currentScore = live.hasHiddenCard ? live.score : (live.score || fallbackScore);
  const currentIsSoft = live.hasHiddenCard ? live.isSoft : (live.isSoft ?? fallbackIsSoft);
  const currentIsBust = live.hasHiddenCard ? false : (live.isBust || fallbackIsBust);

  return (
    <div className={`flex flex-col items-center p-3 sm:p-4 rounded-2xl transition-all duration-300 ${
      isActive ? 'ring-2 ring-amber-400 bg-emerald-950/50 backdrop-blur-md shadow-xl scale-102' : 'bg-slate-900/40 backdrop-blur-sm border border-slate-800/60'
    }`}>
      <div className="flex items-center gap-2.5 mb-2">
        <span className="text-xs sm:text-sm font-black tracking-wider text-slate-200 uppercase">{title}</span>
        
        {/* Live Score badge */}
        <span className={`px-3 py-0.5 rounded-full text-xs font-black shadow-md flex items-center gap-1 transition-all duration-300 ${
          currentIsBust
            ? 'bg-rose-600 text-white animate-pulse'
            : currentScore === 21
            ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 ring-2 ring-amber-300 font-extrabold animate-bounce'
            : 'bg-slate-800 text-amber-300 border border-slate-700'
        }`}>
          <span>
            {currentIsBust
              ? `BUST (${currentScore})`
              : currentIsSoft
              ? `Soft ${currentScore}`
              : currentScore}
          </span>
          {live.hasHiddenCard && (
            <span className="text-[10px] text-amber-400/80 font-normal pl-0.5" title="Carte cachée">(+?)</span>
          )}
        </span>

        {bet !== undefined && (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-inner">
            {bet} CR
          </span>
        )}
      </div>

      {/* Cards list with sequential distribution animation */}
      <div className="flex flex-wrap justify-center -space-x-8 sm:-space-x-12 p-2 min-h-[120px] items-center">
        {cards.map((card, idx) => (
          <CardComponent
            key={card.id || `${card.suit}_${card.rank}_${idx}`}
            card={card}
          />
        ))}
      </div>

      {result && (
        <div className={`mt-2 px-3 py-1 rounded-lg text-xs font-black tracking-wide uppercase shadow-md animate-fade-in ${
          result === 'WIN' || result === 'BLACKJACK'
            ? 'bg-emerald-500 text-slate-950'
            : result === 'LOSS'
            ? 'bg-rose-600 text-white'
            : 'bg-amber-500 text-slate-950'
        }`}>
          {result}
        </div>
      )}
    </div>
  );
};

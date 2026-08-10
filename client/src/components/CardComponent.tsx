import React from 'react';
import { Card } from '../types';

type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';

function getSuitColor(suit: Suit): 'red' | 'black' {
  return suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
}

function getSuitSymbol(suit: Suit): string {
  switch (suit) {
    case 'spades': return '♠';
    case 'hearts': return '♥';
    case 'diamonds': return '♦';
    case 'clubs': return '♣';
  }
}

interface CardComponentProps {
  card: Card;
  className?: string;
  animationDelay?: number;
}

export const CardComponent: React.FC<CardComponentProps> = ({ card, className = '', animationDelay = 0 }) => {
  const isRed = getSuitColor(card.suit) === 'red';
  const symbol = getSuitSymbol(card.suit);
  const style = animationDelay > 0 ? { animationDelay: `${animationDelay}s` } : undefined;

  return (
    <div
      style={style}
      className={`perspective-1000 w-16 h-24 xs:w-20 xs:h-28 sm:w-28 sm:h-40 shrink-0 select-none animate-deal-card ${className}`}
    >
      {/* 3D Flip Card Container */}
      <div
        className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
          card.faceUp ? '' : 'rotate-y-180'
        }`}
      >
        {/* FRONT OF CARD (Visible when faceUp = true) */}
        <div className={`absolute inset-0 w-full h-full rounded-lg sm:rounded-xl bg-gradient-to-b from-amber-50/95 to-slate-100 border-2 border-slate-300 shadow-xl p-1.5 sm:p-2.5 flex flex-col justify-between backface-hidden ${isRed ? 'text-red-600' : 'text-slate-900'}`}>
          {/* Top corner rank + suit */}
          <div className="flex flex-col items-center w-fit leading-none">
            <span className="text-xs sm:text-2xl font-black tracking-tighter">{card.rank}</span>
            <span className="text-[10px] sm:text-base">{symbol}</span>
          </div>

          {/* Center suit symbol */}
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-90 pointer-events-none">
            {['K', 'Q', 'J'].includes(card.rank) ? (
              <div className="flex flex-col items-center justify-center">
                <span className="text-xl sm:text-5xl font-black">{symbol}</span>
                <span className="text-[8px] sm:text-[10px] font-black tracking-widest uppercase text-slate-500/80">{card.rank}</span>
              </div>
            ) : (
              <span className="text-2xl sm:text-6xl font-bold">{symbol}</span>
            )}
          </div>

          {/* Bottom corner upside-down */}
          <div className="flex flex-col items-center w-fit leading-none self-end rotate-180">
            <span className="text-xs sm:text-2xl font-black tracking-tighter">{card.rank}</span>
            <span className="text-[10px] sm:text-base">{symbol}</span>
          </div>
        </div>

        {/* BACK OF CARD (Visible when faceUp = false / rotated 180deg) */}
        <div className="absolute inset-0 w-full h-full rounded-lg sm:rounded-xl bg-red-800 border-2 border-slate-100 shadow-xl flex items-center justify-center overflow-hidden rotate-y-180 backface-hidden">
          <div className="absolute inset-1 rounded-md border border-amber-300/40 bg-[radial-gradient(#b91c1c_2px,transparent_2px)] [background-size:6px_6px] bg-red-900 opacity-90" />
          <div className="w-8 h-12 sm:w-12 sm:h-16 rounded-md border border-amber-400/50 flex flex-col items-center justify-center bg-red-950/80 backdrop-blur-sm z-10 shadow-inner">
            <span className="text-sm sm:text-xl text-amber-300 font-extrabold">♠</span>
          </div>
        </div>
      </div>
    </div>
  );
};

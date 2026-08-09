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
  animationDelay?: number; // Delay in seconds for sequential distribution
}

export const CardComponent: React.FC<CardComponentProps> = ({ card, className = '', animationDelay = 0 }) => {
  const style = animationDelay > 0 ? { animationDelay: `${animationDelay}s` } : undefined;

  // Face-down card skin (Classic Casino Red Pattern with Gold trim)
  if (!card.faceUp) {
    return (
      <div
        style={style}
        className={`relative w-24 h-36 sm:w-28 sm:h-40 rounded-xl bg-red-800 border-2 border-slate-100 shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-300 transform hover:scale-105 animate-deal-card ${className}`}
      >
        {/* Classic Linen White Border */}
        <div className="absolute inset-1 rounded-lg border border-amber-300/40 bg-[radial-gradient(#b91c1c_2px,transparent_2px)] [background-size:8px_8px] bg-red-900 opacity-90"></div>
        <div className="w-12 h-16 rounded-lg border-2 border-amber-400/50 flex flex-col items-center justify-center bg-red-950/80 backdrop-blur-sm z-10 shadow-inner">
          <span className="text-xl text-amber-300 font-extrabold">♠</span>
          <span className="text-[9px] font-black text-amber-200 tracking-tighter uppercase mt-0.5">CASINO</span>
        </div>
      </div>
    );
  }

  const isRed = getSuitColor(card.suit) === 'red';
  const symbol = getSuitSymbol(card.suit);

  // Classic Card Front (Clean Ivory white, sharp border, elegant poker typography)
  return (
    <div
      style={style}
      className={`relative w-24 h-36 sm:w-28 sm:h-40 rounded-xl bg-gradient-to-b from-amber-50/95 to-slate-100 border-2 border-slate-300 shadow-2xl p-2.5 flex flex-col justify-between select-none transition-all duration-300 transform hover:scale-105 animate-deal-card ${isRed ? 'text-red-600' : 'text-slate-900'} ${className}`}
    >
      {/* Top corner rank + suit */}
      <div className="flex flex-col items-center w-fit leading-none">
        <span className="text-xl sm:text-2xl font-black tracking-tighter">{card.rank}</span>
        <span className="text-sm sm:text-base">{symbol}</span>
      </div>

      {/* Center suit symbol / Court art fallback */}
      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-90 pointer-events-none">
        {['K', 'Q', 'J'].includes(card.rank) ? (
          <div className="flex flex-col items-center justify-center">
            <span className="text-4xl sm:text-5xl font-black">{symbol}</span>
            <span className="text-[10px] font-black tracking-widest uppercase text-slate-500/80 mt-1">{card.rank}</span>
          </div>
        ) : (
          <span className="text-4xl sm:text-6xl font-bold">{symbol}</span>
        )}
      </div>

      {/* Bottom corner upside-down */}
      <div className="flex flex-col items-center w-fit leading-none self-end rotate-180">
        <span className="text-xl sm:text-2xl font-black tracking-tighter">{card.rank}</span>
        <span className="text-sm sm:text-base">{symbol}</span>
      </div>
    </div>
  );
};

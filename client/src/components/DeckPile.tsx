import React from 'react';
import { Layers } from 'lucide-react';

interface DeckPileProps {
  remainingCount: number;
}

export const DeckPile: React.FC<DeckPileProps> = ({ remainingCount }) => {
  return (
    <div className="relative group cursor-pointer select-none" title={`Sabot de cartes (${remainingCount} restantes)`}>
      {/* 3D Stack Cards depth */}
      <div className="absolute top-3 left-3 w-20 h-32 sm:w-24 sm:h-36 rounded-xl bg-red-950 border border-slate-700/80 shadow-md"></div>
      <div className="absolute top-2 left-2 w-20 h-32 sm:w-24 sm:h-36 rounded-xl bg-red-900 border border-red-800 shadow-lg"></div>
      <div className="absolute top-1 left-1 w-20 h-32 sm:w-24 sm:h-36 rounded-xl bg-red-850 border border-amber-500/30 shadow-xl"></div>

      {/* Main Top Face-down Card */}
      <div className="relative w-20 h-32 sm:w-24 sm:h-36 rounded-xl bg-red-800 border-2 border-slate-100 shadow-2xl flex flex-col items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
        <div className="absolute inset-1 rounded-lg border border-amber-300/40 bg-[radial-gradient(#b91c1c_2px,transparent_2px)] [background-size:8px_8px] bg-red-900 opacity-90"></div>
        <div className="w-12 h-14 rounded-lg border border-amber-400/50 flex flex-col items-center justify-center bg-red-950/90 z-10 shadow-inner">
          <Layers size={22} className="text-amber-300" />
          <span className="text-xs font-black text-amber-200 mt-1">{remainingCount}</span>
        </div>
      </div>
    </div>
  );
};

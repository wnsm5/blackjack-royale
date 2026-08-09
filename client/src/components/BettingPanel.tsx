import React from 'react';
import { useGameStore } from '../stores/useGameStore';
import { useAuthStore } from '../stores/useAuthStore';
import { Play, Minus, Plus, Coins, RotateCcw } from 'lucide-react';
import { CasinoChip } from './CasinoChip';

const CHIP_VALUES = [25, 50, 100, 250, 500, 1000];

export const BettingPanel: React.FC = () => {
  const { currentBet, setBet, createGame, isLoading } = useGameStore();
  const { profile } = useAuthStore();
  const credits = profile?.credits || 0;

  const handleChipClick = (val: number) => {
    const newBet = Math.min(credits, currentBet + val);
    setBet(newBet);
  };

  const handleMaxBet = () => {
    setBet(credits);
  };

  const handleClearBet = () => {
    setBet(Math.min(25, credits));
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xl bg-slate-900/90 backdrop-blur-md p-4 sm:p-6 rounded-3xl border border-slate-800 shadow-2xl">
      <div className="text-center">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Choisir votre mise</span>
        <div className="flex items-center justify-center gap-3 mt-1.5">
          <button
            onClick={() => setBet(Math.max(25, currentBet - 25))}
            disabled={currentBet <= 25 || isLoading}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 transition"
          >
            <Minus size={16} />
          </button>

          <div className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-950/80 rounded-2xl border border-amber-500/40 shadow-inner">
            <Coins size={22} className="text-amber-400" />
            <span className="text-2xl sm:text-3xl font-black text-amber-400 min-w-[100px] text-center">
              {currentBet}
            </span>
          </div>

          <button
            onClick={() => setBet(Math.min(credits, currentBet + 25))}
            disabled={currentBet >= credits || isLoading}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 transition"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Realistic Casino Poker Chips */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 py-1">
        {CHIP_VALUES.map((val) => (
          <CasinoChip
            key={val}
            value={val}
            onClick={() => handleChipClick(val)}
            disabled={currentBet + val > credits || isLoading}
          />
        ))}
        <CasinoChip
          value="MAX"
          onClick={handleMaxBet}
          disabled={credits <= 0 || isLoading}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 w-full mt-1">
        <button
          onClick={handleClearBet}
          disabled={isLoading}
          className="px-4 py-3.5 rounded-2xl bg-slate-800/90 text-slate-300 hover:bg-slate-700 text-xs font-bold transition flex items-center gap-1.5"
        >
          <RotateCcw size={15} />
          <span>REMISE</span>
        </button>

        <button
          onClick={createGame}
          disabled={currentBet <= 0 || currentBet > credits || isLoading}
          className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 font-black text-base sm:text-lg shadow-xl hover:from-emerald-400 hover:to-teal-400 active:scale-98 transition flex items-center justify-center gap-2 disabled:opacity-40"
        >
          <Play size={20} fill="currentColor" />
          <span>DISTRIBUER ({currentBet} CR)</span>
        </button>
      </div>
    </div>
  );
};

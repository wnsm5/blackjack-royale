import React from 'react';
import { useGameStore } from '../stores/useGameStore';
import { useAuthStore } from '../stores/useAuthStore';
import { Play, Minus, Plus, Coins, RotateCcw } from 'lucide-react';
import { CasinoChip } from './CasinoChip';

const CHIP_VALUES = [1, 2, 5, 10, 20];

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
    <div className="flex flex-col items-center gap-2.5 w-full bg-slate-950/90 backdrop-blur-xl p-3 rounded-2xl border border-slate-800/80 shadow-2xl">
      {/* Bet Amount Stepper */}
      <div className="flex items-center justify-between w-full px-2">
        <button
          onClick={handleClearBet}
          disabled={isLoading}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 active:scale-95 transition"
          title="Reset"
        >
          <RotateCcw size={16} />
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 rounded-full border border-amber-500/40">
          <Coins size={16} className="text-amber-400" />
          <span className="text-xl font-black text-amber-400 min-w-[70px] text-center">
            {currentBet}
          </span>
        </div>

        <button
          onClick={handleMaxBet}
          disabled={credits <= 0 || isLoading}
          className="px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-[11px] hover:bg-amber-500/30 active:scale-95 transition"
        >
          MAX
        </button>
      </div>

      {/* Realistic Casino Chips Grid */}
      <div className="flex justify-center gap-1.5 w-full">
        {CHIP_VALUES.map((val) => (
          <CasinoChip
            key={val}
            value={val}
            onClick={() => handleChipClick(val)}
            disabled={currentBet + val > credits || isLoading}
          />
        ))}
      </div>

      {/* Deal Button */}
      <button
        onClick={createGame}
        disabled={currentBet <= 0 || currentBet > credits || isLoading}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 font-black text-base shadow-xl hover:from-emerald-400 hover:to-teal-400 active:scale-98 transition flex items-center justify-center gap-2 disabled:opacity-30 disabled:pointer-events-none"
      >
        <Play size={18} fill="currentColor" />
        <span>JOUER ({currentBet} CR)</span>
      </button>
    </div>
  );
};

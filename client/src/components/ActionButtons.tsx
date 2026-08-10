import React from 'react';
import { useGameStore } from '../stores/useGameStore';
import { HandDTO } from '../types';
import { Play, Hand, Layers, ShieldAlert, Flag } from 'lucide-react';

interface ActionButtonsProps {
  activeHand?: HandDTO;
  isInsuranceOffer?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ activeHand, isInsuranceOffer }) => {
  const { hit, stand, double, split, surrender, insurance, isLoading } = useGameStore();

  if (isInsuranceOffer) {
    return (
      <div className="flex flex-col items-center gap-3 w-full bg-slate-900/95 p-4 rounded-2xl border border-amber-500/40 shadow-2xl">
        <span className="text-xs sm:text-sm font-bold text-amber-400 text-center">Assurance contre le Blackjack ?</span>
        <div className="flex gap-3 w-full">
          <button
            onClick={() => insurance(true)}
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl bg-amber-500 text-slate-950 font-black text-xs sm:text-sm hover:bg-amber-400 active:scale-95 transition"
          >
            OUI
          </button>
          <button
            onClick={() => insurance(false)}
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs sm:text-sm hover:bg-slate-700 active:scale-95 transition"
          >
            NON
          </button>
        </div>
      </div>
    );
  }

  if (!activeHand) return null;

  return (
    <div className="w-full grid grid-cols-2 gap-2.5 p-2.5 bg-slate-950/90 backdrop-blur-xl rounded-2xl border border-slate-800/80 shadow-2xl">
      {/* HIT (TIRER) */}
      <button
        onClick={hit}
        disabled={!activeHand.canHit || isLoading}
        className="py-3.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-black text-sm shadow-lg hover:from-emerald-500 hover:to-emerald-400 active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-20 disabled:pointer-events-none"
      >
        <Play size={18} fill="currentColor" />
        <span>TIRER</span>
      </button>

      {/* STAND (RESTER) */}
      <button
        onClick={stand}
        disabled={!activeHand.canStand || isLoading}
        className="py-3.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 text-white font-black text-sm shadow-lg hover:from-rose-500 hover:to-red-400 active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-20 disabled:pointer-events-none"
      >
        <Hand size={18} />
        <span>RESTER</span>
      </button>

      {/* DOUBLE */}
      {activeHand.canDouble && (
        <button
          onClick={double}
          disabled={isLoading}
          className="py-3 px-3 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-lg hover:bg-amber-400 active:scale-95 transition flex items-center justify-center gap-1.5"
        >
          <Layers size={16} />
          <span>DOUBLER</span>
        </button>
      )}

      {/* SPLIT */}
      {activeHand.canSplit && (
        <button
          onClick={split}
          disabled={isLoading}
          className="py-3 px-3 rounded-xl bg-indigo-600 text-white font-black text-xs shadow-lg hover:bg-indigo-500 active:scale-95 transition flex items-center justify-center gap-1.5"
        >
          <ShieldAlert size={16} />
          <span>SPLIT</span>
        </button>
      )}

      {/* SURRENDER */}
      {activeHand.canSurrender && (
        <button
          onClick={surrender}
          disabled={isLoading}
          className="col-span-2 py-2 px-3 rounded-xl bg-slate-800 text-slate-400 font-bold text-[11px] hover:bg-slate-700 active:scale-95 transition flex items-center justify-center gap-1"
        >
          <Flag size={13} />
          <span>ABANDONNER (-50%)</span>
        </button>
      )}
    </div>
  );
};

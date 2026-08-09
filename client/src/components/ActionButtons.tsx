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
      <div className="flex flex-col items-center gap-3 w-full max-w-md bg-slate-900/90 p-4 rounded-2xl border border-amber-500/40 shadow-2xl">
        <span className="text-sm font-bold text-amber-400">Le Croupier montre un As. Prendre une assurance ?</span>
        <div className="flex gap-4 w-full">
          <button
            onClick={() => insurance(true)}
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl bg-amber-500 text-slate-950 font-black text-sm hover:bg-amber-400 transition"
          >
            ASSURANCE (OUI)
          </button>
          <button
            onClick={() => insurance(false)}
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-700 transition"
          >
            REFUSER (NON)
          </button>
        </div>
      </div>
    );
  }

  if (!activeHand) return null;

  return (
    <div className="w-full max-w-xl grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-3 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl">
      {/* HIT */}
      <button
        onClick={hit}
        disabled={!activeHand.canHit || isLoading}
        className="py-3 sm:py-4 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-extrabold text-sm sm:text-base shadow-lg hover:from-emerald-500 hover:to-emerald-400 active:scale-95 transition flex items-center justify-center gap-1.5 disabled:opacity-30 disabled:hover:scale-100"
      >
        <Play size={18} fill="currentColor" />
        TIRER
      </button>

      {/* STAND */}
      <button
        onClick={stand}
        disabled={!activeHand.canStand || isLoading}
        className="py-3 sm:py-4 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 text-white font-extrabold text-sm sm:text-base shadow-lg hover:from-rose-500 hover:to-red-400 active:scale-95 transition flex items-center justify-center gap-1.5 disabled:opacity-30 disabled:hover:scale-100"
      >
        <Hand size={18} />
        RESTER
      </button>

      {/* DOUBLE */}
      <button
        onClick={double}
        disabled={!activeHand.canDouble || isLoading}
        className="py-3 sm:py-4 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 font-extrabold text-sm sm:text-base shadow-lg hover:from-amber-500 hover:to-yellow-400 active:scale-95 transition flex items-center justify-center gap-1.5 disabled:opacity-30 disabled:hover:scale-100"
      >
        <Layers size={18} />
        DOUBLER
      </button>

      {/* SPLIT */}
      <button
        onClick={split}
        disabled={!activeHand.canSplit || isLoading}
        className="py-3 sm:py-4 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-extrabold text-sm sm:text-base shadow-lg hover:from-indigo-500 hover:to-blue-400 active:scale-95 transition flex items-center justify-center gap-1.5 disabled:opacity-30 disabled:hover:scale-100"
      >
        <ShieldAlert size={18} />
        SPLIT
      </button>

      {/* SURRENDER */}
      {activeHand.canSurrender && (
        <button
          onClick={surrender}
          disabled={isLoading}
          className="col-span-2 sm:col-span-4 py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs shadow hover:bg-slate-700 transition flex items-center justify-center gap-1.5"
        >
          <Flag size={14} />
          ABANDONNER (Récupérer 50% de la mise)
        </button>
      )}
    </div>
  );
};

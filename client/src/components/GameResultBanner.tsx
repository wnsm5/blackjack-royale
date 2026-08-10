import React from 'react';
import { useGameStore } from '../stores/useGameStore';
import { Trophy, Sparkles, XCircle, Equal, BarChart2 } from 'lucide-react';

export const GameResultBanner: React.FC = () => {
  const { gameState, isDealerAnimating, openAnalysis } = useGameStore();

  if (!gameState || gameState.status !== 'FINISHED') {
    return null;
  }

  const result = gameState.result;
  const isWin = result === 'WIN' || result === 'BLACKJACK';
  const isLoss = result === 'LOSS';

  const playerScore = gameState.hands[0]?.score || 0;
  const dealerScore = gameState.dealerHand.score;

  return (
    <div className="w-full bg-slate-900 border-2 border-amber-400/80 backdrop-blur-xl p-3 rounded-2xl shadow-2xl flex items-center justify-between gap-2 my-2 z-30 animate-pulse-once">
      {/* Result Status & Profit */}
      <div className="flex items-center gap-2.5">
        <div className={`p-2 rounded-xl border flex items-center justify-center shrink-0 ${
          result === 'BLACKJACK'
            ? 'bg-amber-500/30 border-amber-300 text-amber-300'
            : isWin
            ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300'
            : isLoss
            ? 'bg-rose-500/30 border-rose-400 text-rose-300'
            : 'bg-amber-500/30 border-amber-300 text-amber-300'
        }`}>
          {result === 'BLACKJACK' ? (
            <Sparkles size={20} />
          ) : isWin ? (
            <Trophy size={20} />
          ) : isLoss ? (
            <XCircle size={20} />
          ) : (
            <Equal size={20} />
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`text-sm font-black uppercase tracking-tight ${
              isWin ? 'text-emerald-400' : isLoss ? 'text-rose-400' : 'text-amber-300'
            }`}>
              {result === 'BLACKJACK' ? 'BLACKJACK !' : isWin ? 'GAGNÉ !' : isLoss ? 'PERDU' : 'ÉGALITÉ'}
            </span>
            <span className={`text-xs font-black px-2 py-0.5 rounded-lg border ${
              gameState.netProfit > 0
                ? 'bg-emerald-950 border-emerald-500/60 text-emerald-300'
                : gameState.netProfit < 0
                ? 'bg-rose-950 border-rose-500/60 text-rose-300'
                : 'bg-slate-800 border-slate-700 text-amber-300'
            }`}>
              {gameState.netProfit >= 0 ? `+${gameState.netProfit}` : gameState.netProfit} CR
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Joueur : <strong className="text-slate-100">{playerScore}</strong> — Croupier : <strong className="text-slate-100">{dealerScore}</strong>
          </span>
        </div>
      </div>

      {/* Analysis Button */}
      <button
        onClick={() => openAnalysis()}
        className="px-3 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs transition flex items-center gap-1 shrink-0 shadow-lg active:scale-95"
      >
        <BarChart2 size={15} />
        <span>Analyser</span>
      </button>
    </div>
  );
};

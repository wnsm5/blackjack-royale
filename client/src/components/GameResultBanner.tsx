import React from 'react';
import { useGameStore } from '../stores/useGameStore';
import { Trophy, Sparkles, XCircle, Equal, BarChart2 } from 'lucide-react';

export const GameResultBanner: React.FC = () => {
  const { gameState, isDealerAnimating, openAnalysis } = useGameStore();

  if (!gameState || gameState.status !== 'FINISHED' || isDealerAnimating) {
    return null;
  }

  const result = gameState.result;
  const isWin = result === 'WIN' || result === 'BLACKJACK';
  const isLoss = result === 'LOSS';

  const playerScore = gameState.hands[0]?.score || 0;
  const dealerScore = gameState.dealerHand.score;

  return (
    <div className="w-full max-w-lg bg-slate-950/90 border border-slate-700/80 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3 animate-fade-in my-2">
      {/* Result Status & Profit */}
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 ${
          result === 'BLACKJACK'
            ? 'bg-amber-500/20 border-amber-400 text-amber-400 animate-bounce'
            : isWin
            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400'
            : isLoss
            ? 'bg-rose-500/20 border-rose-500 text-rose-400'
            : 'bg-amber-500/20 border-amber-300 text-amber-300'
        }`}>
          {result === 'BLACKJACK' ? (
            <Sparkles size={22} />
          ) : isWin ? (
            <Trophy size={22} />
          ) : isLoss ? (
            <XCircle size={22} />
          ) : (
            <Equal size={22} />
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`text-base font-black uppercase tracking-tight ${
              isWin ? 'text-emerald-400' : isLoss ? 'text-rose-400' : 'text-amber-300'
            }`}>
              {result === 'BLACKJACK' ? 'BLACKJACK !' : isWin ? 'VICTOIRE !' : isLoss ? 'DÉFAITE' : 'ÉGALITÉ (PUSH)'}
            </span>
            <span className={`text-sm font-extrabold px-2 py-0.5 rounded-lg border ${
              gameState.netProfit > 0
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                : gameState.netProfit < 0
                ? 'bg-rose-950/80 border-rose-500/40 text-rose-300'
                : 'bg-slate-800 border-slate-700 text-amber-300'
            }`}>
              {gameState.netProfit >= 0 ? `+${gameState.netProfit}` : gameState.netProfit} CR
            </span>
          </div>
          <span className="text-xs text-slate-400 mt-0.5">
            Joueur : <strong className="text-slate-200">{playerScore}</strong> — Croupier : <strong className="text-slate-200">{dealerScore}</strong>
          </span>
        </div>
      </div>

      {/* Analysis Button directly on banner */}
      <button
        onClick={() => openAnalysis()}
        className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs transition flex items-center gap-1.5 shrink-0 shadow"
      >
        <BarChart2 size={16} className="text-amber-400" />
        <span className="hidden sm:inline">Analyser</span>
      </button>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/useGameStore';
import { useAuthStore } from '../stores/useAuthStore';
import { Trophy, Frown, Equal, Sparkles, RefreshCw, BarChart2, Eye, EyeOff, Coins, Home, CheckCircle2, XCircle } from 'lucide-react';

export const ResultModal: React.FC = () => {
  const { gameState, isDealerAnimating, createGame, openAnalysis, resetGame } = useGameStore();
  const { profile } = useAuthStore();
  const navigate = useNavigate();

  const [isMinimized, setIsMinimized] = useState(false);

  if (!gameState || gameState.status !== 'FINISHED' || isDealerAnimating) {
    return null;
  }

  const result = gameState.result;
  const isWin = result === 'WIN' || result === 'BLACKJACK';
  const isLoss = result === 'LOSS';
  const isPush = result === 'PUSH';

  const playerScore = gameState.hands[0]?.score || 0;
  const dealerScore = gameState.dealerHand.score;

  const handleNewBet = () => {
    setIsMinimized(false);
    resetGame();
  };

  const handleHome = () => {
    setIsMinimized(false);
    resetGame();
    navigate('/profile');
  };

  const handleReplay = () => {
    setIsMinimized(false);
    createGame();
  };

  // Minimized Bar over the game table
  if (isMinimized) {
    return (
      <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-amber-500/60 backdrop-blur-md px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-fade-in text-slate-100 max-w-[95vw]">
        <div className="flex items-center gap-2 font-black text-sm">
          {result === 'BLACKJACK' ? (
            <span className="text-amber-400 flex items-center gap-1.5">
              <Sparkles size={16} /> BLACKJACK (+{gameState.netProfit} CR)
            </span>
          ) : isWin ? (
            <span className="text-emerald-400 flex items-center gap-1.5">
              <Trophy size={16} /> VICTOIRE (+{gameState.netProfit} CR)
            </span>
          ) : isLoss ? (
            <span className="text-rose-400 flex items-center gap-1.5">
              <XCircle size={16} /> DÉFAITE ({gameState.netProfit} CR)
            </span>
          ) : (
            <span className="text-amber-300 flex items-center gap-1.5">
              <Equal size={16} /> PUSH (0 CR)
            </span>
          )}
        </div>

        <div className="h-4 w-px bg-slate-700"></div>

        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold transition"
          title="Réafficher le détail du résultat"
        >
          <Eye size={15} />
          <span className="hidden sm:inline">Résultat</span>
        </button>

        <button
          onClick={() => openAnalysis()}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition"
        >
          <BarChart2 size={15} />
          <span>Analyser</span>
        </button>

        <button
          onClick={handleNewBet}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs font-bold transition"
        >
          <Coins size={15} />
          <span>Miser</span>
        </button>

        <button
          onClick={handleReplay}
          className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs shadow hover:scale-105 transition"
        >
          <RefreshCw size={14} />
          <span>Rejouer</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center gap-4">
        
        {/* Toggle Minimize Button */}
        <button
          onClick={() => setIsMinimized(true)}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition flex items-center gap-1.5 text-xs font-semibold"
          title="Masquer la fenêtre pour voir la table et les cartes"
        >
          <EyeOff size={16} />
          <span className="hidden sm:inline">Voir la table</span>
        </button>

        {/* Header Icon */}
        <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-inner mt-2 ${
          result === 'BLACKJACK'
            ? 'bg-amber-500/20 text-amber-400 border-2 border-amber-400 animate-bounce'
            : isWin
            ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-400'
            : isLoss
            ? 'bg-rose-500/20 text-rose-400 border-2 border-rose-400'
            : 'bg-amber-500/20 text-amber-300 border-2 border-amber-300'
        }`}>
          {result === 'BLACKJACK' ? (
            <Sparkles size={40} />
          ) : isWin ? (
            <Trophy size={40} />
          ) : isLoss ? (
            <Frown size={40} />
          ) : (
            <Equal size={40} />
          )}
        </div>

        {/* Title */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
            {result === 'BLACKJACK'
              ? 'BLACKJACK'
              : isWin
              ? 'VICTOIRE'
              : isLoss
              ? 'DÉFAITE'
              : 'ÉGALITÉ (PUSH)'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Joueur : {playerScore} — Croupier : {dealerScore}
          </p>
        </div>

        {/* Financial Details */}
        <div className="w-full bg-slate-950/60 rounded-2xl p-4 border border-slate-800 flex flex-col gap-2 text-sm">
          <div className="flex justify-between items-center text-slate-400">
            <span>Mise initiale :</span>
            <span className="font-bold text-slate-200">{gameState.bet} CR</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Gain net :</span>
            <span className={`font-black text-base ${gameState.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {gameState.netProfit >= 0 ? `+${gameState.netProfit}` : gameState.netProfit} CR
            </span>
          </div>
          <div className="h-px bg-slate-800 my-1"></div>
          <div className="flex justify-between items-center text-slate-200 font-semibold">
            <span>Nouveau solde :</span>
            <span className="font-extrabold text-amber-400 text-lg flex items-center gap-1">
              <Coins size={18} />
              {profile?.credits || 0} CR
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 w-full mt-2">
          {/* Main Replay */}
          <button
            onClick={handleReplay}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-base shadow-lg hover:from-amber-400 hover:to-yellow-400 active:scale-98 transition flex items-center justify-center gap-2"
          >
            <RefreshCw size={20} />
            REJOUER ({gameState.bet} CR)
          </button>

          {/* Change Bet Button */}
          <button
            onClick={handleNewBet}
            className="w-full py-3 rounded-2xl bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-md"
          >
            <Coins size={18} />
            CHANGER DE MISE / NOUVELLE MISE
          </button>

          {/* Secondary Row: Analysis + Home */}
          <div className="flex items-center gap-2 w-full">
            <button
              onClick={() => openAnalysis()}
              className="flex-1 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 font-bold text-xs transition flex items-center justify-center gap-1.5"
            >
              <BarChart2 size={16} className="text-amber-400" />
              ANALYSER LA MAIN
            </button>

            <button
              onClick={handleHome}
              className="flex-1 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 font-bold text-xs transition flex items-center justify-center gap-1.5"
            >
              <Home size={16} />
              MENU PRINCIPAL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

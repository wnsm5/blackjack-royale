import React, { useState } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { useAuthStore } from '../stores/useAuthStore';
import { HandDisplay } from '../components/HandDisplay';
import { GameResultBanner } from '../components/GameResultBanner';
import { AnalysisModal } from '../components/AnalysisModal';
import { DailyRewardModal } from '../components/DailyRewardModal';
import { FailsafeModal } from '../components/FailsafeModal';
import { 
  Play, Hand, Layers, ShieldAlert, Flag, Coins, Gift, LifeBuoy, 
  RotateCcw, Dices, Award, User, BarChart2, Check, X
} from 'lucide-react';

const CHIP_VALUES = [25, 50, 100, 250, 500];

export const DedicatedMobileApp: React.FC = () => {
  const { 
    gameState, error, currentBet, setBet, createGame, 
    hit, stand, double, split, surrender, insurance, isLoading 
  } = useGameStore();

  const { profile } = useAuthStore();
  const [isDailyOpen, setIsDailyOpen] = useState(false);
  const [isFailsafeOpen, setIsFailsafeOpen] = useState(false);

  const credits = profile?.credits ?? 0;
  const isPlaying = gameState && gameState.status !== 'FINISHED';
  const activeHand = gameState?.hands[gameState.activeHandIndex];

  return (
    <div className="fixed inset-0 w-screen h-[100dvh] bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden select-none font-sans">
      
      {/* ==========================================
          1. HEADER NATIVE MOBILE (Safe Area Top)
         ========================================== */}
      <header className="w-full bg-slate-900/90 border-b border-slate-800/80 px-3 py-2 pt-safe flex items-center justify-between shrink-0 z-30 shadow-md">
        {/* Logo / Title */}
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black text-sm shadow">
            ♠
          </div>
          <span className="font-extrabold text-sm text-amber-400">Blackjack</span>
        </div>

        {/* Bankroll badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-amber-500/40 text-amber-400 text-xs font-black shadow-inner">
          <Coins size={14} />
          <span>{credits.toLocaleString()} CR</span>
        </div>

        {/* Bonus / Relief */}
        {credits === 0 ? (
          <button
            onClick={() => setIsFailsafeOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-600 text-white text-xs font-black animate-pulse"
          >
            <LifeBuoy size={13} />
            <span>+1000</span>
          </button>
        ) : (
          <button
            onClick={() => setIsDailyOpen(true)}
            className="p-1.5 rounded-full bg-slate-800 text-amber-400 border border-amber-500/30"
          >
            <Gift size={16} />
          </button>
        )}
      </header>

      {/* Error alert toast */}
      {error && (
        <div className="mx-3 mt-1 px-3 py-1 rounded-lg bg-rose-900/90 border border-rose-600 text-rose-100 text-xs font-bold text-center shrink-0 z-40">
          {error}
        </div>
      )}

      {/* ==========================================
          2. CASINO FELT GAMEPLAY AREA (CENTRAL)
         ========================================== */}
      <main className="flex-1 w-full casino-felt flex flex-col items-center justify-between p-2 relative overflow-hidden">
        
        {/* Game status info */}
        {gameState && (
          <div className="w-full flex items-center justify-between px-2 text-[11px] font-bold text-emerald-200/90 z-10">
            <span className="bg-slate-950/60 px-2 py-0.5 rounded-md border border-slate-800">
              Sabot: {gameState.deckRemainingCount} cartes
            </span>
            <span className="bg-slate-950/60 px-2 py-0.5 rounded-md border border-amber-500/40 text-amber-400 flex items-center gap-1">
              Mise: {gameState.bet} CR
            </span>
          </div>
        )}

        {/* Felt content */}
        <div className="flex-1 w-full flex flex-col items-center justify-center gap-2 my-auto">
          {/* Dealer Hand */}
          {gameState ? (
            <HandDisplay
              title="Croupier"
              cards={gameState.dealerHand.cards}
              score={gameState.dealerHand.score}
              isSoft={gameState.dealerHand.isSoft}
              isBust={gameState.dealerHand.isBust}
              cardDelayOffset={0.35}
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-emerald-300/80 my-auto">
              <Dices size={36} className="animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest">Choisissez votre mise</span>
            </div>
          )}

          {/* Player Hand(s) */}
          {gameState && (
            <div className="flex justify-center gap-2 w-full">
              {gameState.hands.map((hand, idx) => (
                <HandDisplay
                  key={hand.id}
                  title={gameState.hands.length > 1 ? `Main ${idx + 1}` : 'Joueur'}
                  cards={hand.cards}
                  score={hand.score}
                  isSoft={hand.isSoft}
                  isBust={hand.status === 'BUST'}
                  isActive={idx === gameState.activeHandIndex && !!isPlaying}
                  bet={hand.bet}
                  result={hand.result}
                  cardDelayOffset={0.0}
                />
              ))}
            </div>
          )}

          <GameResultBanner />
        </div>
      </main>

      {/* ==========================================
          3. CONTROLS DE JEU DÉDIÉS SUR-MESURE MOBILE
         ========================================== */}
      <footer className="w-full bg-slate-950 border-t border-slate-800/80 p-2.5 shrink-0 z-30">
        
        {/* --- STATE A: INSURANCE OFFER --- */}
        {gameState?.status === 'INSURANCE_OFFER' ? (
          <div className="flex flex-col items-center gap-2 bg-slate-900 p-3 rounded-xl border border-amber-500/40">
            <span className="text-xs font-bold text-amber-400">Assurance contre le Blackjack ?</span>
            <div className="flex gap-2 w-full">
              <button
                onClick={() => insurance(true)}
                disabled={isLoading}
                className="flex-1 py-3 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1"
              >
                <Check size={16} /> OUI
              </button>
              <button
                onClick={() => insurance(false)}
                disabled={isLoading}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center gap-1"
              >
                <X size={16} /> NON
              </button>
            </div>
          </div>
        ) : isPlaying && activeHand ? (
          /* --- STATE B: PLAYING ACTIONS (TIRER, RESTER, DOUBLER, SPLIT) --- */
          <div className="flex flex-col gap-2 w-full">
            {/* Primary Action Buttons (BIG TARGETS) */}
            <div className="grid grid-cols-2 gap-2 w-full">
              <button
                onClick={hit}
                disabled={!activeHand.canHit || isLoading}
                className="py-4 rounded-xl bg-emerald-600 text-white font-black text-base shadow-lg active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-20"
              >
                <Play size={20} fill="currentColor" />
                TIRER
              </button>

              <button
                onClick={stand}
                disabled={!activeHand.canStand || isLoading}
                className="py-4 rounded-xl bg-rose-600 text-white font-black text-base shadow-lg active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-20"
              >
                <Hand size={20} />
                RESTER
              </button>
            </div>

            {/* Secondary Action Buttons (DOUBLER / SPLIT / SURRENDER) */}
            {(activeHand.canDouble || activeHand.canSplit || activeHand.canSurrender) && (
              <div className="flex gap-2 w-full">
                {activeHand.canDouble && (
                  <button
                    onClick={double}
                    disabled={isLoading}
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1 active:scale-95"
                  >
                    <Layers size={14} /> DOUBLER
                  </button>
                )}

                {activeHand.canSplit && (
                  <button
                    onClick={split}
                    disabled={isLoading}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center gap-1 active:scale-95"
                  >
                    <ShieldAlert size={14} /> SPLIT
                  </button>
                )}

                {activeHand.canSurrender && (
                  <button
                    onClick={surrender}
                    disabled={isLoading}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs flex items-center justify-center gap-1 active:scale-95"
                  >
                    <Flag size={14} /> ABANDON
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          /* --- STATE C: BETTING PANEL (JETONS + BOUTON DISTRIBUER) --- */
          <div className="flex flex-col gap-2 w-full">
            {/* Jetons de casino en 1 ligne */}
            <div className="flex justify-between items-center gap-1 w-full overflow-x-auto py-0.5">
              <button
                onClick={() => setBet(Math.min(25, credits))}
                disabled={isLoading}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 active:scale-95"
              >
                <RotateCcw size={16} />
              </button>

              {CHIP_VALUES.map((val) => (
                <button
                  key={val}
                  onClick={() => setBet(Math.min(credits, currentBet + val))}
                  disabled={currentBet + val > credits || isLoading}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-300 font-black text-xs shadow active:scale-95 disabled:opacity-30"
                >
                  +{val}
                </button>
              ))}

              <button
                onClick={() => setBet(credits)}
                disabled={credits <= 0 || isLoading}
                className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-xs shadow active:scale-95"
              >
                MAX
              </button>
            </div>

            {/* Bouton Distribuer */}
            <button
              onClick={createGame}
              disabled={currentBet <= 0 || currentBet > credits || isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-base shadow-xl active:scale-98 transition flex items-center justify-center gap-2 disabled:opacity-30"
            >
              <Play size={18} fill="currentColor" />
              <span>DISTRIBUER ({currentBet} CR)</span>
            </button>
          </div>
        )}
      </footer>

      {/* Modals */}
      <AnalysisModal />
      <DailyRewardModal isOpen={isDailyOpen} onClose={() => setIsDailyOpen(false)} />
      <FailsafeModal isOpen={isFailsafeOpen} onClose={() => setIsFailsafeOpen(false)} />
    </div>
  );
};

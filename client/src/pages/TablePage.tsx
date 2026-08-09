import React, { useState } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { useAuthStore } from '../stores/useAuthStore';
import { HandDisplay } from '../components/HandDisplay';
import { BettingPanel } from '../components/BettingPanel';
import { ActionButtons } from '../components/ActionButtons';
import { GameResultBanner } from '../components/GameResultBanner';
import { DeckPile } from '../components/DeckPile';
import { AnalysisModal } from '../components/AnalysisModal';
import { DailyRewardModal } from '../components/DailyRewardModal';
import { FailsafeModal } from '../components/FailsafeModal';
import { Gift, LifeBuoy, Dices, Coins } from 'lucide-react';

export const TablePage: React.FC = () => {
  const { gameState, error } = useGameStore();
  const { profile } = useAuthStore();

  const [isDailyOpen, setIsDailyOpen] = useState(false);
  const [isFailsafeOpen, setIsFailsafeOpen] = useState(false);

  const credits = profile?.credits ?? 0;
  const isPlaying = gameState && gameState.status !== 'FINISHED';
  const activeHand = gameState?.hands[gameState.activeHandIndex];

  const deckRemaining = gameState?.deckRemainingCount ?? 312;

  return (
    <div className="relative min-h-[calc(100vh-65px)] casino-felt flex flex-col justify-between items-center p-4 pb-24 md:pb-8 overflow-x-hidden">
      
      {/* Table Top Bar / Quick Rewards */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10">
        <button
          onClick={() => setIsDailyOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/70 border border-amber-500/40 text-amber-400 text-xs font-bold shadow-lg hover:scale-105 transition"
        >
          <Gift size={15} />
          <span>Bonus Quotidien</span>
        </button>

        {/* Center Shoe / Deck Info */}
        {gameState && (
          <div className="flex items-center gap-3 text-xs font-semibold text-emerald-200/80 bg-slate-950/50 px-4 py-1.5 rounded-full border border-emerald-900/60 shadow-md">
            {gameState.deckWasReshuffled && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 font-black animate-pulse text-[10px] uppercase tracking-widest">
                Sabot mélangé
              </span>
            )}
            <span>Sabot : {gameState.deckRemainingCount} / {6 * 52} cartes</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Coins size={14} className="text-amber-400" />
              Mise : {gameState.bet} CR
            </span>
          </div>
        )}

        {credits === 0 ? (
          <button
            onClick={() => setIsFailsafeOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-600/90 border border-rose-400 text-white text-xs font-black shadow-lg animate-bounce"
          >
            <LifeBuoy size={15} />
            <span>Bankroll Vide (+1000 CR)</span>
          </button>
        ) : (
          <div className="w-24"></div>
        )}
      </div>

      {error && (
        <div className="z-20 my-2 px-4 py-2 rounded-xl bg-rose-950/90 border border-rose-600 text-rose-200 text-xs font-bold text-center shadow-xl">
          {error}
        </div>
      )}

      {/* Main Table Felt Area */}
      <div className="w-full max-w-4xl flex flex-col items-center justify-center gap-4 my-auto py-2 z-10 relative">
        
        {/* Shoe Stack / Deck Pile Positioned on the Right Side of Table */}
        <div className="absolute right-0 top-0 hidden sm:block z-20">
          <DeckPile remainingCount={deckRemaining} />
        </div>

        {/* Dealer Area (Card 1 at 0.35s, Card 2 at 1.05s) */}
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
          <div className="text-center p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60 flex items-center gap-2 text-emerald-300">
            <Dices size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">
              Placez votre mise pour commencer
            </span>
          </div>
        )}

        {/* Player Hands Area (Card 1 at 0.0s, Card 2 at 0.7s) */}
        {gameState && (
          <div className="flex flex-wrap justify-center gap-4 w-full">
            {gameState.hands.map((hand, idx) => (
              <HandDisplay
                key={hand.id}
                title={gameState.hands.length > 1 ? `Main #${idx + 1}` : 'Joueur'}
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

        {/* Game Result Banner (shows result & gain inline without blocking betting chips) */}
        <GameResultBanner />

        {/* Action Controls / Betting Controls — ALWAYS visible when not playing so player can bet directly */}
        <div className="w-full flex justify-center mt-2">
          {!isPlaying ? (
            <BettingPanel />
          ) : (
            <ActionButtons
              activeHand={activeHand}
              isInsuranceOffer={gameState.status === 'INSURANCE_OFFER'}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <AnalysisModal />
      <DailyRewardModal isOpen={isDailyOpen} onClose={() => setIsDailyOpen(false)} />
      <FailsafeModal isOpen={isFailsafeOpen} onClose={() => setIsFailsafeOpen(false)} />
    </div>
  );
};

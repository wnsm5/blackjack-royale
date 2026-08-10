import React, { useState } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { useAuthStore } from '../stores/useAuthStore';
import { HandDisplay } from '../components/HandDisplay';
import { BettingPanel } from '../components/BettingPanel';
import { ActionButtons } from '../components/ActionButtons';
import { GameResultBanner } from '../components/GameResultBanner';
import { AnalysisModal } from '../components/AnalysisModal';
import { DailyRewardModal } from '../components/DailyRewardModal';
import { FailsafeModal } from '../components/FailsafeModal';
import { Gift, LifeBuoy, Coins } from 'lucide-react';

export const TablePage: React.FC = () => {
  const { gameState, error } = useGameStore();
  const { profile } = useAuthStore();

  const [isDailyOpen, setIsDailyOpen] = useState(false);
  const [isFailsafeOpen, setIsFailsafeOpen] = useState(false);

  const credits = profile?.credits ?? 0;
  const isPlaying = gameState && gameState.status !== 'FINISHED';
  const activeHand = gameState?.hands[gameState.activeHandIndex];

  return (
    <div className="relative h-[calc(100vh-60px-65px)] casino-felt flex flex-col justify-between items-center p-3 pb-4 overflow-hidden select-none">
      
      {/* Top Header info bar */}
      <div className="w-full flex items-center justify-between z-10 gap-2">
        <button
          onClick={() => setIsDailyOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 border border-amber-500/40 text-amber-400 text-[11px] font-bold shadow active:scale-95 transition"
        >
          <Gift size={13} />
          <span>Bonus</span>
        </button>

        {gameState && (
          <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-200/90 bg-slate-950/70 px-3 py-1 rounded-full border border-emerald-900/60 shadow">
            <span>Sabot: {gameState.deckRemainingCount}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-amber-400">
              <Coins size={12} />
              {gameState.bet} CR
            </span>
          </div>
        )}

        {credits === 0 ? (
          <button
            onClick={() => setIsFailsafeOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-600 border border-rose-400 text-white text-[11px] font-black shadow animate-pulse"
          >
            <LifeBuoy size={13} />
            <span>+1000 CR</span>
          </button>
        ) : (
          <div className="w-12"></div>
        )}
      </div>

      {error && (
        <div className="z-20 my-1 px-3 py-1 rounded-xl bg-rose-950/90 border border-rose-600 text-rose-200 text-[11px] font-bold text-center">
          {error}
        </div>
      )}

      {/* Felt Playing Area */}
      <div className="w-full flex-1 flex flex-col justify-center items-center gap-3 my-auto z-10 relative max-w-md">
        
        {/* Dealer Area */}
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
          <div className="text-center py-2 px-4 rounded-xl bg-slate-950/50 border border-slate-800 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            Placez votre mise
          </div>
        )}

        {/* Player Hands */}
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

      {/* Fixed Bottom Action / Betting Area */}
      <div className="w-full max-w-md z-20">
        {!isPlaying ? (
          <BettingPanel />
        ) : (
          <ActionButtons
            activeHand={activeHand}
            isInsuranceOffer={gameState.status === 'INSURANCE_OFFER'}
          />
        )}
      </div>

      {/* Modals */}
      <AnalysisModal />
      <DailyRewardModal isOpen={isDailyOpen} onClose={() => setIsDailyOpen(false)} />
      <FailsafeModal isOpen={isFailsafeOpen} onClose={() => setIsFailsafeOpen(false)} />
    </div>
  );
};

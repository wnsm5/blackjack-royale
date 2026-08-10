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

export const MobileTablePage: React.FC = () => {
  const { gameState, error } = useGameStore();
  const { profile } = useAuthStore();

  const [isDailyOpen, setIsDailyOpen] = useState(false);
  const [isFailsafeOpen, setIsFailsafeOpen] = useState(false);

  const credits = profile?.credits ?? 0;
  const isPlaying = gameState && gameState.status !== 'FINISHED';
  const activeHand = gameState?.hands[gameState.activeHandIndex];

  return (
    <div className="flex flex-col h-full casino-felt p-2 justify-between items-center select-none overflow-hidden pb- safe">
      
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between px-3 py-1 bg-slate-950/80 rounded-xl border border-slate-800/80 shrink-0">
        <button
          onClick={() => setIsDailyOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold"
        >
          <Gift size={13} />
          <span>Bonus</span>
        </button>

        {gameState ? (
          <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-200">
            <span>Sabot: {gameState.deckRemainingCount}</span>
            <span>•</span>
            <span className="flex items-center gap-0.5 text-amber-400">
              <Coins size={12} />
              {gameState.bet} CR
            </span>
          </div>
        ) : (
          <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
            <Coins size={13} />
            {credits.toLocaleString()} CR
          </span>
        )}

        {credits === 0 && (
          <button
            onClick={() => setIsFailsafeOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-black animate-pulse"
          >
            <LifeBuoy size={13} />
            <span>+1000</span>
          </button>
        )}
      </div>

      {error && (
        <div className="my-0.5 px-2 py-0.5 rounded-lg bg-rose-950/90 border border-rose-600 text-rose-200 text-[10px] font-bold text-center shrink-0">
          {error}
        </div>
      )}

      {/* Main Felt Play Area */}
      <div className="flex-1 w-full flex flex-col justify-center items-center gap-2 py-1 overflow-hidden">
        {/* Dealer */}
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
          <div className="py-2.5 px-4 rounded-xl bg-slate-950/60 border border-slate-800 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            Placez votre mise
          </div>
        )}

        {/* Player Hands */}
        {gameState && (
          <div className="flex justify-center gap-1 w-full">
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

      {/* Control Area (Fixed directly above bottom nav) */}
      <div className="w-full shrink-0 mb-1 z-20">
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

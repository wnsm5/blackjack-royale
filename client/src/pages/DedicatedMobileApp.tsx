import React, { useState } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { useAuthStore } from '../stores/useAuthStore';
import { CardComponent } from '../components/CardComponent';
import { CasinoChip } from '../components/CasinoChip';
import { DeckPile } from '../components/DeckPile';
import { GameResultBanner } from '../components/GameResultBanner';
import { AnalysisModal } from '../components/AnalysisModal';
import { DailyRewardModal } from '../components/DailyRewardModal';
import { FailsafeModal } from '../components/FailsafeModal';
import { StatsPage } from './StatsPage';
import { HistoryPage } from './HistoryPage';
import { AchievementsPage } from './AchievementsPage';
import { ChallengesPage } from './ChallengesPage';
import { LearnPage } from './LearnPage';
import { SettingsPage } from './SettingsPage';
import { 
  Play, Hand, Layers, ShieldAlert, Flag, Coins, Gift, LifeBuoy, 
  RotateCcw, Check, X, ArrowLeft, User, BarChart2, History, Award, 
  GraduationCap, Settings, Target, ChevronRight, Dices, Volume2, VolumeX
} from 'lucide-react';

const CHIP_VALUES = [25, 50, 100, 250, 500];

export const DedicatedMobileApp: React.FC = () => {
  const { 
    gameState, error, currentBet, setBet, createGame, 
    hit, stand, double, split, surrender, insurance, isLoading 
  } = useGameStore();

  const { user, profile, logout } = useAuthStore();

  // Navigation tab state: 'HOME' | 'GAME' | 'STATS' | 'HISTORY' | 'ACHIEVEMENTS' | 'CHALLENGES' | 'LEARN' | 'SETTINGS'
  const [activeTab, setActiveTab] = useState<'HOME' | 'GAME' | 'STATS' | 'HISTORY' | 'ACHIEVEMENTS' | 'CHALLENGES' | 'LEARN' | 'SETTINGS'>('HOME');

  const [isDailyOpen, setIsDailyOpen] = useState(false);
  const [isFailsafeOpen, setIsFailsafeOpen] = useState(false);

  // Bet stack state: array of placed chips (e.g. [100, 50, 25])
  const [betChips, setBetChips] = useState<number[]>(() => [currentBet]);

  const credits = profile?.credits ?? 0;
  const isPlaying = gameState && gameState.status !== 'FINISHED';
  const activeHand = gameState?.hands[gameState.activeHandIndex];
  const deckRemaining = gameState?.deckRemainingCount ?? 312;

  // Add chip to bet stack
  const handleAddChip = (val: number) => {
    const currentTotal = betChips.reduce((acc, c) => acc + c, 0);
    if (currentTotal + val <= credits) {
      const newChips = [...betChips, val];
      setBetChips(newChips);
      setBet(currentTotal + val);
    }
  };

  // Remove individual chip from bet stack by index
  const handleRemoveChip = (indexToRemove: number) => {
    const newChips = betChips.filter((_, idx) => idx !== indexToRemove);
    const newTotal = newChips.reduce((acc, c) => acc + c, 0);
    setBetChips(newChips);
    setBet(newTotal);
  };

  // Clear bet stack
  const handleClearChips = () => {
    setBetChips([]);
    setBet(0);
  };

  // Max bet
  const handleMaxChips = () => {
    setBetChips([credits]);
    setBet(credits);
  };

  return (
    <div className="fixed inset-0 w-screen h-[100dvh] bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden select-none font-sans">
      
      {/* ==============================================================
          NAVIGATION VIEW BIFURCATION: SUBCATEGORY VIEWS VS HOME VS GAME
         ============================================================== */}

      {activeTab !== 'HOME' && activeTab !== 'GAME' ? (
        /* SUBCATEGORY CONTAINER (STATS, HISTORY, ACHIEVEMENTS, ETC) */
        <div className="flex-1 w-full flex flex-col overflow-hidden bg-slate-950">
          <header className="w-full bg-slate-900 border-b border-slate-800 px-3 py-2 pt-safe flex items-center justify-between shrink-0">
            <button
              onClick={() => setActiveTab('HOME')}
              className="flex items-center gap-1 text-amber-400 font-bold text-xs bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 active:scale-95"
            >
              <ArrowLeft size={16} />
              <span>Menu</span>
            </button>
            <span className="font-extrabold text-sm uppercase text-slate-200">
              {activeTab === 'STATS' && 'Statistiques'}
              {activeTab === 'HISTORY' && 'Historique'}
              {activeTab === 'ACHIEVEMENTS' && 'Succès'}
              {activeTab === 'CHALLENGES' && 'Défis Quotidiens'}
              {activeTab === 'LEARN' && 'Règles & Guide'}
              {activeTab === 'SETTINGS' && 'Paramètres'}
            </span>
            <button
              onClick={() => setActiveTab('GAME')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs active:scale-95"
            >
              <Play size={14} fill="currentColor" />
              <span>JOUER</span>
            </button>
          </header>

          <main className="flex-1 w-full overflow-y-auto p-3 pb-safe">
            {activeTab === 'STATS' && <StatsPage />}
            {activeTab === 'HISTORY' && <HistoryPage />}
            {activeTab === 'ACHIEVEMENTS' && <AchievementsPage />}
            {activeTab === 'CHALLENGES' && <ChallengesPage />}
            {activeTab === 'LEARN' && <LearnPage />}
            {activeTab === 'SETTINGS' && <SettingsPage />}
          </main>
        </div>
      ) : activeTab === 'HOME' ? (

        /* ==========================================
            VIEW 1: DASHBOARD HOME MOBILE SCREEN
           ========================================== */
        <div className="flex-1 w-full flex flex-col overflow-y-auto bg-slate-950 pt-safe pb-safe px-4 py-3 justify-between">
          
          {/* Top Bar Header */}
          <div className="flex items-center justify-between w-full mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
                ♠
              </div>
              <div>
                <h1 className="font-black text-base text-amber-400 leading-tight">Blackjack Royale</h1>
                <span className="text-[11px] text-slate-400 font-bold">Casino Mobile</span>
              </div>
            </div>

            {/* PROMINENT TOP-RIGHT JOUER BUTTON */}
            <button
              onClick={() => setActiveTab('GAME')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 text-slate-950 font-black text-sm shadow-xl active:scale-95 transition border border-emerald-300 animate-pulse"
            >
              <Play size={16} fill="currentColor" />
              <span>JOUER</span>
            </button>
          </div>

          {/* User Profile Card */}
          <div className="w-full bg-slate-900 border border-slate-800 p-4 rounded-3xl shadow-xl flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                <User size={26} />
              </div>
              <div>
                <h2 className="font-extrabold text-sm text-slate-100">{user?.username || 'Joueur'}</h2>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mt-0.5">
                  <Coins size={14} />
                  <span>{credits.toLocaleString()} CR</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-indigo-400">Niveau {profile?.level ?? 1}</span>
                </div>
              </div>
            </div>

            {credits === 0 && (
              <button
                onClick={() => setIsFailsafeOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-black animate-pulse"
              >
                +1000 CR
              </button>
            )}
          </div>

          {/* Subcategories Grid / Menu */}
          <div className="w-full flex flex-col gap-2.5 my-auto">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Menu & Profil</span>
            
            {/* Row 1: Stats & History */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setActiveTab('STATS')}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 active:scale-95 transition text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <BarChart2 size={18} />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-slate-200 block">Statistiques</span>
                    <span className="text-[10px] text-slate-400">Histogrammes</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-500" />
              </button>

              <button
                onClick={() => setActiveTab('HISTORY')}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 active:scale-95 transition text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    <History size={18} />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-slate-200 block">Historique</span>
                    <span className="text-[10px] text-slate-400">Détail des mains</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-500" />
              </button>
            </div>

            {/* Row 2: Achievements & Challenges */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setActiveTab('ACHIEVEMENTS')}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 active:scale-95 transition text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Award size={18} />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-slate-200 block">Succès</span>
                    <span className="text-[10px] text-slate-400">Trophées & XP</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-500" />
              </button>

              <button
                onClick={() => setActiveTab('CHALLENGES')}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 active:scale-95 transition text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    <Target size={18} />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-slate-200 block">Défis</span>
                    <span className="text-[10px] text-slate-400">Récompenses</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-500" />
              </button>
            </div>

            {/* Row 3: Learn & Settings */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setActiveTab('LEARN')}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 active:scale-95 transition text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <GraduationCap size={18} />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-slate-200 block">Apprendre</span>
                    <span className="text-[10px] text-slate-400">Guide de jeu</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-500" />
              </button>

              <button
                onClick={() => setActiveTab('SETTINGS')}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 active:scale-95 transition text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
                    <Settings size={18} />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-slate-200 block">Paramètres</span>
                    <span className="text-[10px] text-slate-400">Options</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-500" />
              </button>
            </div>
          </div>

          {/* Quick Bonus footer */}
          <div className="mt-4 flex items-center justify-between px-1">
            <button
              onClick={() => setIsDailyOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold"
            >
              <Gift size={16} />
              <span>Bonus Quotidien</span>
            </button>

            <button
              onClick={logout}
              className="text-xs text-slate-500 font-bold hover:text-slate-300"
            >
              Déconnexion
            </button>
          </div>
        </div>

      ) : (

        /* ==========================================
            VIEW 2: FULL TABLE IN-GAME SCREEN
           ========================================== */
        <div className="flex-1 w-full flex flex-col justify-between overflow-hidden bg-slate-950">
          
          {/* Header Bar Game View */}
          <header className="w-full bg-slate-900/90 border-b border-slate-800 px-3 py-2 pt-safe flex items-center justify-between shrink-0 z-30 shadow">
            <button
              onClick={() => setActiveTab('HOME')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700 active:scale-95"
            >
              <ArrowLeft size={16} />
              <span>Menu</span>
            </button>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-amber-500/40 text-amber-400 text-xs font-black shadow-inner">
              <Coins size={14} />
              <span>{credits.toLocaleString()} CR</span>
            </div>

            {credits === 0 && (
              <button
                onClick={() => setIsFailsafeOpen(true)}
                className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-xs font-black animate-pulse"
              >
                +1000
              </button>
            )}
          </header>

          {error && (
            <div className="mx-3 mt-1 px-3 py-1 rounded-lg bg-rose-900/90 border border-rose-600 text-rose-100 text-xs font-bold text-center shrink-0 z-40">
              {error}
            </div>
          )}

          {/* MAIN CASINO FELT GAME AREA */}
          <main className="flex-1 w-full casino-felt flex flex-col items-center justify-between p-2 relative overflow-hidden">
            
            {/* Visual Deck Pile (Sabot 3D) visible on Mobile Table */}
            <div className="absolute right-2 top-2 z-20 scale-75 origin-top-right">
              <DeckPile remainingCount={deckRemaining} />
            </div>

            {/* Game status info */}
            {gameState && (
              <div className="w-full flex items-center justify-start px-2 text-[11px] font-bold text-emerald-200/90 z-10">
                <span className="bg-slate-950/60 px-2 py-0.5 rounded-md border border-slate-800">
                  Sabot: {gameState.deckRemainingCount} cartes
                </span>
              </div>
            )}

            {/* Central felt content */}
            <div className="flex-1 w-full flex flex-col items-center justify-around my-auto">
              
              {/* Dealer Hand */}
              {gameState ? (
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-300 uppercase tracking-wider">Croupier</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-black bg-slate-800 text-amber-300 border border-slate-700">
                      {gameState.dealerHand.isBust
                        ? `BUST (${gameState.dealerHand.score})`
                        : gameState.dealerHand.cards.some(c => !c.faceUp)
                        ? '?'
                        : gameState.dealerHand.score}
                    </span>
                  </div>
                  <div className="flex justify-center -space-x-6 p-1 min-h-[90px] items-center">
                    {gameState.dealerHand.cards.map((card, idx) => (
                      <CardComponent key={card.id || idx} card={card} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-emerald-300/80">
                  <Dices size={32} className="animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest">Placez vos jetons</span>
                </div>
              )}

              {/* Result Banner */}
              <GameResultBanner />

              {/* Player Hand(s) */}
              {gameState && (
                <div className="flex flex-col items-center gap-1">
                  <div className="flex justify-center gap-3 w-full">
                    {gameState.hands.map((hand, idx) => (
                      <div key={hand.id} className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-300 uppercase tracking-wider">
                            {gameState.hands.length > 1 ? `Main ${idx + 1}` : 'Joueur'}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-black border ${
                            hand.status === 'BUST'
                              ? 'bg-rose-600 text-white'
                              : hand.score === 21
                              ? 'bg-amber-400 text-slate-950 font-black'
                              : 'bg-slate-800 text-amber-300 border-slate-700'
                          }`}>
                            {hand.score}
                          </span>
                        </div>
                        <div className="flex justify-center -space-x-6 p-1 min-h-[90px] items-center">
                          {hand.cards.map((card, cIdx) => (
                            <CardComponent key={card.id || cIdx} card={card} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* FOOTER CONTROLS WITH VISUAL BET CHIPS STACK */}
          <footer className="w-full bg-slate-950 border-t border-slate-800/80 p-2.5 shrink-0 z-30 pb-safe">
            
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
              /* ACTION BUTTONS (PLAYING) */
              <div className="flex flex-col gap-2 w-full">
                <div className="grid grid-cols-2 gap-2 w-full">
                  <button
                    onClick={hit}
                    disabled={!activeHand.canHit || isLoading}
                    className="py-3.5 rounded-xl bg-emerald-600 text-white font-black text-base shadow-lg active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-20"
                  >
                    <Play size={20} fill="currentColor" />
                    TIRER
                  </button>

                  <button
                    onClick={stand}
                    disabled={!activeHand.canStand || isLoading}
                    className="py-3.5 rounded-xl bg-rose-600 text-white font-black text-base shadow-lg active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-20"
                  >
                    <Hand size={20} />
                    RESTER
                  </button>
                </div>

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
              /* BETTING PANEL WITH VISUAL PLACED CHIPS STACK & INTERACTIVE SUBTRACTION */
              <div className="flex flex-col gap-2.5 w-full">
                
                {/* VISUAL STACK OF PLACED CHIPS ON THE BETTING SPOT */}
                <div className="flex flex-col items-center gap-1 w-full bg-slate-900/90 border border-amber-500/30 p-2 rounded-2xl">
                  <div className="flex items-center justify-between w-full px-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Mise placée (Appuyez sur un jeton pour le retirer)
                    </span>
                    <button
                      onClick={handleClearChips}
                      className="text-[10px] font-bold text-rose-400 hover:underline flex items-center gap-0.5"
                    >
                      <RotateCcw size={12} /> Réinitialiser
                    </button>
                  </div>

                  {/* Interactively Placed Chips Array */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5 min-h-[44px] py-1 w-full">
                    {betChips.length === 0 ? (
                      <span className="text-xs text-slate-500 italic">Aucun jeton placé</span>
                    ) : (
                      betChips.map((chipVal, index) => (
                        <div
                          key={`${chipVal}_${index}`}
                          onClick={() => handleRemoveChip(index)}
                          className="transform transition hover:scale-110 active:scale-90 cursor-pointer"
                          title="Cliquez pour retirer ce jeton"
                        >
                          <CasinoChip value={chipVal} size="sm" />
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* CHIP SELECTOR BAR */}
                <div className="flex justify-between items-center gap-1 w-full">
                  {CHIP_VALUES.map((val) => (
                    <CasinoChip
                      key={val}
                      value={val}
                      size="sm"
                      onClick={() => handleAddChip(val)}
                      disabled={currentBet + val > credits || isLoading}
                    />
                  ))}

                  <CasinoChip
                    value="MAX"
                    size="sm"
                    onClick={handleMaxChips}
                    disabled={credits <= 0 || isLoading}
                  />
                </div>

                {/* DEAL BUTTON */}
                <button
                  onClick={createGame}
                  disabled={currentBet <= 0 || currentBet > credits || isLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 text-slate-950 font-black text-base shadow-xl active:scale-98 transition flex items-center justify-center gap-2 disabled:opacity-30"
                >
                  <Play size={18} fill="currentColor" />
                  <span>DISTRIBUER ({currentBet} CR)</span>
                </button>
              </div>
            )}
          </footer>
        </div>
      )}

      {/* Modals */}
      <AnalysisModal />
      <DailyRewardModal isOpen={isDailyOpen} onClose={() => setIsDailyOpen(false)} />
      <FailsafeModal isOpen={isFailsafeOpen} onClose={() => setIsFailsafeOpen(false)} />
    </div>
  );
};

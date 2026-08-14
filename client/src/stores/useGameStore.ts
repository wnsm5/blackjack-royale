import { create } from 'zustand';
import api from '../services/api';
import { GameStateDTO } from '../types';
import { soundManager } from '../utils/sound';
import { useAuthStore } from './useAuthStore';
import confetti from 'canvas-confetti';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface GameState {
  gameState: GameStateDTO | null;
  currentBet: number;
  isLoading: boolean;
  isDealerAnimating: boolean;
  error: string | null;
  selectedAnalysis: any | null;
  activeAnalysis: any | null;
  isAnalysisModalOpen: boolean;
  
  setBet: (bet: number) => void;
  createGame: () => Promise<void>;
  hit: () => Promise<void>;
  stand: () => Promise<void>;
  double: () => Promise<void>;
  split: () => Promise<void>;
  surrender: () => Promise<void>;
  insurance: (accept: boolean) => Promise<void>;
  handleGameResult: (state: GameStateDTO) => void;
  openAnalysis: (customAnalysis?: any) => void;
  closeAnalysis: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => {

  const processGameState = async (finalState: GameStateDTO) => {
    const { gameState } = get();

    if (finalState.status === 'FINISHED' && gameState?.dealerHand?.cards) {
      const finalDealerCards = finalState.dealerHand.cards;
      const prevDealerCards = gameState.dealerHand.cards;
      const isHoleCardHidden = prevDealerCards.length >= 2 && !prevDealerCards[1].faceUp;

      // If dealer has cards to reveal or draw, animate sequentially
      if (isHoleCardHidden || finalDealerCards.length > prevDealerCards.length) {
        set({ isDealerAnimating: true, isLoading: false });

        // Step 1: Reveal hole card (2 cards)
        const step1Cards = finalDealerCards.slice(0, 2).map(c => ({ ...c, faceUp: true }));
        soundManager.playCardDraw();
        set({
          gameState: {
            ...finalState,
            status: 'DEALER_TURN' as any,
            dealerHand: { ...finalState.dealerHand, cards: step1Cards },
          },
        });
        await delay(900);

        // Step 2: Draw card 3, 4, etc. sequentially
        for (let i = 3; i <= finalDealerCards.length; i++) {
          const stepICards = finalDealerCards.slice(0, i).map(c => ({ ...c, faceUp: true }));
          soundManager.playCardDraw();
          set({
            gameState: {
              ...finalState,
              status: 'DEALER_TURN' as any,
              dealerHand: { ...finalState.dealerHand, cards: stepICards },
            },
          });
          await delay(900);
        }

        // Finalize state
        set({ gameState: finalState, isDealerAnimating: false });
        get().handleGameResult(finalState);
        return;
      }
    }

    // Default fast update if no dealer animation needed
    set({ gameState: finalState, isLoading: false, isDealerAnimating: false });
    if (finalState.status === 'FINISHED') {
      get().handleGameResult(finalState);
    }
  };

  return {
    gameState: null,
    currentBet: 10,
    isLoading: false,
    isDealerAnimating: false,
    error: null,
    selectedAnalysis: null,
    activeAnalysis: null,
    isAnalysisModalOpen: false,

    setBet: (bet: number) => {
      soundManager.playChipClick();
      set({ currentBet: bet });
    },

    createGame: async () => {
      const { currentBet } = get();
      set({ isLoading: true, error: null, isDealerAnimating: true });
      try {
        const res = await api.post('/game/create', { bet: currentBet });
        const finalState: GameStateDTO = res.data;
        useAuthStore.getState().fetchProfile();

        // 4 Initial Deal Steps: P1 (Joueur) -> D1 (Croupier upcard) -> P2 (Joueur) -> D2 (Croupier holecard)
        const pCards = finalState.hands[0]?.cards || [];
        const dCards = finalState.dealerHand.cards || [];

        // Step 0: Empty table initial state
        const animState: GameStateDTO = {
          ...finalState,
          status: 'PLAYING',
          hands: [{ ...finalState.hands[0], cards: [] }],
          dealerHand: { ...finalState.dealerHand, cards: [] },
        };

        set({ gameState: animState, isLoading: false });
        await delay(300);

        // Step 1: Player Card 1
        if (pCards[0]) {
          soundManager.playCardDraw();
          animState.hands[0].cards = [pCards[0]];
          set({ gameState: { ...animState } });
          await delay(600);
        }

        // Step 2: Dealer Card 1 (Visible)
        if (dCards[0]) {
          soundManager.playCardDraw();
          animState.dealerHand.cards = [dCards[0]];
          set({ gameState: { ...animState } });
          await delay(600);
        }

        // Step 3: Player Card 2
        if (pCards[1]) {
          soundManager.playCardDraw();
          animState.hands[0].cards = [pCards[0], pCards[1]];
          set({ gameState: { ...animState } });
          await delay(600);
        }

        // Step 4: Dealer Card 2 (Holecard)
        if (dCards[1]) {
          soundManager.playCardDraw();
          animState.dealerHand.cards = [dCards[0], dCards[1]];
          set({ gameState: { ...animState } });
          await delay(500);
        }

        // Finalize state
        set({ gameState: finalState, isDealerAnimating: false });

        if (finalState.status === 'FINISHED') {
          get().handleGameResult(finalState);
        }
      } catch (err: any) {
        set({ error: err.response?.data?.error || 'Erreur lors de la création de la partie', isLoading: false, isDealerAnimating: false });
      }
    },

    hit: async () => {
      const { gameState } = get();
      if (!gameState) return;
      set({ isLoading: true, error: null });
      try {
        soundManager.playCardDraw();
        const res = await api.post('/game/hit', { gameId: gameState.id });
        await processGameState(res.data);
      } catch (err: any) {
        set({ error: err.response?.data?.error || 'Action impossible', isLoading: false });
      }
    },

    stand: async () => {
      const { gameState } = get();
      if (!gameState) return;
      set({ isLoading: true, error: null });
      try {
        const res = await api.post('/game/stand', { gameId: gameState.id });
        await processGameState(res.data);
      } catch (err: any) {
        set({ error: err.response?.data?.error || 'Action impossible', isLoading: false });
      }
    },

    double: async () => {
      const { gameState } = get();
      if (!gameState) return;
      set({ isLoading: true, error: null });
      try {
        soundManager.playChipClick();
        soundManager.playCardDraw();
        const res = await api.post('/game/double', { gameId: gameState.id });
        await processGameState(res.data);
      } catch (err: any) {
        set({ error: err.response?.data?.error || 'Impossible de doubler', isLoading: false });
      }
    },

    split: async () => {
      const { gameState } = get();
      if (!gameState) return;
      set({ isLoading: true, error: null });
      try {
        soundManager.playChipClick();
        soundManager.playCardDraw();
        const res = await api.post('/game/split', { gameId: gameState.id });
        await processGameState(res.data);
      } catch (err: any) {
        set({ error: err.response?.data?.error || 'Impossible de séparer', isLoading: false });
      }
    },

    surrender: async () => {
      const { gameState } = get();
      if (!gameState) return;
      set({ isLoading: true, error: null });
      try {
        const res = await api.post('/game/surrender', { gameId: gameState.id });
        await processGameState(res.data);
      } catch (err: any) {
        set({ error: err.response?.data?.error || 'Impossible d\'abandonner', isLoading: false });
      }
    },

    insurance: async (accept: boolean) => {
      const { gameState } = get();
      if (!gameState) return;
      set({ isLoading: true, error: null });
      try {
        if (accept) soundManager.playChipClick();
        const res = await api.post('/game/insurance', { gameId: gameState.id, accept });
        await processGameState(res.data);
      } catch (err: any) {
        set({ error: err.response?.data?.error || 'Action assurance impossible', isLoading: false });
      }
    },

    handleGameResult: (state: GameStateDTO) => {
      useAuthStore.getState().fetchProfile();
      if (state.result === 'BLACKJACK') {
        soundManager.playBlackjack();
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } else if (state.result === 'WIN') {
        soundManager.playWin();
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
      } else if (state.result === 'LOSS') {
        soundManager.playLoss();
      }
    },

    openAnalysis: (customAnalysis?: any) => {
      const { gameState } = get();
      const analysisToUse = customAnalysis || gameState?.analysis || null;
      set({ activeAnalysis: analysisToUse, isAnalysisModalOpen: true });
    },
    closeAnalysis: () => set({ isAnalysisModalOpen: false, activeAnalysis: null }),

    resetGame: () => set({ gameState: null, error: null, isDealerAnimating: false, activeAnalysis: null }),
  };
});

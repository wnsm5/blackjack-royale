import './polyfill';
import { registerRootComponent } from 'expo';
import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import {
  ShoppingBag,
  Home,
  User,
  Play,
  TrendingUp,
  Award,
  Settings,
  HelpCircle,
  ChevronRight,
  LogOut,
  LifeBuoy,
  Layers,
  Zap,
  Repeat,
  Maximize2,
  ShieldAlert,
  BarChart2,
  Coins,
  Palette,
  CheckCircle2,
  Lock,
  Flame,
  Check
} from 'lucide-react-native';

const CHIP_VALUES = [1, 2, 5, 10, 20];

// 10 DOS DE CARTES PERSONNALISÉS (CARD BACK SKINS)
const INITIAL_CARD_BACKS = [
  { id: 'ROUGE_OFFSUIT', name: 'Offsuit Rouge', bg: '#991b1b', innerBg: '#7f1d1d', border: '#e5e5e5', symbol: '♠', price: 0, unlocked: true },
  { id: 'NOIR_CARBONE', name: 'Noir Carbone VIP', bg: '#171717', innerBg: '#262626', border: '#f59e0b', symbol: '♠', price: 50, unlocked: true },
  { id: 'DRAGON_DOR', name: 'Dragon d\'Or', bg: '#b45309', innerBg: '#78350f', border: '#fef08a', symbol: '👑', price: 100, unlocked: false },
  { id: 'BLEU_ROYAL', name: 'Bleu Royal', bg: '#1d4ed8', innerBg: '#1e40af', border: '#bfdbfe', symbol: '♠', price: 100, unlocked: false },
  { id: 'EMERAUDE_VIP', name: 'Émeraude VIP', bg: '#15803d', innerBg: '#166534', border: '#bbf7d0', symbol: '💎', price: 150, unlocked: false },
  { id: 'NEON_RED', name: 'Néon Rouge', bg: '#e11d48', innerBg: '#be123c', border: '#fecdd3', symbol: '⚡', price: 150, unlocked: false },
  { id: 'AMETHYSTE', name: 'Améthyste', bg: '#7e22ce', innerBg: '#6b21a8', border: '#e9d5ff', symbol: '🔮', price: 200, unlocked: false },
  { id: 'GOLDEN_ROYALE', name: 'Or Pur Royale', bg: '#ca8a04', innerBg: '#a16207', border: '#fef08a', symbol: '🏆', price: 250, unlocked: false },
  { id: 'SILVER_MATTE', name: 'Argent Mat', bg: '#475569', innerBg: '#334155', border: '#e2e8f0', symbol: '🛡️', price: 250, unlocked: false },
  { id: 'CYBERPUNK', name: 'Cyberpunk 2077', bg: '#0891b2', innerBg: '#0e7490', border: '#f43f5e', symbol: '🌐', price: 300, unlocked: false },
];

// Custom sleek Casino Chip component
function CasinoChip({ value, onPress, size = 36 }) {
  const chipColors = {
    1: { bg: '#262626', border: '#525252', text: '#ffffff', accent: '#404040' },
    2: { bg: '#8f1d1d', border: '#fca5a5', text: '#ffffff', accent: '#b91c1c' },
    5: { bg: '#15803d', border: '#86efac', text: '#ffffff', accent: '#166534' },
    10: { bg: '#1d4ed8', border: '#93c5fd', text: '#ffffff', accent: '#1e40af' },
    20: { bg: '#b45309', border: '#fde047', text: '#ffffff', accent: '#d97706' },
  }[value] || { bg: '#262626', border: '#525252', text: '#ffffff', accent: '#404040' };

  return (
    <TouchableOpacity
      style={[
        styles.casinoChip,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: chipColors.bg,
          borderColor: chipColors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.chipInnerRing, { borderColor: chipColors.accent, borderRadius: (size - 6) / 2 }]}>
        <Text style={[styles.chipValueText, { color: chipColors.text, fontSize: size < 30 ? 9 : 11 }]}>{value}</Text>
      </View>
    </TouchableOpacity>
  );
}

// Smooth Animated Card Component (Card Slide & Deal Animation)
function AnimatedPlayingCard({ card, compact = false, index = 0, cardSkin = INITIAL_CARD_BACKS[0] }) {
  const dealAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    dealAnim.setValue(0);
    Animated.timing(dealAnim, {
      toValue: 1,
      duration: 280,
      easing: Easing.out(Easing.back(1.1)),
      useNativeDriver: true,
    }).start();
  }, [card.id]);

  const translateY = dealAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-30, 0],
  });

  const scale = dealAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1],
  });

  const cardStyle = compact ? styles.cardFrontCompact : styles.cardFront;
  const wrapperStyle = compact ? styles.cardWrapperCompact : styles.cardWrapper;
  
  const overlapMargin = index > 0 ? (compact ? -20 : -26) : 0;

  return (
    <Animated.View
      style={[
        wrapperStyle,
        {
          marginLeft: overlapMargin,
          opacity: dealAnim,
          transform: [{ translateY }, { scale }],
        },
      ]}
    >
      {card.faceUp ? (
        <View style={cardStyle}>
          <Text style={card.isRed ? (compact ? styles.cardRankRedSmall : styles.cardRankRed) : (compact ? styles.cardRankBlackSmall : styles.cardRankBlack)}>
            {card.rank}
          </Text>
          <Text style={card.isRed ? (compact ? styles.cardSuitRedSmall : styles.cardSuitRed) : (compact ? styles.cardSuitBlackSmall : styles.cardSuitBlack)}>
            {card.suit}
          </Text>
        </View>
      ) : (
        <View style={[compact ? styles.cardBackCompact : styles.cardBack, { backgroundColor: cardSkin.bg, borderColor: cardSkin.border }]}>
          <View style={[styles.cardBackInner, { backgroundColor: cardSkin.innerBg }]}>
            <Text style={compact ? styles.cardBackSymbolSmall : styles.cardBackSymbol}>{cardSkin.symbol}</Text>
          </View>
        </View>
      )}
    </Animated.View>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('HOME'); // 'HOME' | 'GAME' | 'PROFILE'
  const [profileSubSection, setProfileSubSection] = useState(null); // 'STATS' | 'ACHIEVEMENTS' | 'CHALLENGES' | 'CARDBACKS' | 'LEARN' | 'SETTINGS'
  
  const [credits, setCredits] = useState(100);
  const [currentBet, setCurrentBet] = useState(10);
  const [betChips, setBetChips] = useState([]);
  
  // Game Engine state
  const [game, setGame] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const [isDealing, setIsDealing] = useState(false);
  const [hasInsurance, setHasInsurance] = useState(false);

  // Shoe / Pioche state (6 decks = 312 cards)
  const [cardsRemaining, setCardsRemaining] = useState(312);

  // Card Back Skins State (10 total)
  const [cardBackSkins, setCardBackSkins] = useState(INITIAL_CARD_BACKS);
  const [equippedCardBackId, setEquippedCardBackId] = useState('ROUGE_OFFSUIT');

  // Solde history tracking for progression chart
  const [balanceHistory, setBalanceHistory] = useState([100, 110, 100, 120, 110, 130, 125, 140, 100]);

  // Page Transition Animations
  const tabFadeAnim = useRef(new Animated.Value(1)).current;
  const subSectionAnim = useRef(new Animated.Value(1)).current;

  // Leave confirmation modal state
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Daily Challenges State
  const [challenges, setChallenges] = useState([
    { id: 1, title: 'Jouer 5 manches', reward: 25, progress: 4, total: 5, claimed: false },
    { id: 2, title: 'Gagner avec un Double Down', reward: 50, progress: 1, total: 1, claimed: false },
    { id: 3, title: 'Atteindre un solde de 150 CR', reward: 40, progress: 140, total: 150, claimed: false },
  ]);

  // Match History state
  const [history, setHistory] = useState([
    { id: 1, type: 'WIN', bet: 10, payout: +20, score: '20 vs 18', date: 'Aujourd\'hui 22:04' },
    { id: 2, type: 'LOSS', bet: 10, payout: -10, score: '17 vs 19', date: 'Aujourd\'hui 21:58' },
    { id: 3, type: 'WIN', bet: 20, payout: +40, score: '21 vs 20', date: 'Aujourd\'hui 21:45' },
    { id: 4, type: 'BLACKJACK', bet: 10, payout: +25, score: '21 BJ vs 18', date: 'Hier 23:12' },
    { id: 5, type: 'LOSS', bet: 5, payout: -5, score: 'BUST (23)', date: 'Hier 22:50' },
  ]);

  const activeCardSkin = cardBackSkins.find(s => s.id === equippedCardBackId) || cardBackSkins[0];

  // Handle Tab Change with Fade Animation
  const changeTab = (newTab) => {
    if (newTab === activeTab) return;
    Animated.timing(tabFadeAnim, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(newTab);
      setProfileSubSection(null);
      Animated.timing(tabFadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  // Handle Sub-Section Change with Animation
  const changeSubSection = (section) => {
    Animated.timing(subSectionAnim, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      setProfileSubSection(section);
      Animated.timing(subSectionAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  // Helper card generator
  const getRandomCard = (faceUp = true) => {
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
    const rank = ranks[Math.floor(Math.random() * ranks.length)];
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const val = ['J','Q','K'].includes(rank) ? 10 : rank === 'A' ? 11 : parseInt(rank);
    return { rank, suit, val, isRed: suit === '♥' || suit === '♦', faceUp, id: Math.random().toString() };
  };

  const calcScore = (cards) => {
    let score = cards.filter(c => c.faceUp).reduce((a, c) => a + c.val, 0);
    let aces = cards.filter(c => c.faceUp && c.rank === 'A').length;
    while (score > 21 && aces > 0) {
      score -= 10;
      aces -= 1;
    }
    return score;
  };

  // Chip handlers
  const handleAddChip = (val) => {
    if (isDealing) return;
    const total = betChips.reduce((a, c) => a + c, 0);
    if (total + val <= credits) {
      const newChips = [...betChips, val];
      setBetChips(newChips);
      setCurrentBet(total + val);
    }
  };

  const handleRemoveChip = (valToRemove) => {
    if (isDealing) return;
    const idx = betChips.indexOf(valToRemove);
    if (idx !== -1) {
      const newChips = betChips.filter((_, i) => i !== idx);
      setBetChips(newChips);
      setCurrentBet(newChips.reduce((a, c) => a + c, 0));
    }
  };

  const handleClearChips = () => {
    if (isDealing) return;
    setBetChips([]);
    setCurrentBet(0);
  };

  // MISE MAX
  const handleMaxBet = () => {
    if (isDealing || credits <= 0) return;
    setCurrentBet(credits);
    setBetChips([credits]);
  };

  // Claim Failsafe 100 Credits
  const handleClaimFailsafe = () => {
    setCredits(100);
    setBalanceHistory(prev => [...prev, 100]);
  };

  // Unlock Card Back
  const handleUnlockCardBack = (skin) => {
    if (skin.unlocked) {
      setEquippedCardBackId(skin.id);
    } else if (credits >= skin.price) {
      setCredits(prev => prev - skin.price);
      setCardBackSkins(prev => prev.map(s => s.id === skin.id ? { ...s, unlocked: true } : s));
      setEquippedCardBackId(skin.id);
    }
  };

  // Claim Challenge Reward
  const handleClaimChallenge = (chId) => {
    const ch = challenges.find(c => c.id === chId);
    if (ch && !ch.claimed && ch.progress >= ch.total) {
      setCredits(prev => prev + ch.reward);
      setChallenges(prev => prev.map(c => c.id === chId ? { ...c, claimed: true } : c));
    }
  };

  // Confirm leave table action
  const handleConfirmLeaveTable = () => {
    setShowLeaveModal(false);
    
    if (game && game.status === 'PLAYING') {
      setHistory(prev => [{ id: Date.now(), type: 'LOSS', bet: game.bet, payout: -game.bet, score: 'ABANDON', date: 'À l\'instant' }, ...prev]);
    }
    
    setGame(null);
    setGameResult(null);
    setIsDealing(false);
    setHasInsurance(false);
    setBetChips([]);
    setCurrentBet(10);
    changeTab('HOME');
  };

  // Game Engine - Start Game
  const handleStartGame = () => {
    if (currentBet <= 0 || currentBet > credits || isDealing) return;
    
    setIsDealing(true);
    setGameResult(null);
    setHasInsurance(false);
    setCredits(prev => prev - currentBet);

    const p1 = getRandomCard(true);
    const d1 = getRandomCard(true);
    const p2 = getRandomCard(true);
    const d2 = getRandomCard(false);

    setGame({
      playerHand: [p1],
      dealerHand: [],
      playerScore: calcScore([p1]),
      dealerScore: 0,
      status: 'PLAYING',
      bet: currentBet,
      isSplit: false,
      splitHands: [],
      splitScores: [],
      activeSplitIndex: 0,
    });

    setTimeout(() => {
      setGame(prev => ({
        ...prev,
        dealerHand: [d1],
        dealerScore: calcScore([d1]),
      }));

      setTimeout(() => {
        setGame(prev => ({
          ...prev,
          playerHand: [p1, p2],
          playerScore: calcScore([p1, p2]),
        }));

        setTimeout(() => {
          setGame(prev => ({
            ...prev,
            dealerHand: [d1, d2],
          }));
          setCardsRemaining(prev => Math.max(10, prev - 4));
          setIsDealing(false);
        }, 350);

      }, 350);

    }, 350);
  };

  // Take Insurance
  const handleTakeInsurance = () => {
    if (!game || game.status !== 'PLAYING' || hasInsurance || credits < game.bet / 2) return;
    const insuranceCost = Math.floor(game.bet / 2);
    setCredits(prev => prev - insuranceCost);
    setHasInsurance(true);
  };

  // Hit Action
  const handleHit = () => {
    if (!game || game.status !== 'PLAYING' || isDealing) return;

    setIsDealing(true);
    const newCard = getRandomCard(true);
    setCardsRemaining(prev => Math.max(10, prev - 1));

    if (game.isSplit) {
      const activeIdx = game.activeSplitIndex;
      const currentHand = [...game.splitHands[activeIdx], newCard];
      const newScore = calcScore(currentHand);

      const newSplitHands = [...game.splitHands];
      newSplitHands[activeIdx] = currentHand;

      const newSplitScores = [...game.splitScores];
      newSplitScores[activeIdx] = newScore;

      setGame({
        ...game,
        splitHands: newSplitHands,
        splitScores: newSplitScores,
      });

      setTimeout(() => {
        setIsDealing(false);
        if (newScore > 21) {
          if (activeIdx === 0) {
            setGame(prev => ({ ...prev, activeSplitIndex: 1 }));
          } else {
            finishSplitGame(newSplitHands, newSplitScores);
          }
        }
      }, 350);
    } else {
      const updatedHand = [...game.playerHand, newCard];
      const score = calcScore(updatedHand);

      setGame({
        ...game,
        playerHand: updatedHand,
        playerScore: score,
      });

      setTimeout(() => {
        setIsDealing(false);
        if (score > 21) {
          setGame(prev => ({ ...prev, status: 'FINISHED' }));
          setGameResult('BUST - PERDU !');
          setHistory(prev => [{ id: Date.now(), type: 'LOSS', bet: game.bet, payout: -game.bet, score: `BUST (${score})`, date: 'À l\'instant' }, ...prev]);
          setBalanceHistory(prev => [...prev, credits]);
        }
      }, 350);
    }
  };

  // Double Down Action
  const handleDouble = () => {
    if (!game || game.status !== 'PLAYING' || credits < game.bet || game.playerHand.length !== 2 || isDealing) return;

    setIsDealing(true);
    const additionalBet = game.bet;
    const totalBet = game.bet * 2;
    setCredits(prev => prev - additionalBet);

    const newCard = getRandomCard(true);
    setCardsRemaining(prev => Math.max(10, prev - 1));

    const updatedHand = [...game.playerHand, newCard];
    const pScore = calcScore(updatedHand);

    setGame({
      ...game,
      playerHand: updatedHand,
      playerScore: pScore,
      bet: totalBet,
    });

    setTimeout(() => {
      if (pScore > 21) {
        setIsDealing(false);
        setGame(prev => ({ ...prev, status: 'FINISHED' }));
        setGameResult('DOUBLE BUST - PERDU !');
        setHistory(prev => [{ id: Date.now(), type: 'LOSS', bet: totalBet, payout: -totalBet, score: `BUST (${pScore})`, date: 'À l\'instant' }, ...prev]);
        setBalanceHistory(prev => [...prev, credits - additionalBet]);
      } else {
        executeDealerTurnStepByStep(updatedHand, pScore, totalBet);
      }
    }, 500);
  };

  // Split Action
  const handleSplit = () => {
    if (!game || game.status !== 'PLAYING' || credits < game.bet || game.playerHand.length !== 2 || isDealing) return;
    if (game.playerHand[0].val !== game.playerHand[1].val) return;

    setIsDealing(true);
    setCredits(prev => prev - game.bet);
    setCardsRemaining(prev => Math.max(10, prev - 2));

    const card1 = game.playerHand[0];
    const card2 = game.playerHand[1];
    const newCard1 = getRandomCard(true);
    const newCard2 = getRandomCard(true);

    const hand1 = [card1, newCard1];
    const hand2 = [card2, newCard2];

    setGame({
      ...game,
      isSplit: true,
      splitHands: [hand1, hand2],
      splitScores: [calcScore(hand1), calcScore(hand2)],
      activeSplitIndex: 0,
      bet: game.bet * 2,
    });

    setTimeout(() => {
      setIsDealing(false);
    }, 400);
  };

  // Stand Action
  const handleStand = () => {
    if (!game || game.status !== 'PLAYING' || isDealing) return;

    if (game.isSplit) {
      if (game.activeSplitIndex === 0) {
        setGame({ ...game, activeSplitIndex: 1 });
      } else {
        finishSplitGame(game.splitHands, game.splitScores);
      }
    } else {
      executeDealerTurnStepByStep(game.playerHand, game.playerScore, game.bet);
    }
  };

  // Step-by-step Dealer Turn
  const executeDealerTurnStepByStep = (pHand, pScore, betAmount) => {
    setIsDealing(true);

    let updatedDealerHand = game.dealerHand.map(c => ({ ...c, faceUp: true }));
    let dScore = calcScore(updatedDealerHand);

    setGame(prev => ({
      ...prev,
      dealerHand: updatedDealerHand,
      dealerScore: dScore,
    }));

    const drawNextDealerCard = (currentHand) => {
      let score = calcScore(currentHand);
      if (score < 17) {
        setTimeout(() => {
          const nextCard = getRandomCard(true);
          const nextHand = [...currentHand, nextCard];
          setCardsRemaining(prev => Math.max(10, prev - 1));

          setGame(prev => ({
            ...prev,
            dealerHand: nextHand,
            dealerScore: calcScore(nextHand),
          }));

          drawNextDealerCard(nextHand);
        }, 600);
      } else {
        setTimeout(() => {
          let finalDScore = calcScore(currentHand);
          let result = '';
          let winAmount = 0;
          let type = 'LOSS';

          let finalCredits = credits;

          if (finalDScore > 21 || pScore > finalDScore) {
            result = 'GAGNÉ !';
            type = 'WIN';
            winAmount = betAmount * 2;
            finalCredits += winAmount;
            setCredits(prev => prev + winAmount);
          } else if (pScore === finalDScore) {
            result = 'ÉGALITÉ !';
            type = 'PUSH';
            winAmount = betAmount;
            finalCredits += winAmount;
            setCredits(prev => prev + winAmount);
          } else {
            result = 'PERDU !';
            type = 'LOSS';
          }

          if (hasInsurance && currentHand.length === 2 && finalDScore === 21) {
            const insurancePayout = game.bet;
            setCredits(prev => prev + insurancePayout);
            finalCredits += insurancePayout;
            result += ' (ASSURANCE PAYÉE !)';
          }

          setGame(prev => ({ ...prev, status: 'FINISHED' }));
          setGameResult(result);
          setHistory(prev => [{ id: Date.now(), type, bet: betAmount, payout: type === 'WIN' ? +betAmount : type === 'PUSH' ? 0 : -betAmount, score: `${pScore} vs ${finalDScore}`, date: 'À l\'instant' }, ...prev]);
          setBalanceHistory(prev => [...prev, finalCredits]);
          setIsDealing(false);
        }, 400);
      }
    };

    setTimeout(() => {
      drawNextDealerCard(updatedDealerHand);
    }, 550);
  };

  // Finish Split Game Step-by-Step
  const finishSplitGame = (splitHands, splitScores) => {
    setIsDealing(true);
    let updatedDealerHand = game.dealerHand.map(c => ({ ...c, faceUp: true }));
    let dScore = calcScore(updatedDealerHand);

    setGame(prev => ({
      ...prev,
      dealerHand: updatedDealerHand,
      dealerScore: dScore,
    }));

    const drawNextDealerCardSplit = (currentHand) => {
      let score = calcScore(currentHand);
      if (score < 17) {
        setTimeout(() => {
          const nextCard = getRandomCard(true);
          const nextHand = [...currentHand, nextCard];
          setCardsRemaining(prev => Math.max(10, prev - 1));

          setGame(prev => ({
            ...prev,
            dealerHand: nextHand,
            dealerScore: calcScore(nextHand),
          }));

          drawNextDealerCardSplit(nextHand);
        }, 600);
      } else {
        setTimeout(() => {
          let finalDScore = calcScore(currentHand);
          const singleBet = game.bet / 2;
          let totalPayout = 0;

          splitScores.forEach((sScore) => {
            if (sScore <= 21) {
              if (finalDScore > 21 || sScore > finalDScore) {
                totalPayout += singleBet * 2;
              } else if (sScore === finalDScore) {
                totalPayout += singleBet;
              }
            }
          });

          const netProfit = totalPayout - game.bet;
          let resultBanner = netProfit > 0 ? `SPLIT GAGNÉ (+${netProfit} CR)` : netProfit === 0 ? 'SPLIT ÉGALITÉ' : 'SPLIT PERDU';
          
          const newTotalCredits = credits + totalPayout;
          setCredits(newTotalCredits);
          setGame(prev => ({ ...prev, status: 'FINISHED' }));
          setGameResult(resultBanner);
          setHistory(prev => [{ id: Date.now(), type: netProfit >= 0 ? 'WIN' : 'LOSS', bet: game.bet, payout: netProfit, score: `H1:${splitScores[0]} H2:${splitScores[1]} vs ${finalDScore}`, date: 'À l\'instant' }, ...prev]);
          setBalanceHistory(prev => [...prev, newTotalCredits]);
          setIsDealing(false);
        }, 400);
      }
    };

    setTimeout(() => {
      drawNextDealerCardSplit(updatedDealerHand);
    }, 550);
  };

  // Re-deal / Clear round action
  const handleResetRound = () => {
    setGame(null);
    setGameResult(null);
    setIsDealing(false);
    setHasInsurance(false);
  };

  const canDouble = game && game.status === 'PLAYING' && !game.isSplit && game.playerHand.length === 2 && credits >= game.bet && !isDealing;
  const canSplit = game && game.status === 'PLAYING' && !game.isSplit && game.playerHand.length === 2 && (game.playerHand[0].val === game.playerHand[1].val) && credits >= game.bet && !isDealing;
  const canInsurance = game && game.status === 'PLAYING' && game.dealerHand.length >= 1 && game.dealerHand[0].rank === 'A' && !hasInsurance && credits >= Math.floor(game.bet / 2) && !isDealing;

  const chipCounts = betChips.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      {/* HEADER DE TABLE SEULEMENT EN JEU */}
      {activeTab === 'GAME' && (
        <View style={styles.header}>
          <TouchableOpacity style={styles.leaveHeaderBtn} onPress={() => setShowLeaveModal(true)}>
            <LogOut size={16} color="#f43f5e" />
            <Text style={styles.leaveHeaderBtnText}>QUITTER LA TABLE</Text>
          </TouchableOpacity>

          <View style={styles.bankrollTag}>
            <Coins size={12} color="#a3a3a3" />
            <Text style={styles.bankrollText}>{credits} CR</Text>
          </View>
        </View>
      )}

      {/* CONTENU PRINCIPAL AVEC TRANSITION */}
      <Animated.View style={[styles.mainContent, { opacity: tabFadeAnim }]}>

        {/* TAB 1: ACCUEIL */}
        {activeTab === 'HOME' && (
          <ScrollView contentContainerStyle={styles.homeScroll}>
            <View style={styles.homeHeroCard}>
              <Text style={styles.heroLabel}>SOLDE DISPONIBLE</Text>
              <Text style={styles.heroCredits}>{credits} CR</Text>

              {credits === 0 ? (
                <TouchableOpacity style={styles.failsafeBtn} onPress={handleClaimFailsafe}>
                  <LifeBuoy size={20} color="#ffffff" />
                  <Text style={styles.failsafeBtnText}>OBTENIR 100 CR GRATUITS</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.heroPlayBtn} onPress={() => changeTab('GAME')}>
                  <Play size={20} color="#ffffff" fill="#ffffff" />
                  <Text style={styles.heroPlayBtnText}>JOUER UNE MANCHE</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.historySection}>
              <Text style={styles.sectionTitle}>DERNIÈRES PARTIES</Text>
              
              {history.map((item) => (
                <View 
                  key={item.id} 
                  style={[
                    styles.historyRow, 
                    item.type === 'WIN' || item.type === 'BLACKJACK' ? styles.historyRowWin : item.type === 'PUSH' ? styles.historyRowPush : styles.historyRowLoss
                  ]}
                >
                  <View style={styles.historyLeft}>
                    <Text style={[styles.historyTypeBadge, item.type === 'WIN' || item.type === 'BLACKJACK' ? styles.textGreen : item.type === 'PUSH' ? styles.textGray : styles.textRed]}>
                      {item.type === 'WIN' ? 'GAGNÉ' : item.type === 'BLACKJACK' ? 'BLACKJACK' : item.type === 'PUSH' ? 'ÉGALITÉ' : 'PERDU'}
                    </Text>
                    <Text style={styles.historyScoreText}>{item.score}</Text>
                  </View>

                  <View style={styles.historyRight}>
                    <Text style={[styles.historyAmountText, item.payout > 0 ? styles.textGreen : item.payout < 0 ? styles.textRed : styles.textGray]}>
                      {item.payout > 0 ? `+${item.payout} CR` : item.payout < 0 ? `${item.payout} CR` : '0 CR'}
                    </Text>
                    <Text style={styles.historyDateText}>{item.date}</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        {/* TAB 2: TABLE DE JEU */}
        {activeTab === 'GAME' && (
          <View style={styles.gameContainer}>
            <View style={styles.tableFrame}>
              <View style={styles.tableInnerFelt}>

                {/* PIOCHE DE CARTE: FORMAT 58x84 SOUS LE DÉCOMPTE AVEC SKIN ÉQUIPÉ */}
                <View style={styles.shoeFullContainer}>
                  <View style={styles.shoeCountBadge}>
                    <Layers size={11} color="#a3a3a3" />
                    <Text style={styles.shoeCountText}>{cardsRemaining} CARTES</Text>
                  </View>
                  
                  <View style={styles.shoeStackWrapper}>
                    <View style={[styles.shoeCardBack3, { backgroundColor: activeCardSkin.bg, borderColor: activeCardSkin.border }]} />
                    <View style={[styles.shoeCardBack2, { backgroundColor: activeCardSkin.bg, borderColor: activeCardSkin.border }]} />
                    <View style={[styles.shoeCardBack1, { backgroundColor: activeCardSkin.bg, borderColor: activeCardSkin.border }]}>
                      <View style={[styles.cardBackInner, { backgroundColor: activeCardSkin.innerBg }]}>
                        <Text style={styles.cardBackSymbol}>{activeCardSkin.symbol}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                
                {/* FILIGRANE TABLE */}
                <View style={styles.tableCenterMarking}>
                  <Text style={styles.tableArcText}>BLACKJACK PAYS 3 TO 2</Text>
                </View>

                {/* CROUPIER */}
                <View style={styles.handSection}>
                  <View style={styles.handHeader}>
                    <Text style={styles.feltLabel}>CROUPIER</Text>
                    {game && (
                      <View style={styles.scoreBadge}>
                        <Text style={styles.scoreBadgeText}>{game.dealerScore}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.cardsRow}>
                    {game && game.dealerHand.length > 0 ? (
                      game.dealerHand.map((card, idx) => (
                        <AnimatedPlayingCard key={card.id || idx} card={card} index={idx} cardSkin={activeCardSkin} />
                      ))
                    ) : (
                      <View style={styles.emptyCardSlotClean} />
                    )}
                  </View>
                </View>

                {/* BANNIÈRE RÉSULTAT */}
                {gameResult && (
                  <View style={styles.resultBanner}>
                    <Text style={styles.resultBannerText}>{gameResult}</Text>
                  </View>
                )}

                {/* JOUEUR */}
                <View style={styles.handSection}>
                  <View style={styles.handHeader}>
                    <Text style={styles.feltLabel}>JOUEUR</Text>
                    {game && !game.isSplit && (
                      <View style={styles.scoreBadge}>
                        <Text style={styles.scoreBadgeText}>{game.playerScore}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.cardsRow}>
                    {game ? (
                      game.isSplit ? (
                        <View style={styles.splitHandsContainer}>
                          {game.splitHands.map((hand, hIdx) => (
                            <View 
                              key={hIdx} 
                              style={[
                                styles.splitHandBox, 
                                game.activeSplitIndex === hIdx && game.status === 'PLAYING' && styles.splitHandActiveBox
                              ]}
                            >
                              <View style={styles.splitHandBadge}>
                                <Text style={styles.splitHandBadgeText}>MAIN {hIdx + 1} ({game.splitScores[hIdx]})</Text>
                              </View>
                              <View style={styles.cardsRowCompact}>
                                {hand.map((card, cIdx) => (
                                  <AnimatedPlayingCard key={card.id || cIdx} card={card} compact={true} index={cIdx} cardSkin={activeCardSkin} />
                                ))}
                              </View>
                            </View>
                          ))}
                        </View>
                      ) : (
                        game.playerHand.map((card, idx) => (
                          <AnimatedPlayingCard key={card.id || idx} card={card} index={idx} cardSkin={activeCardSkin} />
                        ))
                      )
                    ) : (
                      <View style={styles.emptyCardSlotClean} />
                    )}
                  </View>
                </View>

              </View>
            </View>

            {/* CONTROLES DE MANCHE */}
            <View style={styles.gameControlsPanel}>
              {game && game.status === 'PLAYING' ? (
                <View style={styles.actionRowContainer}>

                  {canInsurance && (
                    <TouchableOpacity style={styles.insuranceBtn} onPress={handleTakeInsurance}>
                      <ShieldAlert size={14} color="#ffffff" />
                      <Text style={styles.actionBtnText}>ASSURANCE ({Math.floor(game.bet / 2)} CR)</Text>
                    </TouchableOpacity>
                  )}

                  <View style={styles.actionRow}>
                    {canSplit && (
                      <TouchableOpacity style={styles.splitBtn} onPress={handleSplit} disabled={isDealing}>
                        <Repeat size={14} color="#ffffff" />
                        <Text style={styles.actionBtnText}>SPLIT</Text>
                      </TouchableOpacity>
                    )}

                    {canDouble && (
                      <TouchableOpacity style={styles.doubleBtn} onPress={handleDouble} disabled={isDealing}>
                        <Zap size={14} color="#ffffff" />
                        <Text style={styles.actionBtnText}>DOUBLE</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity style={[styles.hitBtn, isDealing && { opacity: 0.5 }]} onPress={handleHit} disabled={isDealing}>
                      <Text style={styles.actionBtnText}>TIRER</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.standBtn, isDealing && { opacity: 0.5 }]} onPress={handleStand} disabled={isDealing}>
                      <Text style={styles.actionBtnText}>RESTER</Text>
                    </TouchableOpacity>
                  </View>

                </View>
              ) : game && game.status === 'FINISHED' ? (
                <TouchableOpacity style={styles.dealBtn} onPress={handleResetRound} disabled={isDealing}>
                  <Text style={styles.dealBtnText}>NOUVELLE MANCHE</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.bettingControls}>
                  <View style={styles.betHeaderRow}>
                    <Text style={styles.betTotalText}>MISE : {currentBet} CR</Text>
                    
                    <View style={styles.betHeaderActions}>
                      <TouchableOpacity style={styles.maxBetBtn} onPress={handleMaxBet}>
                        <Maximize2 size={10} color="#f43f5e" />
                        <Text style={styles.maxBetText}>MISE MAX</Text>
                      </TouchableOpacity>

                      {betChips.length > 0 && (
                        <TouchableOpacity onPress={handleClearChips}>
                          <Text style={styles.clearBetText}>EFFACER</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  <View style={styles.compactBetChipsRow}>
                    {betChips.length === 0 ? (
                      <Text style={styles.noChipsHint}>Touche un jeton ci-dessous pour miser</Text>
                    ) : (
                      Object.entries(chipCounts).map(([valStr, count]) => {
                        const val = parseInt(valStr);
                        return (
                          <TouchableOpacity
                            key={val}
                            style={styles.chipSummaryBadge}
                            onPress={() => handleRemoveChip(val)}
                            activeOpacity={0.7}
                          >
                            <CasinoChip value={val} size={24} />
                            {count > 1 && <Text style={styles.chipCountText}>x{count}</Text>}
                          </TouchableOpacity>
                        );
                      })
                    )}
                  </View>

                  <View style={styles.chipBar}>
                    {CHIP_VALUES.map((val) => (
                      <CasinoChip key={val} value={val} size={36} onPress={() => handleAddChip(val)} />
                    ))}
                  </View>

                  <TouchableOpacity 
                    style={[styles.dealBtn, (currentBet <= 0 || currentBet > credits || isDealing) && styles.dealBtnDisabled]} 
                    onPress={handleStartGame}
                    disabled={currentBet <= 0 || currentBet > credits || isDealing}
                  >
                    <Text style={styles.dealBtnText}>DISTRIBUER ({currentBet} CR)</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}

        {/* TAB 3: PROFIL ENRICHI (STATS, SUCCÈS, DÉFIS, DOS DE CARTES, APPRENDRE, PARAMÈTRES) */}
        {activeTab === 'PROFILE' && (
          <ScrollView contentContainerStyle={styles.profileScroll}>
            {profileSubSection ? (
              <Animated.View style={[styles.subSectionContainer, { opacity: subSectionAnim }]}>
                <TouchableOpacity 
                  style={styles.backToProfileBtn} 
                  onPress={() => changeSubSection(null)}
                >
                  <Text style={styles.backToProfileText}>← RETOUR PROFIL</Text>
                </TouchableOpacity>

                {/* 1. STATISTIQUES */}
                {profileSubSection === 'STATS' && (
                  <View style={styles.subCard}>
                    <Text style={styles.subTitle}>STATISTIQUES AVANCÉES & PROGRESSION</Text>

                    <View style={styles.chartContainer}>
                      <Text style={styles.chartTitle}>PROGRESSION DU SOLDE (RÉCENT)</Text>
                      <View style={styles.chartBarsRow}>
                        {balanceHistory.slice(-10).map((val, idx) => {
                          const maxVal = Math.max(...balanceHistory, 150);
                          const barHeight = Math.min(100, Math.max(15, (val / maxVal) * 80));
                          return (
                            <View key={idx} style={styles.chartColumn}>
                              <Text style={styles.chartBarValue}>{val}</Text>
                              <View style={[styles.chartBar, { height: barHeight, backgroundColor: val >= 100 ? '#16a34a' : '#dc2626' }]} />
                            </View>
                          );
                        })}
                      </View>
                    </View>

                    <View style={styles.statsGrid}>
                      <View style={styles.statBox}>
                        <Text style={styles.statNumber}>{history.length}</Text>
                        <Text style={styles.statLabel}>Manches Jouées</Text>
                      </View>
                      <View style={styles.statBox}>
                        <Text style={[styles.statNumber, styles.textGreen]}>{history.filter(h => h.type === 'WIN' || h.type === 'BLACKJACK').length}</Text>
                        <Text style={styles.statLabel}>Victoires</Text>
                      </View>
                      <View style={styles.statBox}>
                        <Text style={styles.statNumber}>60%</Text>
                        <Text style={styles.statLabel}>Taux de Victoire</Text>
                      </View>
                      <View style={styles.statBox}>
                        <Text style={styles.statNumber}>75%</Text>
                        <Text style={styles.statLabel}>Taux Double</Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* 2. SUCCÈS & TROPHÉES */}
                {profileSubSection === 'ACHIEVEMENTS' && (
                  <View style={styles.subCard}>
                    <Text style={styles.subTitle}>SUCCÈS & TROPHÉES</Text>
                    
                    <View style={styles.achievementRow}>
                      <Award size={20} color="#16a34a" />
                      <View style={styles.achievementInfo}>
                        <Text style={styles.achievementTitle}>Premier Pas</Text>
                        <Text style={styles.achievementDesc}>Gagner votre première manche</Text>
                      </View>
                      <View style={styles.unlockedBadge}><Text style={styles.unlockedText}>DÉBLOQUÉ</Text></View>
                    </View>

                    <View style={styles.achievementRow}>
                      <Award size={20} color="#16a34a" />
                      <View style={styles.achievementInfo}>
                        <Text style={styles.achievementTitle}>High Roller</Text>
                        <Text style={styles.achievementDesc}>Miser 100 CR en une seule manche</Text>
                      </View>
                      <View style={styles.unlockedBadge}><Text style={styles.unlockedText}>DÉBLOQUÉ</Text></View>
                    </View>

                    <View style={styles.achievementRow}>
                      <Zap size={20} color="#d97706" />
                      <View style={styles.achievementInfo}>
                        <Text style={styles.achievementTitle}>Maître du Double</Text>
                        <Text style={styles.achievementDesc}>Réussir 3 Double Down gagnants (2/3)</Text>
                      </View>
                      <View style={styles.progressBadge}><Text style={styles.progressText}>2/3</Text></View>
                    </View>

                    <View style={styles.achievementRow}>
                      <Repeat size={20} color="#2563eb" />
                      <View style={styles.achievementInfo}>
                        <Text style={styles.achievementTitle}>Pro du Split</Text>
                        <Text style={styles.achievementDesc}>Gagner une manche après un Split</Text>
                      </View>
                      <View style={styles.unlockedBadge}><Text style={styles.unlockedText}>DÉBLOQUÉ</Text></View>
                    </View>

                    <View style={styles.achievementRow}>
                      <Lock size={20} color="#525252" />
                      <View style={styles.achievementInfo}>
                        <Text style={styles.achievementTitle}>Blackjack Royale</Text>
                        <Text style={styles.achievementDesc}>Obtenir 3 Blackjacks naturels (1/3)</Text>
                      </View>
                      <View style={styles.lockedBadge}><Text style={styles.lockedText}>1/3</Text></View>
                    </View>

                    <View style={styles.achievementRow}>
                      <Palette size={20} color="#525252" />
                      <View style={styles.achievementInfo}>
                        <Text style={styles.achievementTitle}>Collectionneur</Text>
                        <Text style={styles.achievementDesc}>Débloquer 5 Dos de Cartes (2/5)</Text>
                      </View>
                      <View style={styles.lockedBadge}><Text style={styles.lockedText}>2/5</Text></View>
                    </View>
                  </View>
                )}

                {/* 3. DÉFIS QUOTIDIENS */}
                {profileSubSection === 'CHALLENGES' && (
                  <View style={styles.subCard}>
                    <Text style={styles.subTitle}>DÉFIS QUOTIDIENS</Text>
                    
                    {challenges.map((ch) => (
                      <View key={ch.id} style={styles.challengeCard}>
                        <View style={styles.challengeHeader}>
                          <View style={styles.challengeTitleRow}>
                            <Flame size={16} color="#f43f5e" />
                            <Text style={styles.challengeTitleText}>{ch.title}</Text>
                          </View>
                          <Text style={styles.challengeRewardText}>+{ch.reward} CR</Text>
                        </View>

                        <View style={styles.challengeProgressRow}>
                          <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: `${Math.min(100, (ch.progress / ch.total) * 100)}%` }]} />
                          </View>
                          <Text style={styles.progressCountText}>{ch.progress}/{ch.total}</Text>
                        </View>

                        {ch.claimed ? (
                          <View style={styles.claimedBtn}>
                            <Check size={12} color="#a3a3a3" />
                            <Text style={styles.claimedBtnText}>RÉCOMPENSE RÉCLAMÉE</Text>
                          </View>
                        ) : ch.progress >= ch.total ? (
                          <TouchableOpacity style={styles.claimRewardBtn} onPress={() => handleClaimChallenge(ch.id)}>
                            <Text style={styles.claimRewardBtnText}>RÉCLAMER (+{ch.reward} CR)</Text>
                          </TouchableOpacity>
                        ) : (
                          <View style={styles.inProgressBtn}>
                            <Text style={styles.inProgressBtnText}>EN COURS</Text>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                )}

                {/* 4. DOS DE CARTES (10 CUSTOM SKINS) */}
                {profileSubSection === 'CARDBACKS' && (
                  <View style={styles.subCard}>
                    <Text style={styles.subTitle}>DOS DE CARTES (10 STYLES)</Text>
                    <Text style={styles.subText}>Sélectionnez un dos de carte pour personnaliser votre table de jeu :</Text>

                    <View style={styles.cardSkinsGrid}>
                      {cardBackSkins.map((skin) => {
                        const isEquipped = equippedCardBackId === skin.id;
                        return (
                          <TouchableOpacity
                            key={skin.id}
                            style={[
                              styles.skinCardItem,
                              isEquipped && styles.skinCardItemEquipped,
                            ]}
                            onPress={() => handleUnlockCardBack(skin)}
                          >
                            <View style={[styles.miniCardBack, { backgroundColor: skin.bg, borderColor: skin.border }]}>
                              <View style={[styles.miniCardBackInner, { backgroundColor: skin.innerBg }]}>
                                <Text style={styles.miniCardBackSymbol}>{skin.symbol}</Text>
                              </View>
                            </View>

                            <Text style={styles.skinNameText}>{skin.name}</Text>

                            {isEquipped ? (
                              <View style={styles.equippedBadge}>
                                <CheckCircle2 size={10} color="#ffffff" />
                                <Text style={styles.equippedBadgeText}>ÉQUIPÉ</Text>
                              </View>
                            ) : skin.unlocked ? (
                              <View style={styles.unlockedSkinBtn}>
                                <Text style={styles.unlockedSkinBtnText}>CHOISIR</Text>
                              </View>
                            ) : (
                              <View style={styles.buySkinBtn}>
                                <Text style={styles.buySkinBtnText}>{skin.price} CR</Text>
                              </View>
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}

                {/* 5. APPRENDRE / RÈGLES */}
                {profileSubSection === 'LEARN' && (
                  <View style={styles.subCard}>
                    <Text style={styles.subTitle}>RÈGLES ET TACTIQUES DU BLACKJACK</Text>
                    <Text style={styles.subText}>• Atteignez 21 sans le dépasser.</Text>
                    <Text style={styles.subText}>• Le Croupier s'arrête à 17 ou plus.</Text>
                    <Text style={styles.subText}>• Double Down : Doubler la mise pour recevoir 1 seule carte.</Text>
                    <Text style={styles.subText}>• Split : Séparer 2 cartes identiques en 2 mains indépendantes.</Text>
                    <Text style={styles.subText}>• Assurance : Protégez-vous si la carte visible du Croupier est un As.</Text>
                  </View>
                )}

                {/* 6. PARAMÈTRES */}
                {profileSubSection === 'SETTINGS' && (
                  <View style={styles.subCard}>
                    <Text style={styles.subTitle}>PARAMÈTRES DU COMPTE</Text>
                    <Text style={styles.subText}>• Pseudo : Offsuit_Player</Text>
                    <Text style={styles.subText}>• Effets sonores : Activé</Text>
                    <Text style={styles.subText}>• Thème : Sombre Épuré Offsuit</Text>
                    <Text style={styles.subText}>• Version App : 2.5.0 Standalone Native</Text>
                  </View>
                )}

              </Animated.View>
            ) : (
              /* MENU PROFIL PRINCIPAL ÉPURÉ & COMPLET */
              <Animated.View style={[styles.profileMenuContainer, { opacity: subSectionAnim }]}>
                <View style={styles.profileHeaderCard}>
                  <View style={styles.avatarCircle}>
                    <User size={28} color="#ffffff" />
                  </View>
                  <Text style={styles.profileUsername}>Offsuit_Player</Text>
                  <Text style={styles.profileLevelText}>Joueur Niveau 5 • {credits} CR</Text>
                </View>

                {credits === 0 && (
                  <TouchableOpacity style={styles.failsafeBtn} onPress={handleClaimFailsafe}>
                    <LifeBuoy size={18} color="#ffffff" />
                    <Text style={styles.failsafeBtnText}>OBTENIR 100 CR GRATUITS</Text>
                  </TouchableOpacity>
                )}

                <View style={styles.menuOptionsGroup}>
                  <TouchableOpacity style={styles.menuOptionRow} onPress={() => changeSubSection('STATS')}>
                    <View style={styles.optionLeft}>
                      <BarChart2 size={18} color="#a3a3a3" />
                      <Text style={styles.optionLabel}>Statistiques avancées & Solde</Text>
                    </View>
                    <ChevronRight size={16} color="#525252" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.menuOptionRow} onPress={() => changeSubSection('CARDBACKS')}>
                    <View style={styles.optionLeft}>
                      <Palette size={18} color="#e11d48" />
                      <Text style={styles.optionLabel}>Dos de Cartes (10 Styles)</Text>
                    </View>
                    <ChevronRight size={16} color="#525252" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.menuOptionRow} onPress={() => changeSubSection('CHALLENGES')}>
                    <View style={styles.optionLeft}>
                      <Flame size={18} color="#f59e0b" />
                      <Text style={styles.optionLabel}>Défis Quotidiens</Text>
                    </View>
                    <ChevronRight size={16} color="#525252" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.menuOptionRow} onPress={() => changeSubSection('ACHIEVEMENTS')}>
                    <View style={styles.optionLeft}>
                      <Award size={18} color="#a3a3a3" />
                      <Text style={styles.optionLabel}>Succès & Trophées</Text>
                    </View>
                    <ChevronRight size={16} color="#525252" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.menuOptionRow} onPress={() => changeSubSection('LEARN')}>
                    <View style={styles.optionLeft}>
                      <HelpCircle size={18} color="#a3a3a3" />
                      <Text style={styles.optionLabel}>Règles & Stratégie</Text>
                    </View>
                    <ChevronRight size={16} color="#525252" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.menuOptionRow} onPress={() => changeSubSection('SETTINGS')}>
                    <View style={styles.optionLeft}>
                      <Settings size={18} color="#a3a3a3" />
                      <Text style={styles.optionLabel}>Paramètres</Text>
                    </View>
                    <ChevronRight size={16} color="#525252" />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}
          </ScrollView>
        )}

      </Animated.View>

      {/* BARRE EN BAS (MASQUÉE PENDANT LE JEU) */}
      {activeTab !== 'GAME' && (
        <View style={styles.bottomTabBar}>
          <View style={[styles.tabItem, styles.tabItemDisabled]}>
            <ShoppingBag size={20} color="#404040" />
            <Text style={styles.tabLabelDisabled}>BOUTIQUE</Text>
          </View>

          <TouchableOpacity 
            style={[styles.tabItem, activeTab === 'HOME' && styles.tabItemActive]} 
            onPress={() => changeTab('HOME')}
          >
            <Home size={22} color={activeTab === 'HOME' ? '#ffffff' : '#737373'} />
            <Text style={[activeTab === 'HOME' ? styles.tabLabelActive : styles.tabLabel]}>ACCUEIL</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabItem, activeTab === 'PROFILE' && styles.tabItemActive]} 
            onPress={() => changeTab('PROFILE')}
          >
            <User size={22} color={activeTab === 'PROFILE' ? '#ffffff' : '#737373'} />
            <Text style={[activeTab === 'PROFILE' ? styles.tabLabelActive : styles.tabLabel]}>PROFIL</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* MODAL DE CONFIRMATION DE QUITTER LA TABLE */}
      <Modal
        visible={showLeaveModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLeaveModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.leaveModalBox}>
            <Text style={styles.modalTitle}>QUITTER LA TABLE ?</Text>
            <Text style={styles.modalSubText}>
              {game && game.status === 'PLAYING'
                ? 'Une manche est en cours ! Quitter la table entraînera l\'abandon et la perte de votre mise.'
                : 'Voulez-vous vraiment revenir à l\'accueil ?'}
            </Text>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowLeaveModal(false)}>
                <Text style={styles.modalCancelBtnText}>ANNULER</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalConfirmBtn} onPress={handleConfirmLeaveTable}>
                <Text style={styles.modalConfirmBtnText}>QUITTER</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#121212',
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  leaveHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#262626',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3a1a1a',
  },
  leaveHeaderBtnText: {
    color: '#f43f5e',
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 1,
  },
  bankrollTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#171717',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#262626',
  },
  bankrollText: {
    color: '#e5e5e5',
    fontWeight: '900',
    fontSize: 12,
  },
  mainContent: {
    flex: 1,
  },
  homeScroll: {
    padding: 16,
    gap: 20,
  },
  homeHeroCard: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  heroLabel: {
    color: '#737373',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  heroCredits: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '900',
    marginVertical: 8,
  },
  heroPlayBtn: {
    backgroundColor: '#e11d48',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#f43f5e',
  },
  heroPlayBtnText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
  failsafeBtn: {
    backgroundColor: '#16a34a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#4ade80',
  },
  failsafeBtnText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1,
  },
  historySection: {
    gap: 10,
  },
  sectionTitle: {
    color: '#737373',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#121212',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  historyRowWin: {
    borderColor: '#15803d',
    backgroundColor: '#052e16',
  },
  historyRowLoss: {
    borderColor: '#991b1b',
    backgroundColor: '#450a0a',
  },
  historyRowPush: {
    borderColor: '#262626',
    backgroundColor: '#171717',
  },
  historyLeft: {
    gap: 2,
  },
  historyRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  historyTypeBadge: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  historyScoreText: {
    color: '#d4d4d4',
    fontSize: 11,
    fontWeight: '700',
  },
  historyAmountText: {
    fontSize: 13,
    fontWeight: '900',
  },
  historyDateText: {
    color: '#737373',
    fontSize: 9,
  },
  textGreen: { color: '#4ade80' },
  textRed: { color: '#f87171' },
  textGray: { color: '#a3a3a3' },

  /* GAME STYLES */
  gameContainer: {
    flex: 1,
  },
  tableFrame: {
    flex: 1,
    margin: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#262626',
    backgroundColor: '#0d0d0d',
    padding: 10,
  },
  tableInnerFelt: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1c1c1c',
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    position: 'relative',
  },
  
  /* PIOCHE 3D FORMAT 58x84 SOUS LE DÉCOMPTE */
  shoeFullContainer: {
    position: 'absolute',
    top: 10,
    left: 12,
    zIndex: 10,
    gap: 6,
  },
  shoeCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#171717',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#262626',
  },
  shoeCountText: {
    color: '#e5e5e5',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  shoeStackWrapper: {
    position: 'relative',
    width: 58,
    height: 84,
  },
  shoeCardBack3: {
    position: 'absolute',
    top: -4,
    left: -4,
    width: 58,
    height: 84,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  shoeCardBack2: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 58,
    height: 84,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  shoeCardBack1: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 58,
    height: 84,
    borderRadius: 8,
    padding: 3,
    borderWidth: 1.5,
  },

  tableCenterMarking: {
    position: 'absolute',
    top: '42%',
    alignItems: 'center',
    opacity: 0.2,
  },
  tableArcText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 3,
  },
  handSection: {
    alignItems: 'center',
    gap: 6,
  },
  handHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  feltLabel: {
    color: '#525252',
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 2,
  },
  scoreBadge: {
    backgroundColor: '#262626',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  scoreBadgeText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 10,
  },
  cardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  /* CARD WRAPPER & STYLES (OVERLAPPING CARDS) */
  cardWrapper: {
    width: 58,
    height: 84,
  },
  cardWrapperCompact: {
    width: 44,
    height: 64,
  },
  cardFront: {
    width: 58,
    height: 84,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#d4d4d4',
  },
  cardBack: {
    width: 58,
    height: 84,
    borderRadius: 8,
    padding: 3,
    borderWidth: 1.5,
  },
  cardFrontCompact: {
    width: 44,
    height: 64,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d4d4d4',
  },
  cardBackCompact: {
    width: 44,
    height: 64,
    borderRadius: 6,
    padding: 2,
    borderWidth: 1,
  },
  cardBackInner: {
    flex: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBackSymbol: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  cardBackSymbolSmall: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },
  cardRankRed: { color: '#dc2626', fontWeight: '900', fontSize: 18 },
  cardSuitRed: { color: '#dc2626', fontSize: 16 },
  cardRankBlack: { color: '#171717', fontWeight: '900', fontSize: 18 },
  cardSuitBlack: { color: '#171717', fontSize: 16 },
  cardRankRedSmall: { color: '#dc2626', fontWeight: '900', fontSize: 14 },
  cardSuitRedSmall: { color: '#dc2626', fontSize: 12 },
  cardRankBlackSmall: { color: '#171717', fontWeight: '900', fontSize: 14 },
  cardSuitBlackSmall: { color: '#171717', fontSize: 12 },

  emptyCardSlotClean: {
    width: 120,
    height: 84,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#262626',
    borderStyle: 'dashed',
  },

  /* SPLIT MAINS */
  splitHandsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  splitHandBox: {
    backgroundColor: '#171717',
    padding: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#262626',
    alignItems: 'center',
    gap: 4,
  },
  splitHandActiveBox: {
    borderColor: '#e11d48',
    borderWidth: 1.5,
    backgroundColor: '#1c1917',
  },
  splitHandBadge: {
    backgroundColor: '#262626',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  splitHandBadgeText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '900',
  },
  cardsRowCompact: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  resultBanner: {
    backgroundColor: '#e11d48',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
  },
  resultBannerText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1,
  },
  gameControlsPanel: {
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#1f1f1f',
  },
  actionRowContainer: {
    gap: 8,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  insuranceBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#60a5fa',
  },
  hitBtn: {
    flex: 1,
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  standBtn: {
    flex: 1,
    backgroundColor: '#dc2626',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doubleBtn: {
    flex: 1,
    backgroundColor: '#d97706',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  splitBtn: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  actionBtnText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1,
  },
  bettingControls: {
    width: '100%',
  },
  betHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  betTotalText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1,
  },
  betHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  maxBetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#262626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#f43f5e',
  },
  maxBetText: {
    color: '#f43f5e',
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 1,
  },
  clearBetText: {
    color: '#f43f5e',
    fontWeight: '800',
    fontSize: 10,
  },
  compactBetChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 34,
    marginVertical: 4,
  },
  chipSummaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#171717',
    paddingRight: 8,
    paddingLeft: 4,
    paddingVertical: 3,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#262626',
    gap: 4,
  },
  chipCountText: {
    color: '#e5e5e5',
    fontWeight: '900',
    fontSize: 11,
  },
  noChipsHint: {
    color: '#525252',
    fontSize: 10,
    fontWeight: '700',
    fontStyle: 'italic',
  },
  chipBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    paddingHorizontal: 12,
  },
  casinoChip: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipInnerRing: {
    borderWidth: 1,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
    width: '84%',
    height: '84%',
  },
  chipValueText: {
    fontWeight: '900',
  },
  dealBtn: {
    backgroundColor: '#e11d48',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  dealBtnDisabled: {
    opacity: 0.3,
  },
  dealBtnText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },

  /* PROFILE STYLES ENRICHIS */
  profileScroll: {
    padding: 16,
  },
  profileMenuContainer: {
    gap: 16,
  },
  profileHeaderCard: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#404040',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  profileUsername: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 16,
  },
  profileLevelText: {
    color: '#a3a3a3',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  menuOptionsGroup: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1f1f1f',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionLabel: {
    color: '#e5e5e5',
    fontWeight: '700',
    fontSize: 13,
  },
  subSectionContainer: {
    gap: 12,
  },
  backToProfileBtn: {
    backgroundColor: '#262626',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  backToProfileText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 11,
  },
  subCard: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  subTitle: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
    marginBottom: 4,
  },
  subText: {
    color: '#a3a3a3',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
  },

  /* GRID STATISTIQUES */
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#171717',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#262626',
    alignItems: 'center',
  },
  statNumber: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  statLabel: {
    color: '#737373',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },

  /* RANGÉES DE SUCCÈS */
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#171717',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#262626',
  },
  achievementInfo: {
    flex: 1,
    gap: 2,
  },
  achievementTitle: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
  },
  achievementDesc: {
    color: '#737373',
    fontSize: 10,
  },
  unlockedBadge: {
    backgroundColor: '#052e16',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#16a34a',
  },
  unlockedText: {
    color: '#4ade80',
    fontSize: 9,
    fontWeight: '900',
  },
  progressBadge: {
    backgroundColor: '#262626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  progressText: {
    color: '#d97706',
    fontSize: 9,
    fontWeight: '900',
  },
  lockedBadge: {
    backgroundColor: '#171717',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#404040',
  },
  lockedText: {
    color: '#737373',
    fontSize: 9,
    fontWeight: '900',
  },

  /* DÉFIS QUOTIDIENS */
  challengeCard: {
    backgroundColor: '#171717',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#262626',
    gap: 8,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  challengeTitleText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 12,
  },
  challengeRewardText: {
    color: '#4ade80',
    fontWeight: '900',
    fontSize: 11,
  },
  challengeProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#262626',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#e11d48',
    borderRadius: 3,
  },
  progressCountText: {
    color: '#a3a3a3',
    fontSize: 10,
    fontWeight: '700',
  },
  claimRewardBtn: {
    backgroundColor: '#16a34a',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  claimRewardBtnText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 1,
  },
  claimedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#262626',
    paddingVertical: 6,
    borderRadius: 6,
  },
  claimedBtnText: {
    color: '#a3a3a3',
    fontWeight: '900',
    fontSize: 9,
  },
  inProgressBtn: {
    backgroundColor: '#262626',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  inProgressBtnText: {
    color: '#737373',
    fontWeight: '900',
    fontSize: 9,
  },

  /* DOS DE CARTES (10 SKINS GRID) */
  cardSkinsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 6,
  },
  skinCardItem: {
    width: '48%',
    backgroundColor: '#171717',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#262626',
    padding: 10,
    alignItems: 'center',
    gap: 6,
  },
  skinCardItemEquipped: {
    borderColor: '#e11d48',
    borderWidth: 2,
    backgroundColor: '#1f1416',
  },
  miniCardBack: {
    width: 44,
    height: 64,
    borderRadius: 6,
    padding: 2,
    borderWidth: 1.5,
  },
  miniCardBackInner: {
    flex: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniCardBackSymbol: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  skinNameText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 11,
    textAlign: 'center',
  },
  equippedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#e11d48',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  equippedBadgeText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '900',
  },
  unlockedSkinBtn: {
    backgroundColor: '#262626',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  unlockedSkinBtnText: {
    color: '#e5e5e5',
    fontSize: 9,
    fontWeight: '900',
  },
  buySkinBtn: {
    backgroundColor: '#d97706',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  buySkinBtnText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
  },

  /* GRAPHIQUE DU SOLDE */
  chartContainer: {
    backgroundColor: '#171717',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#262626',
    gap: 10,
    marginVertical: 4,
  },
  chartTitle: {
    color: '#737373',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  chartBarsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 100,
    paddingTop: 10,
  },
  chartColumn: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  chartBarValue: {
    color: '#a3a3a3',
    fontSize: 8,
    fontWeight: '800',
  },
  chartBar: {
    width: 14,
    borderRadius: 4,
  },

  /* BOTTOM TAB BAR */
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: '#121212',
    borderTopWidth: 1,
    borderTopColor: '#262626',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabItemActive: {
    opacity: 1,
  },
  tabItemDisabled: {
    opacity: 0.35,
  },
  tabLabel: {
    color: '#737373',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 3,
  },
  tabLabelActive: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 3,
  },
  tabLabelDisabled: {
    color: '#404040',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 3,
  },

  /* LEAVE CONFIRMATION MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  leaveModalBox: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#f43f5e',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  modalTitle: {
    color: '#f43f5e',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  modalSubText: {
    color: '#d4d4d4',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 8,
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: '#262626',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelBtnText: {
    color: '#a3a3a3',
    fontWeight: '900',
    fontSize: 12,
  },
  modalConfirmBtn: {
    flex: 1,
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalConfirmBtnText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 12,
  },
});

registerRootComponent(App);

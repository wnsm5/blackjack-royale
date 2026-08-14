import './polyfill';
import { registerRootComponent } from 'expo';
import React, { useState, useRef } from 'react';
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
  Coins,
  LogOut,
  LifeBuoy,
  Layers,
  Zap,
  Repeat,
  Maximize2
} from 'lucide-react-native';

const CHIP_VALUES = [1, 2, 5, 10, 20];

// Custom authentic Casino Chip component
function CasinoChip({ value, onPress }) {
  const chipColors = {
    1: { bg: '#262626', border: '#525252', text: '#ffffff', stripe: '#404040' },
    2: { bg: '#991b1b', border: '#fca5a5', text: '#fef2f2', stripe: '#b91c1c' },
    5: { bg: '#15803d', border: '#86efac', text: '#f0fdf4', stripe: '#166534' },
    10: { bg: '#1d4ed8', border: '#93c5fd', text: '#eff6ff', stripe: '#1e40af' },
    20: { bg: '#d97706', border: '#fde047', text: '#fefce8', stripe: '#b45309' },
  }[value] || { bg: '#262626', border: '#525252', text: '#ffffff', stripe: '#404040' };

  return (
    <TouchableOpacity
      style={[styles.casinoChip, { backgroundColor: chipColors.bg, borderColor: chipColors.border }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.chipInnerRing, { borderColor: chipColors.stripe }]}>
        <View style={styles.chipCenterCircle}>
          <Text style={[styles.chipValueText, { color: chipColors.text }]}>{value}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('HOME'); // 'HOME' | 'GAME' | 'PROFILE'
  const [profileSubSection, setProfileSubSection] = useState(null); // 'STATS' | 'HISTORY' | 'ACHIEVEMENTS' | 'SETTINGS' | 'LEARN'
  
  const [credits, setCredits] = useState(100);
  const [currentBet, setCurrentBet] = useState(10);
  const [betChips, setBetChips] = useState([]);
  
  // Game Engine state
  const [game, setGame] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const [isDealing, setIsDealing] = useState(false);

  // Shoe / Pioche state (6 decks = 312 cards)
  const [cardsRemaining, setCardsRemaining] = useState(312);

  // Animations
  const cardOpacity = useRef(new Animated.Value(1)).current;
  const cardTranslateY = useRef(new Animated.Value(0)).current;

  // Leave confirmation modal state
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Match History state
  const [history, setHistory] = useState([
    { id: 1, type: 'WIN', bet: 10, payout: +20, score: '20 vs 18', date: 'Aujourd\'hui 22:04' },
    { id: 2, type: 'LOSS', bet: 10, payout: -10, score: '17 vs 19', date: 'Aujourd\'hui 21:58' },
    { id: 3, type: 'WIN', bet: 20, payout: +40, score: '21 vs 20', date: 'Aujourd\'hui 21:45' },
    { id: 4, type: 'BLACKJACK', bet: 10, payout: +25, score: '21 BJ vs 18', date: 'Hier 23:12' },
    { id: 5, type: 'LOSS', bet: 5, payout: -5, score: 'BUST (23)', date: 'Hier 22:50' },
  ]);

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

  // Card entrance animation
  const animateDeal = () => {
    cardOpacity.setValue(0);
    cardTranslateY.setValue(-25);
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Card clear animation
  const animateClearCards = (callback) => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslateY, {
        toValue: 30,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (callback) callback();
    });
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

  const handleRemoveChip = (idx) => {
    if (isDealing) return;
    const newChips = betChips.filter((_, i) => i !== idx);
    setBetChips(newChips);
    setCurrentBet(newChips.reduce((a, c) => a + c, 0));
  };

  const handleClearChips = () => {
    if (isDealing) return;
    setBetChips([]);
    setCurrentBet(0);
  };

  // MISE MAX (MAX BET)
  const handleMaxBet = () => {
    if (isDealing || credits <= 0) return;
    setCurrentBet(credits);
    setBetChips([credits]);
  };

  // Claim Failsafe 100 Credits
  const handleClaimFailsafe = () => {
    setCredits(100);
  };

  // Confirm leave table action
  const handleConfirmLeaveTable = () => {
    setShowLeaveModal(false);
    
    if (game && game.status === 'PLAYING') {
      setHistory(prev => [{ id: Date.now(), type: 'LOSS', bet: game.bet, payout: -game.bet, score: 'ABANDON', date: 'À l\'instant' }, ...prev]);
    }
    
    animateClearCards(() => {
      setGame(null);
      setGameResult(null);
      setIsDealing(false);
      setBetChips([]);
      setCurrentBet(10);
      setActiveTab('HOME');
    });
  };

  // ==============================================================
  // GAME ENGINE - SEQUENTIAL STEP-BY-STEP CARD DEALING
  // ==============================================================
  const handleStartGame = () => {
    if (currentBet <= 0 || currentBet > credits || isDealing) return;
    
    setIsDealing(true);
    setGameResult(null);
    setCredits(prev => prev - currentBet);

    const p1 = getRandomCard();
    const d1 = getRandomCard();
    const p2 = getRandomCard();
    const d2 = getRandomCard(false);

    // Initial setup with empty hands
    setGame({
      playerHand: [p1],
      dealerHand: [d1],
      playerScore: calcScore([p1]),
      dealerScore: calcScore([d1]),
      status: 'PLAYING',
      bet: currentBet,
      isSplit: false,
      splitHands: [],
      splitScores: [],
      activeSplitIndex: 0,
    });
    animateDeal();

    // Step 2: Deal 2nd card to player after 400ms delay
    setTimeout(() => {
      setGame(prev => ({
        ...prev,
        playerHand: [p1, p2],
        playerScore: calcScore([p1, p2]),
      }));
      animateDeal();

      // Step 3: Deal face-down 2nd card to dealer after another 400ms
      setTimeout(() => {
        setGame(prev => ({
          ...prev,
          dealerHand: [d1, d2],
        }));
        setCardsRemaining(prev => Math.max(10, prev - 4));
        setIsDealing(false);
      }, 400);

    }, 400);
  };

  // Hit Action (One card with animation)
  const handleHit = () => {
    if (!game || game.status !== 'PLAYING' || isDealing) return;

    setIsDealing(true);
    const newCard = getRandomCard();
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
      animateDeal();

      setTimeout(() => {
        setIsDealing(false);
        if (newScore > 21) {
          if (activeIdx === 0) {
            setGame(prev => ({ ...prev, activeSplitIndex: 1 }));
          } else {
            finishSplitGame(newSplitHands, newSplitScores);
          }
        }
      }, 400);
    } else {
      const updatedHand = [...game.playerHand, newCard];
      const score = calcScore(updatedHand);

      setGame({
        ...game,
        playerHand: updatedHand,
        playerScore: score,
      });
      animateDeal();

      setTimeout(() => {
        setIsDealing(false);
        if (score > 21) {
          setGame(prev => ({ ...prev, status: 'FINISHED' }));
          setGameResult('BUST - PERDU !');
          setHistory(prev => [{ id: Date.now(), type: 'LOSS', bet: game.bet, payout: -game.bet, score: `BUST (${score})`, date: 'À l\'instant' }, ...prev]);
        }
      }, 400);
    }
  };

  // Double Down Action
  const handleDouble = () => {
    if (!game || game.status !== 'PLAYING' || credits < game.bet || game.playerHand.length !== 2 || isDealing) return;

    setIsDealing(true);
    const additionalBet = game.bet;
    const totalBet = game.bet * 2;
    setCredits(prev => prev - additionalBet);

    const newCard = getRandomCard();
    setCardsRemaining(prev => Math.max(10, prev - 1));

    const updatedHand = [...game.playerHand, newCard];
    const pScore = calcScore(updatedHand);

    setGame({
      ...game,
      playerHand: updatedHand,
      playerScore: pScore,
      bet: totalBet,
    });
    animateDeal();

    setTimeout(() => {
      if (pScore > 21) {
        setIsDealing(false);
        setGame(prev => ({ ...prev, status: 'FINISHED' }));
        setGameResult('DOUBLE BUST - PERDU !');
        setHistory(prev => [{ id: Date.now(), type: 'LOSS', bet: totalBet, payout: -totalBet, score: `BUST (${pScore})`, date: 'À l\'instant' }, ...prev]);
      } else {
        // Dealer draws step by step
        executeDealerTurnStepByStep(updatedHand, pScore, totalBet);
      }
    }, 600);
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
    const newCard1 = getRandomCard();
    const newCard2 = getRandomCard();

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
    animateDeal();

    setTimeout(() => {
      setIsDealing(false);
    }, 500);
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

    // Reveal dealer face-down card first
    let updatedDealerHand = game.dealerHand.map(c => ({ ...c, faceUp: true }));
    let dScore = calcScore(updatedDealerHand);

    setGame(prev => ({
      ...prev,
      dealerHand: updatedDealerHand,
      dealerScore: dScore,
    }));
    animateDeal();

    // Recursive dealer draw with 600ms delays
    const drawNextDealerCard = (currentHand) => {
      let score = calcScore(currentHand);
      if (score < 17) {
        setTimeout(() => {
          const nextCard = getRandomCard();
          const nextHand = [...currentHand, nextCard];
          setCardsRemaining(prev => Math.max(10, prev - 1));

          setGame(prev => ({
            ...prev,
            dealerHand: nextHand,
            dealerScore: calcScore(nextHand),
          }));
          animateDeal();

          drawNextDealerCard(nextHand);
        }, 650);
      } else {
        // Dealer finished drawing -> evaluate outcome
        setTimeout(() => {
          let finalDScore = calcScore(currentHand);
          let result = '';
          let winAmount = 0;
          let type = 'LOSS';
          let payout = -betAmount;

          if (finalDScore > 21 || pScore > finalDScore) {
            result = 'GAGNÉ !';
            type = 'WIN';
            winAmount = betAmount * 2;
            payout = +betAmount;
            setCredits(prev => prev + winAmount);
          } else if (pScore === finalDScore) {
            result = 'ÉGALITÉ !';
            type = 'PUSH';
            winAmount = betAmount;
            payout = 0;
            setCredits(prev => prev + winAmount);
          } else {
            result = 'PERDU !';
            type = 'LOSS';
          }

          setGame(prev => ({ ...prev, status: 'FINISHED' }));
          setGameResult(result);
          setHistory(prev => [{ id: Date.now(), type, bet: betAmount, payout, score: `${pScore} vs ${finalDScore}`, date: 'À l\'instant' }, ...prev]);
          setIsDealing(false);
        }, 400);
      }
    };

    setTimeout(() => {
      drawNextDealerCard(updatedDealerHand);
    }, 600);
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
    animateDeal();

    const drawNextDealerCardSplit = (currentHand) => {
      let score = calcScore(currentHand);
      if (score < 17) {
        setTimeout(() => {
          const nextCard = getRandomCard();
          const nextHand = [...currentHand, nextCard];
          setCardsRemaining(prev => Math.max(10, prev - 1));

          setGame(prev => ({
            ...prev,
            dealerHand: nextHand,
            dealerScore: calcScore(nextHand),
          }));
          animateDeal();

          drawNextDealerCardSplit(nextHand);
        }, 650);
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
          
          setCredits(prev => prev + totalPayout);
          setGame(prev => ({ ...prev, status: 'FINISHED' }));
          setGameResult(resultBanner);
          setHistory(prev => [{ id: Date.now(), type: netProfit >= 0 ? 'WIN' : 'LOSS', bet: game.bet, payout: netProfit, score: `H1:${splitScores[0]} H2:${splitScores[1]} vs ${finalDScore}`, date: 'À l\'instant' }, ...prev]);
          setIsDealing(false);
        }, 400);
      }
    };

    setTimeout(() => {
      drawNextDealerCardSplit(updatedDealerHand);
    }, 600);
  };

  // Re-deal / Clear round action
  const handleResetRound = () => {
    animateClearCards(() => {
      setGame(null);
      setGameResult(null);
      setIsDealing(false);
    });
  };

  const canDouble = game && game.status === 'PLAYING' && !game.isSplit && game.playerHand.length === 2 && credits >= game.bet && !isDealing;
  const canSplit = game && game.status === 'PLAYING' && !game.isSplit && game.playerHand.length === 2 && (game.playerHand[0].val === game.playerHand[1].val) && credits >= game.bet && !isDealing;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      {/* HEADER DISCRET (BOUTON QUITTER SI EN JEU) */}
      <View style={styles.header}>
        {activeTab === 'GAME' ? (
          <TouchableOpacity style={styles.leaveHeaderBtn} onPress={() => setShowLeaveModal(true)}>
            <LogOut size={16} color="#f43f5e" />
            <Text style={styles.leaveHeaderBtnText}>QUITTER LA TABLE</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 1 }} />
        )}

        <View style={styles.bankrollTag}>
          <Coins size={12} color="#a3a3a3" />
          <Text style={styles.bankrollText}>{credits} CR</Text>
        </View>
      </View>

      {/* CONTENU PRINCIPAL */}
      <View style={styles.mainContent}>

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
                <TouchableOpacity style={styles.heroPlayBtn} onPress={() => setActiveTab('GAME')}>
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

        {/* TAB 2: TABLE DE JEU - DESIGN NOIR OFFSUIT ORIGINAL */}
        {activeTab === 'GAME' && (
          <View style={styles.gameContainer}>
            <View style={styles.tableFrame}>
              <View style={styles.tableInnerFelt}>

                {/* VISUEL PIOCHE / SABOT COMPLET (3D MULTI-LAYER DECK SHOE) */}
                <View style={styles.fullShoeContainer}>
                  <View style={styles.shoeStack3} />
                  <View style={styles.shoeStack2} />
                  <View style={styles.shoeStack1} />
                  <View style={styles.shoeMainBox}>
                    <Layers size={14} color="#a3a3a3" />
                    <Text style={styles.shoeText}>{cardsRemaining} cartes</Text>
                  </View>
                </View>
                
                {/* FILIGRANE TABLE ORIGINAL */}
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

                  <Animated.View style={[styles.cardsRow, { opacity: cardOpacity, transform: [{ translateY: cardTranslateY }] }]}>
                    {game ? (
                      game.dealerHand.map((card, idx) => (
                        <View key={card.id || idx} style={card.faceUp ? styles.cardFront : styles.cardBack}>
                          {card.faceUp ? (
                            <>
                              <Text style={card.isRed ? styles.cardRankRed : styles.cardRankBlack}>{card.rank}</Text>
                              <Text style={card.isRed ? styles.cardSuitRed : styles.cardSuitBlack}>{card.suit}</Text>
                            </>
                          ) : (
                            <View style={styles.cardBackInner}>
                              <Text style={styles.cardBackSymbol}>♠</Text>
                            </View>
                          )}
                        </View>
                      ))
                    ) : (
                      <View style={styles.emptyCardSlot}>
                        <Text style={styles.emptySlotText}>ATTENTE DE MANCHE</Text>
                      </View>
                    )}
                  </Animated.View>
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

                  <Animated.View style={[styles.cardsRow, { opacity: cardOpacity, transform: [{ translateY: cardTranslateY }] }]}>
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
                                  <View key={card.id || cIdx} style={styles.cardFrontCompact}>
                                    <Text style={card.isRed ? styles.cardRankRedSmall : styles.cardRankBlackSmall}>{card.rank}</Text>
                                    <Text style={card.isRed ? styles.cardSuitRedSmall : styles.cardSuitBlackSmall}>{card.suit}</Text>
                                  </View>
                                ))}
                              </View>
                            </View>
                          ))}
                        </View>
                      ) : (
                        game.playerHand.map((card, idx) => (
                          <View key={card.id || idx} style={styles.cardFront}>
                            <Text style={card.isRed ? styles.cardRankRed : styles.cardRankBlack}>{card.rank}</Text>
                            <Text style={card.isRed ? styles.cardSuitRed : styles.cardSuitBlack}>{card.suit}</Text>
                          </View>
                        ))
                      )
                    ) : (
                      <View style={styles.emptyCardSlot}>
                        <Text style={styles.emptySlotText}>PLACEZ VOS JETONS</Text>
                      </View>
                    )}
                  </Animated.View>
                </View>

              </View>
            </View>

            {/* CONTROLES DE MANCHE */}
            <View style={styles.gameControlsPanel}>
              {game && game.status === 'PLAYING' ? (
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
              ) : game && game.status === 'FINISHED' ? (
                /* REJOUER / NETTOYER LES CARTES */
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

                  <View style={styles.stackedChipsRow}>
                    {betChips.length === 0 ? (
                      <Text style={styles.noChipsHint}>Touche un jeton pour miser</Text>
                    ) : (
                      betChips.map((val, i) => (
                        <View key={i} style={{ marginLeft: i > 0 ? -16 : 0, zIndex: i }}>
                          <CasinoChip value={val} onPress={() => handleRemoveChip(i)} />
                        </View>
                      ))
                    )}
                  </View>

                  <View style={styles.chipBar}>
                    {CHIP_VALUES.map((val) => (
                      <CasinoChip key={val} value={val} onPress={() => handleAddChip(val)} />
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

        {/* TAB 3: PROFIL */}
        {activeTab === 'PROFILE' && (
          <ScrollView contentContainerStyle={styles.profileScroll}>
            {profileSubSection ? (
              <View style={styles.subSectionContainer}>
                <TouchableOpacity 
                  style={styles.backToProfileBtn} 
                  onPress={() => setProfileSubSection(null)}
                >
                  <Text style={styles.backToProfileText}>← RETOUR PROFIL</Text>
                </TouchableOpacity>

                {profileSubSection === 'STATS' && (
                  <View style={styles.subCard}>
                    <Text style={styles.subTitle}>STATISTIQUES DÉTAILLÉES</Text>
                    <Text style={styles.subText}>• Total Manches : {history.length}</Text>
                    <Text style={styles.subText}>• Victoires : {history.filter(h => h.type === 'WIN' || h.type === 'BLACKJACK').length}</Text>
                    <Text style={styles.subText}>• Taux de Victoire : 60%</Text>
                    <Text style={styles.subText}>• Blackjacks : 1</Text>
                  </View>
                )}

                {profileSubSection === 'SETTINGS' && (
                  <View style={styles.subCard}>
                    <Text style={styles.subTitle}>PARAMÈTRES DU COMPTE</Text>
                    <Text style={styles.subText}>• Pseudo : Offsuit_Player</Text>
                    <Text style={styles.subText}>• Effets sonores : Activé</Text>
                    <Text style={styles.subText}>• Thème : Sombre Épuré</Text>
                  </View>
                )}

                {profileSubSection === 'ACHIEVEMENTS' && (
                  <View style={styles.subCard}>
                    <Text style={styles.subTitle}>SUCCÈS & TROPHÉES</Text>
                    <Text style={styles.subText}>🏆 Premier Blackjack — Débloqué</Text>
                    <Text style={styles.subText}>🏆 Série de 3 Victoires — Débloqué</Text>
                    <Text style={styles.subText}>🔒 High Roller (Mise 100 CR) — Verrouillé</Text>
                  </View>
                )}

                {profileSubSection === 'LEARN' && (
                  <View style={styles.subCard}>
                    <Text style={styles.subTitle}>RÈGLES DU BLACKJACK</Text>
                    <Text style={styles.subText}>• Atteignez 21 sans le dépasser.</Text>
                    <Text style={styles.subText}>• Le Croupier s'arrête à 17 ou plus.</Text>
                    <Text style={styles.subText}>• Les As valent 1 ou 11 au choix.</Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.profileMenuContainer}>
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
                  <TouchableOpacity style={styles.menuOptionRow} onPress={() => setProfileSubSection('STATS')}>
                    <View style={styles.optionLeft}>
                      <TrendingUp size={18} color="#a3a3a3" />
                      <Text style={styles.optionLabel}>Statistiques de jeu</Text>
                    </View>
                    <ChevronRight size={16} color="#525252" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.menuOptionRow} onPress={() => setProfileSubSection('ACHIEVEMENTS')}>
                    <View style={styles.optionLeft}>
                      <Award size={18} color="#a3a3a3" />
                      <Text style={styles.optionLabel}>Succès & Trophées</Text>
                    </View>
                    <ChevronRight size={16} color="#525252" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.menuOptionRow} onPress={() => setProfileSubSection('LEARN')}>
                    <View style={styles.optionLeft}>
                      <HelpCircle size={18} color="#a3a3a3" />
                      <Text style={styles.optionLabel}>Règles & Stratégie</Text>
                    </View>
                    <ChevronRight size={16} color="#525252" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.menuOptionRow} onPress={() => setProfileSubSection('SETTINGS')}>
                    <View style={styles.optionLeft}>
                      <Settings size={18} color="#a3a3a3" />
                      <Text style={styles.optionLabel}>Paramètres</Text>
                    </View>
                    <ChevronRight size={16} color="#525252" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        )}

      </View>

      {/* BARRE EN BAS (MASQUÉE PENDANT LE JEU) */}
      {activeTab !== 'GAME' && (
        <View style={styles.bottomTabBar}>
          <View style={[styles.tabItem, styles.tabItemDisabled]}>
            <ShoppingBag size={20} color="#404040" />
            <Text style={styles.tabLabelDisabled}>BOUTIQUE</Text>
          </View>

          <TouchableOpacity 
            style={[styles.tabItem, activeTab === 'HOME' && styles.tabItemActive]} 
            onPress={() => { setActiveTab('HOME'); setProfileSubSection(null); }}
          >
            <Home size={22} color={activeTab === 'HOME' ? '#ffffff' : '#737373'} />
            <Text style={[activeTab === 'HOME' ? styles.tabLabelActive : styles.tabLabel]}>ACCUEIL</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabItem, activeTab === 'PROFILE' && styles.tabItemActive]} 
            onPress={() => setActiveTab('PROFILE')}
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

  /* GAME STYLES - RESTAURÉ TABLE SOMBRE DE LUXE OFFSUIT */
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
    backgroundColor: '#111111', // FOND NOIR / SOMBRE ORIGINAL
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    position: 'relative',
  },
  
  /* PIOCHE 3D STACKED SHOE */
  fullShoeContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 10,
  },
  shoeStack3: {
    position: 'absolute',
    top: -6,
    left: -6,
    width: 60,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#991b1b',
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  shoeStack2: {
    position: 'absolute',
    top: -3,
    left: -3,
    width: 60,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#7f1d1d',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  shoeStack1: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 60,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#450a0a',
    borderWidth: 1,
    borderColor: '#dc2626',
  },
  shoeMainBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#171717',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#404040',
    marginTop: 6,
    marginLeft: 6,
  },
  shoeText: {
    color: '#e5e5e5',
    fontSize: 9,
    fontWeight: '900',
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
    gap: 8,
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
    backgroundColor: '#991b1b',
    borderRadius: 8,
    padding: 3,
    borderWidth: 1.5,
    borderColor: '#e5e5e5',
  },
  cardBackInner: {
    flex: 1,
    backgroundColor: '#7f1d1d',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBackSymbol: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  cardRankRed: { color: '#dc2626', fontWeight: '900', fontSize: 18 },
  cardSuitRed: { color: '#dc2626', fontSize: 16 },
  cardRankBlack: { color: '#171717', fontWeight: '900', fontSize: 18 },
  cardSuitBlack: { color: '#171717', fontSize: 16 },
  emptyCardSlot: {
    width: 120,
    height: 84,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#262626',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySlotText: {
    color: '#404040',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
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
    gap: 4,
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
  cardRankRedSmall: { color: '#dc2626', fontWeight: '900', fontSize: 14 },
  cardSuitRedSmall: { color: '#dc2626', fontSize: 12 },
  cardRankBlackSmall: { color: '#171717', fontWeight: '900', fontSize: 14 },
  cardSuitBlackSmall: { color: '#171717', fontSize: 12 },

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
  actionRow: {
    flexDirection: 'row',
    gap: 8,
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
  stackedChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
  },
  noChipsHint: {
    color: '#404040',
    fontSize: 11,
    fontStyle: 'italic',
  },
  chipBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  casinoChip: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipInnerRing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipCenterCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipValueText: {
    fontWeight: '900',
    fontSize: 11,
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

  /* PROFILE STYLES */
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
    gap: 10,
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
    fontSize: 13,
    fontWeight: '600',
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

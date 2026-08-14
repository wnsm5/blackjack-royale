import './polyfill';
import { registerRootComponent } from 'expo';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';

const CHIP_VALUES = [1, 2, 5, 10, 20];

// Custom authentic Casino Chip component in React Native
function CasinoChip({ value, onPress, onLongPress }) {
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
      onLongPress={onLongPress}
      activeOpacity={0.8}
    >
      {/* Dashed outer ring pattern */}
      <View style={[styles.chipInnerRing, { borderColor: chipColors.stripe }]}>
        <View style={styles.chipCenterCircle}>
          <Text style={[styles.chipValueText, { color: chipColors.text }]}>{value}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('TABLE'); // 'TABLE' | 'STATS' | 'HISTORY' | 'PROFILE'
  const [credits, setCredits] = useState(100);
  const [currentBet, setCurrentBet] = useState(10);
  const [betChips, setBetChips] = useState([]);
  
  // Real Game Engine state
  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);
  const [gameResult, setGameResult] = useState(null);

  // Add chip
  const handleAddChip = (val) => {
    const total = betChips.reduce((a, c) => a + c, 0);
    if (total + val <= credits) {
      const newChips = [...betChips, val];
      setBetChips(newChips);
      setCurrentBet(total + val);
    }
  };

  // Remove chip
  const handleRemoveChip = (idx) => {
    const newChips = betChips.filter((_, i) => i !== idx);
    setBetChips(newChips);
    setCurrentBet(newChips.reduce((a, c) => a + c, 0));
  };

  const handleClearChips = () => {
    setBetChips([]);
    setCurrentBet(0);
  };

  // Game Engine Actions
  const handleStartGame = () => {
    if (currentBet <= 0 || currentBet > credits) return;
    setGameResult(null);
    
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
    
    const getRandomCard = (faceUp = true) => {
      const rank = ranks[Math.floor(Math.random() * ranks.length)];
      const suit = suits[Math.floor(Math.random() * suits.length)];
      const val = ['J','Q','K'].includes(rank) ? 10 : rank === 'A' ? 11 : parseInt(rank);
      return { rank, suit, val, isRed: suit === '♥' || suit === '♦', faceUp };
    };

    const pCard1 = getRandomCard();
    const pCard2 = getRandomCard();
    const dCard1 = getRandomCard();
    const dCard2 = getRandomCard(false);

    const calcScore = (cards) => {
      let score = cards.filter(c => c.faceUp).reduce((a, c) => a + c.val, 0);
      let aces = cards.filter(c => c.faceUp && c.rank === 'A').length;
      while (score > 21 && aces > 0) {
        score -= 10;
        aces -= 1;
      }
      return score;
    };

    const newGame = {
      playerHand: [pCard1, pCard2],
      dealerHand: [dCard1, dCard2],
      playerScore: calcScore([pCard1, pCard2]),
      dealerScore: calcScore([dCard1]),
      status: 'PLAYING',
      bet: currentBet,
    };

    setCredits(prev => prev - currentBet);
    setGame(newGame);
  };

  const handleHit = () => {
    if (!game || game.status !== 'PLAYING') return;
    
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
    const rank = ranks[Math.floor(Math.random() * ranks.length)];
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const val = ['J','Q','K'].includes(rank) ? 10 : rank === 'A' ? 11 : parseInt(rank);
    const newCard = { rank, suit, val, isRed: suit === '♥' || suit === '♦', faceUp: true };

    const updatedHand = [...game.playerHand, newCard];
    
    let score = updatedHand.reduce((a, c) => a + c.val, 0);
    let aces = updatedHand.filter(c => c.rank === 'A').length;
    while (score > 21 && aces > 0) {
      score -= 10;
      aces -= 1;
    }

    if (score > 21) {
      setGame({
        ...game,
        playerHand: updatedHand,
        playerScore: score,
        status: 'FINISHED',
      });
      setGameResult('BUST - PERDU !');
    } else {
      setGame({
        ...game,
        playerHand: updatedHand,
        playerScore: score,
      });
    }
  };

  const handleStand = () => {
    if (!game || game.status !== 'PLAYING') return;

    const updatedDealerHand = game.dealerHand.map(c => ({ ...c, faceUp: true }));
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];

    const calcScore = (cards) => {
      let score = cards.reduce((a, c) => a + c.val, 0);
      let aces = cards.filter(c => c.rank === 'A').length;
      while (score > 21 && aces > 0) {
        score -= 10;
        aces -= 1;
      }
      return score;
    };

    let dScore = calcScore(updatedDealerHand);
    while (dScore < 17) {
      const rank = ranks[Math.floor(Math.random() * ranks.length)];
      const suit = suits[Math.floor(Math.random() * suits.length)];
      const val = ['J','Q','K'].includes(rank) ? 10 : rank === 'A' ? 11 : parseInt(rank);
      updatedDealerHand.push({ rank, suit, val, isRed: suit === '♥' || suit === '♦', faceUp: true });
      dScore = calcScore(updatedDealerHand);
    }

    let result = '';
    let winAmount = 0;
    if (dScore > 21 || game.playerScore > dScore) {
      result = 'GAGNÉ !';
      winAmount = game.bet * 2;
      setCredits(prev => prev + winAmount);
    } else if (game.playerScore === dScore) {
      result = 'ÉGALITÉ !';
      winAmount = game.bet;
      setCredits(prev => prev + winAmount);
    } else {
      result = 'PERDU !';
    }

    setGame({
      ...game,
      dealerHand: updatedDealerHand,
      dealerScore: dScore,
      status: 'FINISHED',
    });
    setGameResult(result);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      {/* HEADER DISCRET OFFSUIT (SOLDE ET NOM DU JEU) */}
      <View style={styles.header}>
        <View style={styles.brandGroup}>
          <Text style={styles.brandTitle}>OFFSUIT ♠</Text>
        </View>

        <View style={styles.bankrollBadge}>
          <Text style={styles.bankrollLabel}>SOLDE</Text>
          <Text style={styles.bankrollValue}>{credits} CR</Text>
        </View>
      </View>

      {/* VUE PRINCIPALE (TABLE / STATS / HISTORIQUE / PROFIL) */}
      {activeTab === 'TABLE' && (
        <View style={styles.gameContent}>
          {/* TAPIS NOIR AVEC BORDURE OVALE DE TABLE DE CASINO */}
          <View style={styles.tableOvalFrame}>
            <View style={styles.tableInnerFelt}>
              
              {/* Sabot & Titre Table */}
              <View style={styles.tableCenterMarking}>
                <Text style={styles.tableArcText}>BLACKJACK PAYS 3 TO 2</Text>
                <Text style={styles.tableSubArcText}>DEALER MUST DRAW TO 16 AND STAND ON ALL 17S</Text>
              </View>

              {/* DEALER HAND */}
              <View style={styles.handSection}>
                <View style={styles.handHeader}>
                  <Text style={styles.feltLabel}>CROUPIER</Text>
                  {game && (
                    <View style={styles.scoreTag}>
                      <Text style={styles.scoreTagText}>{game.dealerScore}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.cardsRow}>
                  {game ? (
                    game.dealerHand.map((card, idx) => (
                      <View key={idx} style={card.faceUp ? styles.cardFront : styles.cardBack}>
                        {card.faceUp ? (
                          <>
                            <Text style={card.isRed ? styles.cardRankRed : styles.cardRankBlack}>{card.rank}</Text>
                            <Text style={card.isRed ? styles.cardSuitRed : styles.cardSuitBlack}>{card.suit}</Text>
                          </>
                        ) : (
                          <View style={styles.cardBackPattern}>
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
                </View>
              </View>

              {/* BANNIÈRE RÉSULTAT */}
              {gameResult && (
                <View style={styles.resultBanner}>
                  <Text style={styles.resultBannerText}>{gameResult}</Text>
                </View>
              )}

              {/* PLAYER HAND */}
              <View style={styles.handSection}>
                <View style={styles.handHeader}>
                  <Text style={styles.feltLabel}>JOUEUR</Text>
                  {game && (
                    <View style={styles.scoreTag}>
                      <Text style={styles.scoreTagText}>{game.playerScore}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.cardsRow}>
                  {game ? (
                    game.playerHand.map((card, idx) => (
                      <View key={idx} style={styles.cardFront}>
                        <Text style={card.isRed ? styles.cardRankRed : styles.cardRankBlack}>{card.rank}</Text>
                        <Text style={card.isRed ? styles.cardSuitRed : styles.cardSuitBlack}>{card.suit}</Text>
                      </View>
                    ))
                  ) : (
                    <View style={styles.emptyCardSlot}>
                      <Text style={styles.emptySlotText}>PLACEZ VOS JETONS</Text>
                    </View>
                  )}
                </View>
              </View>

            </View>
          </View>

          {/* PANNEAU DES ACTION / MISE */}
          <View style={styles.bettingControlPanel}>
            {game && game.status === 'PLAYING' ? (
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.hitBtn} onPress={handleHit}>
                  <Text style={styles.actionBtnText}>TIRER</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.standBtn} onPress={handleStand}>
                  <Text style={styles.actionBtnText}>RESTER</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.bettingControls}>
                <View style={styles.betHeaderRow}>
                  <Text style={styles.betTotalText}>MISE : {currentBet} CR</Text>
                  {betChips.length > 0 && (
                    <TouchableOpacity onPress={handleClearChips}>
                      <Text style={styles.clearBetText}>EFFACER</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Jetons empilés de mise */}
                <View style={styles.stackedChipsContainer}>
                  {betChips.length === 0 ? (
                    <Text style={styles.noChipsHint}>Sélectionnez des jetons ci-dessous</Text>
                  ) : (
                    <View style={styles.stackedChipsRow}>
                      {betChips.map((val, i) => (
                        <View key={i} style={{ marginLeft: i > 0 ? -16 : 0, zIndex: i }}>
                          <CasinoChip value={val} onPress={() => handleRemoveChip(i)} />
                        </View>
                      ))}
                    </View>
                  )}
                </View>

                {/* Jetons disponibles 1, 2, 5, 10, 20 */}
                <View style={styles.chipBar}>
                  {CHIP_VALUES.map((val) => (
                    <CasinoChip key={val} value={val} onPress={() => handleAddChip(val)} />
                  ))}
                </View>

                <TouchableOpacity 
                  style={[styles.dealBtn, (currentBet <= 0 || currentBet > credits) && styles.dealBtnDisabled]} 
                  onPress={handleStartGame}
                  disabled={currentBet <= 0 || currentBet > credits}
                >
                  <Text style={styles.dealBtnText}>DISTRIBUER ({currentBet} CR)</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}

      {activeTab === 'STATS' && (
        <ScrollView contentContainerStyle={styles.subPageContent}>
          <Text style={styles.subPageTitle}>STATISTIQUES DE JEU</Text>
          <View style={styles.subPageCard}>
            <Text style={styles.subCardLabel}>Manches Jouées : 42</Text>
            <Text style={styles.subCardLabel}>Taux de Victoire : 54%</Text>
            <Text style={styles.subCardLabel}>Blackjacks : 7</Text>
            <Text style={styles.subCardLabel}>Profit Net : +180 CR</Text>
          </View>
        </ScrollView>
      )}

      {activeTab === 'HISTORY' && (
        <ScrollView contentContainerStyle={styles.subPageContent}>
          <Text style={styles.subPageTitle}>HISTORIQUE DES MANCHES</Text>
          <View style={styles.subPageCard}>
            <Text style={styles.subCardLabel}>#104 • GAGNÉ (+20 CR)</Text>
            <Text style={styles.subCardLabel}>#103 • PERDU (-10 CR)</Text>
            <Text style={styles.subCardLabel}>#102 • BLACKJACK (+25 CR)</Text>
            <Text style={styles.subCardLabel}>#101 • ÉGALITÉ (+10 CR)</Text>
          </View>
        </ScrollView>
      )}

      {activeTab === 'PROFILE' && (
        <ScrollView contentContainerStyle={styles.subPageContent}>
          <Text style={styles.subPageTitle}>PROFIL JOUEUR</Text>
          <View style={styles.subPageCard}>
            <Text style={styles.subCardLabel}>Pseudo : Offsuit_Player</Text>
            <Text style={styles.subCardLabel}>Bankroll : {credits} CR</Text>
            <Text style={styles.subCardLabel}>Niveau : 5 (Pro)</Text>
          </View>
        </ScrollView>
      )}

      {/* NAVIGATION DU BAS (STYLE NATIVE BAR EN BAS) */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity 
          style={[styles.tabBarItem, activeTab === 'TABLE' && styles.tabBarItemActive]} 
          onPress={() => setActiveTab('TABLE')}
        >
          <Text style={[styles.tabBarIcon, activeTab === 'TABLE' && styles.tabBarTextActive]}>♠</Text>
          <Text style={[styles.tabBarLabel, activeTab === 'TABLE' && styles.tabBarTextActive]}>TABLE</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabBarItem, activeTab === 'STATS' && styles.tabBarItemActive]} 
          onPress={() => setActiveTab('STATS')}
        >
          <Text style={[styles.tabBarIcon, activeTab === 'STATS' && styles.tabBarTextActive]}>📊</Text>
          <Text style={[styles.tabBarLabel, activeTab === 'STATS' && styles.tabBarTextActive]}>STATS</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabBarItem, activeTab === 'HISTORY' && styles.tabBarItemActive]} 
          onPress={() => setActiveTab('HISTORY')}
        >
          <Text style={[styles.tabBarIcon, activeTab === 'HISTORY' && styles.tabBarTextActive]}>📜</Text>
          <Text style={[styles.tabBarLabel, activeTab === 'HISTORY' && styles.tabBarTextActive]}>HISTO</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabBarItem, activeTab === 'PROFILE' && styles.tabBarItemActive]} 
          onPress={() => setActiveTab('PROFILE')}
        >
          <Text style={[styles.tabBarIcon, activeTab === 'PROFILE' && styles.tabBarTextActive]}>👤</Text>
          <Text style={[styles.tabBarLabel, activeTab === 'PROFILE' && styles.tabBarTextActive]}>PROFIL</Text>
        </TouchableOpacity>
      </View>

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
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 2,
  },
  bankrollBadge: {
    backgroundColor: '#171717',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'flex-end',
  },
  bankrollLabel: {
    color: '#737373',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },
  bankrollValue: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 12,
  },
  gameContent: {
    flex: 1,
  },
  tableOvalFrame: {
    flex: 1,
    margin: 12,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#262626',
    backgroundColor: '#0d0d0d',
    padding: 10,
  },
  tableInnerFelt: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1c1c1c',
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    position: 'relative',
  },
  tableCenterMarking: {
    position: 'absolute',
    top: '38%',
    alignItems: 'center',
    opacity: 0.25,
  },
  tableArcText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 3,
  },
  tableSubArcText: {
    color: '#a3a3a3',
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 4,
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
  scoreTag: {
    backgroundColor: '#262626',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  scoreTagText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 10,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  cardFront: {
    width: 60,
    height: 88,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#d4d4d4',
  },
  cardBack: {
    width: 60,
    height: 88,
    backgroundColor: '#991b1b',
    borderRadius: 8,
    padding: 3,
    borderWidth: 1.5,
    borderColor: '#e5e5e5',
  },
  cardBackPattern: {
    flex: 1,
    backgroundColor: '#7f1d1d',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fca5a5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBackSymbol: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  cardRankRed: {
    color: '#dc2626',
    fontWeight: '900',
    fontSize: 20,
  },
  cardSuitRed: {
    color: '#dc2626',
    fontSize: 18,
  },
  cardRankBlack: {
    color: '#171717',
    fontWeight: '900',
    fontSize: 20,
  },
  cardSuitBlack: {
    color: '#171717',
    fontSize: 18,
  },
  emptyCardSlot: {
    width: 120,
    height: 88,
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
  bettingControlPanel: {
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#1f1f1f',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  hitBtn: {
    flex: 1,
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  standBtn: {
    flex: 1,
    backgroundColor: '#dc2626',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 1,
  },
  bettingControls: {
    width: '100%',
  },
  betHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  betTotalText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1,
  },
  clearBetText: {
    color: '#f43f5e',
    fontWeight: '800',
    fontSize: 10,
  },
  stackedChipsContainer: {
    minHeight: 46,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  noChipsHint: {
    color: '#404040',
    fontSize: 11,
    fontStyle: 'italic',
  },
  stackedChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  casinoChip: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
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
    width: 26,
    height: 26,
    borderRadius: 13,
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
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: '#121212',
    borderTopWidth: 1,
    borderTopColor: '#262626',
    paddingVertical: 6,
  },
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  tabBarItemActive: {
    borderTopWidth: 2,
    borderTopColor: '#e11d48',
  },
  tabBarIcon: {
    fontSize: 16,
    color: '#525252',
  },
  tabBarLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#525252',
    marginTop: 2,
    letterSpacing: 1,
  },
  tabBarTextActive: {
    color: '#ffffff',
  },
  subPageContent: {
    padding: 20,
  },
  subPageTitle: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1,
    marginBottom: 16,
  },
  subPageCard: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#262626',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  subCardLabel: {
    color: '#a3a3a3',
    fontSize: 13,
    fontWeight: '700',
  },
});

registerRootComponent(App);

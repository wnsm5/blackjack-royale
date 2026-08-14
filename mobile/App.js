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
  ActivityIndicator,
} from 'react-native';

const RENDER_API_URL = 'https://blackjack-api-w1ej.onrender.com/api';
const CHIP_VALUES = [1, 2, 5, 10, 20];

function App() {
  const [activeTab, setActiveTab] = useState('HOME');
  const [credits, setCredits] = useState(100);
  const [currentBet, setCurrentBet] = useState(10);
  const [betChips, setBetChips] = useState([]);
  
  // Real Game Engine state
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gameResult, setGameResult] = useState(null);

  // Helper for API calls
  const apiCall = async (endpoint, body = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${RENDER_API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erreur réseau');
      }
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

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
  const handleStartGame = async () => {
    if (currentBet <= 0 || currentBet > credits) return;
    setGameResult(null);
    
    // Fallback engine if backend is offline or for instant play
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

    // Reveal dealer holecard
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

      {/* HEADER OFFSUIT SOBRE NOIR & CONTOUR GRIS */}
      <View style={styles.header}>
        <View style={styles.brandGroup}>
          <View style={styles.brandIcon}>
            <Text style={styles.brandIconText}>♠</Text>
          </View>
          <Text style={styles.brandTitle}>BLACKJACK</Text>
        </View>

        <View style={styles.creditsBadge}>
          <Text style={styles.creditsLabel}>BANKROLL</Text>
          <Text style={styles.creditsText}>{credits} CR</Text>
        </View>

        {activeTab === 'HOME' ? (
          <TouchableOpacity style={styles.playHeaderBtn} onPress={() => setActiveTab('GAME')}>
            <Text style={styles.playHeaderBtnText}>JOUER ♠</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.menuHeaderBtn} onPress={() => setActiveTab('HOME')}>
            <Text style={styles.menuHeaderBtnText}>← MENU</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* NAVIGATION */}
      {activeTab === 'HOME' ? (
        <ScrollView contentContainerStyle={styles.homeContent}>
          <Text style={styles.welcomeTitle}>EXPO CASINO OFFSUIT</Text>
          <Text style={styles.welcomeSub}>Design sombre épuré & réponse natif ultra-rapide</Text>

          <TouchableOpacity style={styles.bigPlayBtn} onPress={() => setActiveTab('GAME')}>
            <Text style={styles.bigPlayBtnText}>LANCER UNE PARTIE ♠</Text>
          </TouchableOpacity>

          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>SPÉCIFICATIONS TABLE OFFSUIT</Text>
            <Text style={styles.statsText}>• Fond noir mat & bordures gris métallisé</Text>
            <Text style={styles.statsText}>• Cartes au dos rouge & motif géométrique</Text>
            <Text style={styles.statsText}>• Moteur Blackjack instantané intégré</Text>
            <Text style={styles.statsText}>• Jetons : 1, 2, 5, 10, 20 CR</Text>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.gameContent}>
          
          {/* TAPIS NOIR AVEC MOTIFS GÉOMÉTRIQUES GOBELIN / POKER */}
          <View style={styles.tableFelt}>
            <View style={styles.feltPatternOverlay} />

            {/* ERROR BANNER */}
            {error && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* DEALER SECTION */}
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
                        <View style={styles.cardBackInner}>
                          <Text style={styles.cardBackIcon}>♠</Text>
                        </View>
                      )}
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyCardSlot}>
                    <Text style={styles.emptySlotText}>PAS DE MANCHE</Text>
                  </View>
                )}
              </View>
            </View>

            {/* RESULT BLAZON */}
            {gameResult && (
              <View style={styles.resultBlazon}>
                <Text style={styles.resultBlazonText}>{gameResult}</Text>
              </View>
            )}

            {/* PLAYER SECTION */}
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
                    <Text style={styles.emptySlotText}>PLACEZ VOTRE MISE</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* CONTROLES DE MISE & JEU */}
          <View style={styles.bettingPanel}>
            
            {game && game.status === 'PLAYING' ? (
              /* ACTION BUTTONS (TIRER / RESTER) */
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.hitBtn} onPress={handleHit} disabled={loading}>
                  <Text style={styles.hitBtnText}>TIRER</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.standBtn} onPress={handleStand} disabled={loading}>
                  <Text style={styles.standBtnText}>RESTER</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* BETTING STACK AND CHIPS SELECTOR */
              <View style={styles.betSection}>
                <View style={styles.betTitleRow}>
                  <Text style={styles.betTitle}>MISE : {currentBet} CR</Text>
                  {betChips.length > 0 && (
                    <TouchableOpacity onPress={handleClearChips}>
                      <Text style={styles.clearBtnText}>EFFACER</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Jetons empilés */}
                <View style={styles.placedChipsRow}>
                  {betChips.length === 0 ? (
                    <Text style={styles.noChipsText}>Touche un jeton pour miser</Text>
                  ) : (
                    betChips.map((val, i) => (
                      <TouchableOpacity key={i} style={styles.placedChip} onPress={() => handleRemoveChip(i)}>
                        <Text style={styles.placedChipText}>{val}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </View>

                {/* Jetons 1, 2, 5, 10, 20 */}
                <View style={styles.chipsRow}>
                  {CHIP_VALUES.map((val) => (
                    <TouchableOpacity key={val} style={styles.chipBtn} onPress={() => handleAddChip(val)}>
                      <Text style={styles.chipBtnText}>{val}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity 
                  style={[styles.dealBtn, (currentBet <= 0 || currentBet > credits) && styles.dealBtnDisabled]} 
                  onPress={handleStartGame}
                  disabled={currentBet <= 0 || currentBet > credits || loading}
                >
                  <Text style={styles.dealBtnText}>
                    {loading ? 'CHARGEMENT...' : `DISTRIBUER (${currentBet} CR)`}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}
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
    paddingVertical: 12,
    backgroundColor: '#121212',
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#404040',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandIconText: {
    color: '#e5e5e5',
    fontWeight: '900',
    fontSize: 16,
  },
  brandTitle: {
    color: '#f5f5f5',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
  creditsBadge: {
    backgroundColor: '#171717',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
  },
  creditsLabel: {
    color: '#737373',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  creditsText: {
    color: '#e5e5e5',
    fontWeight: '900',
    fontSize: 12,
  },
  playHeaderBtn: {
    backgroundColor: '#e11d48',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  playHeaderBtnText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  menuHeaderBtn: {
    backgroundColor: '#262626',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#404040',
  },
  menuHeaderBtnText: {
    color: '#e5e5e5',
    fontWeight: '700',
    fontSize: 12,
  },
  homeContent: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 20,
    letterSpacing: 1,
  },
  welcomeSub: {
    color: '#a3a3a3',
    fontSize: 13,
    marginBottom: 30,
  },
  bigPlayBtn: {
    backgroundColor: '#e11d48',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f43f5e',
  },
  bigPlayBtnText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 1,
  },
  statsCard: {
    backgroundColor: '#121212',
    borderColor: '#262626',
    borderWidth: 1,
    width: '100%',
    padding: 20,
    borderRadius: 16,
    marginTop: 30,
  },
  statsTitle: {
    color: '#e5e5e5',
    fontWeight: '900',
    fontSize: 14,
    marginBottom: 10,
    letterSpacing: 1,
  },
  statsText: {
    color: '#a3a3a3',
    fontSize: 13,
    marginVertical: 4,
  },
  gameContent: {
    flex: 1,
  },
  tableFelt: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 16,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  feltPatternOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: '#0a0a0a',
    opacity: 0.5,
    borderWidth: 1,
    borderColor: '#1f1f1f',
  },
  errorBanner: {
    backgroundColor: '#7f1d1d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f87171',
    zIndex: 20,
  },
  errorText: {
    color: '#fef2f2',
    fontSize: 12,
    fontWeight: '700',
  },
  handSection: {
    alignItems: 'center',
    gap: 8,
    zIndex: 10,
  },
  handHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  feltLabel: {
    color: '#737373',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1.5,
  },
  scoreTag: {
    backgroundColor: '#262626',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#404040',
  },
  scoreTagText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 11,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  cardFront: {
    width: 64,
    height: 94,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#d4d4d4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  cardBack: {
    width: 64,
    height: 94,
    backgroundColor: '#991b1b',
    borderRadius: 8,
    padding: 3,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  cardBackInner: {
    flex: 1,
    backgroundColor: '#7f1d1d',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fca5a5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBackIcon: {
    color: '#fef2f2',
    fontSize: 22,
    fontWeight: '900',
  },
  cardRankRed: {
    color: '#dc2626',
    fontWeight: '900',
    fontSize: 22,
  },
  cardSuitRed: {
    color: '#dc2626',
    fontSize: 20,
  },
  cardRankBlack: {
    color: '#171717',
    fontWeight: '900',
    fontSize: 22,
  },
  cardSuitBlack: {
    color: '#171717',
    fontSize: 20,
  },
  emptyCardSlot: {
    width: 140,
    height: 94,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#262626',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0d0d0d',
  },
  emptySlotText: {
    color: '#525252',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  resultBlazon: {
    backgroundColor: '#e11d48',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fda4af',
    zIndex: 20,
  },
  resultBlazonText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 1,
  },
  bettingPanel: {
    backgroundColor: '#0a0a0a',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#262626',
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    paddingVertical: 10,
  },
  hitBtn: {
    flex: 1,
    backgroundColor: '#16a34a',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4ade80',
  },
  hitBtnText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1,
  },
  standBtn: {
    flex: 1,
    backgroundColor: '#dc2626',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  standBtnText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1,
  },
  betSection: {
    width: '100%',
    alignItems: 'center',
  },
  betTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  betTitle: {
    color: '#e5e5e5',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1,
  },
  clearBtnText: {
    color: '#f43f5e',
    fontWeight: '800',
    fontSize: 11,
  },
  placedChipsRow: {
    flexDirection: 'row',
    gap: 8,
    minHeight: 44,
    alignItems: 'center',
    marginBottom: 12,
  },
  noChipsText: {
    color: '#525252',
    fontSize: 12,
    fontStyle: 'italic',
  },
  placedChip: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#262626',
    borderWidth: 2,
    borderColor: '#525252',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placedChipText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 12,
  },
  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 14,
  },
  chipBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#171717',
    borderWidth: 2,
    borderColor: '#404040',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipBtnText: {
    color: '#e5e5e5',
    fontWeight: '900',
    fontSize: 13,
  },
  dealBtn: {
    backgroundColor: '#e11d48',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f43f5e',
  },
  dealBtnDisabled: {
    opacity: 0.3,
  },
  dealBtnText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 1,
  },
});

registerRootComponent(App);

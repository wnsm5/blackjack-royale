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
} from 'react-native';
import {
  ShoppingBag,
  Home,
  User,
  Play,
  TrendingUp,
  Award,
  History,
  Settings,
  HelpCircle,
  RotateCcw,
  ChevronRight,
  ShieldAlert,
  Coins
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
  const [activeTab, setActiveTab] = useState('HOME'); // 'HOME' | 'GAME' | 'PROFILE' | 'PROFILE_SUB'
  const [profileSubSection, setProfileSubSection] = useState(null); // 'STATS' | 'HISTORY' | 'ACHIEVEMENTS' | 'SETTINGS' | 'LEARN'
  
  const [credits, setCredits] = useState(100);
  const [currentBet, setCurrentBet] = useState(10);
  const [betChips, setBetChips] = useState([]);
  
  // Game Engine state
  const [game, setGame] = useState(null);
  const [gameResult, setGameResult] = useState(null);

  // Match History state (for home view & profile history)
  const [history, setHistory] = useState([
    { id: 1, type: 'WIN', bet: 10, payout: +20, score: '20 vs 18', date: 'Aujourd\'hui 22:04' },
    { id: 2, type: 'LOSS', bet: 10, payout: -10, score: '17 vs 19', date: 'Aujourd\'hui 21:58' },
    { id: 3, type: 'WIN', bet: 20, payout: +40, score: '21 vs 20', date: 'Aujourd\'hui 21:45' },
    { id: 4, type: 'BLACKJACK', bet: 10, payout: +25, score: '21 BJ vs 18', date: 'Hier 23:12' },
    { id: 5, type: 'LOSS', bet: 5, payout: -5, score: 'BUST (23)', date: 'Hier 22:50' },
  ]);

  // Chip handlers
  const handleAddChip = (val) => {
    const total = betChips.reduce((a, c) => a + c, 0);
    if (total + val <= credits) {
      const newChips = [...betChips, val];
      setBetChips(newChips);
      setCurrentBet(total + val);
    }
  };

  const handleRemoveChip = (idx) => {
    const newChips = betChips.filter((_, i) => i !== idx);
    setBetChips(newChips);
    setCurrentBet(newChips.reduce((a, c) => a + c, 0));
  };

  const handleClearChips = () => {
    setBetChips([]);
    setCurrentBet(0);
  };

  // Game Engine logic
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
      setHistory(prev => [{ id: Date.now(), type: 'LOSS', bet: game.bet, payout: -game.bet, score: `BUST (${score})`, date: 'À l\'instant' }, ...prev]);
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
    let type = 'LOSS';
    let payout = -game.bet;

    if (dScore > 21 || game.playerScore > dScore) {
      result = 'GAGNÉ !';
      type = 'WIN';
      winAmount = game.bet * 2;
      payout = +game.bet;
      setCredits(prev => prev + winAmount);
    } else if (game.playerScore === dScore) {
      result = 'ÉGALITÉ !';
      type = 'PUSH';
      winAmount = game.bet;
      payout = 0;
      setCredits(prev => prev + winAmount);
    } else {
      result = 'PERDU !';
      type = 'LOSS';
    }

    setGame({
      ...game,
      dealerHand: updatedDealerHand,
      dealerScore: dScore,
      status: 'FINISHED',
    });
    setGameResult(result);
    setHistory(prev => [{ id: Date.now(), type, bet: game.bet, payout, score: `${game.playerScore} vs ${dScore}`, date: 'À l\'instant' }, ...prev]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      {/* HEADER COMPACT SOMBRE */}
      <View style={styles.header}>
        <Text style={styles.brandTitle}>OFFSUIT</Text>
        <View style={styles.bankrollTag}>
          <Coins size={12} color="#a3a3a3" />
          <Text style={styles.bankrollText}>{credits} CR</Text>
        </View>
      </View>

      {/* CONTENU PRINCIPAL PAR TAB */}
      <View style={styles.mainContent}>

        {/* ==============================================================
            TAB 1: ACCUEIL (BOUTON JOUER + BANKROLL + HISTORIQUE ROUGE/VERT)
           ============================================================== */}
        {activeTab === 'HOME' && (
          <ScrollView contentContainerStyle={styles.homeScroll}>
            {/* TOTAL D'ARGENT & BOUTON JOUER */}
            <View style={styles.homeHeroCard}>
              <Text style={styles.heroLabel}>SOLDE DISPONIBLE</Text>
              <Text style={styles.heroCredits}>{credits} CR</Text>
              
              <TouchableOpacity style={styles.heroPlayBtn} onPress={() => setActiveTab('GAME')}>
                <Play size={20} color="#ffffff" fill="#ffffff" />
                <Text style={styles.heroPlayBtnText}>JOUER UNE MANCHE</Text>
              </TouchableOpacity>
            </View>

            {/* HISTORIQUE DE PARTIE (VERT SI GAGNE, ROUGE SI PERDU) */}
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

        {/* ==============================================================
            TAB 2: TABLE DE JEU (GAME)
           ============================================================== */}
        {activeTab === 'GAME' && (
          <View style={styles.gameContainer}>
            <View style={styles.tableFrame}>
              <View style={styles.tableInnerFelt}>
                
                {/* Marqueurs filigrane de table */}
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

                {/* JOUEUR */}
                <View style={styles.handSection}>
                  <View style={styles.handHeader}>
                    <Text style={styles.feltLabel}>JOUEUR</Text>
                    {game && (
                      <View style={styles.scoreBadge}>
                        <Text style={styles.scoreBadgeText}>{game.playerScore}</Text>
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

            {/* CONTROLES DE MANCHE / JETONS */}
            <View style={styles.gameControlsPanel}>
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

                  {/* Jetons empilés */}
                  <View style={styles.stackedChipsRow}>
                    {betChips.length === 0 ? (
                      <Text style={styles.noChipsHint}>Touches un jeton pour miser</Text>
                    ) : (
                      betChips.map((val, i) => (
                        <View key={i} style={{ marginLeft: i > 0 ? -16 : 0, zIndex: i }}>
                          <CasinoChip value={val} onPress={() => handleRemoveChip(i)} />
                        </View>
                      ))
                    )}
                  </View>

                  {/* Jetons 1, 2, 5, 10, 20 */}
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

        {/* ==============================================================
            TAB 3: PROFIL (MODIFIABLE + STATS + HISTORIQUE + SUCCÈS)
           ============================================================== */}
        {activeTab === 'PROFILE' && (
          <ScrollView contentContainerStyle={styles.profileScroll}>
            {profileSubSection ? (
              /* SOUS-SECTION DE PROFIL */
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
                    <Text style={styles.subText}>• Audio / Effets sonores : Activé</Text>
                    <Text style={styles.subText}>• Thème : Sombre Métallique (Offsuit)</Text>
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
              /* MENU PROFIL PRINCIPAL */
              <View style={styles.profileMenuContainer}>
                <View style={styles.profileHeaderCard}>
                  <View style={styles.avatarCircle}>
                    <User size={28} color="#ffffff" />
                  </View>
                  <Text style={styles.profileUsername}>Offsuit_Player</Text>
                  <Text style={styles.profileLevelText}>Joueur Niveau 5 • {credits} CR</Text>
                </View>

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

      {/* ==============================================================
          BARRE NATIVE EN BAS A 3 BOUTONS (BOUTIQUE, ACCUEIL, PROFIL)
         ============================================================== */}
      <View style={styles.bottomTabBar}>
        
        {/* BOUTON 1: BOUTIQUE (GRISÉ / INACTIF) */}
        <View style={[styles.tabItem, styles.tabItemDisabled]}>
          <ShoppingBag size={20} color="#404040" />
          <Text style={styles.tabLabelDisabled}>BOUTIQUE</Text>
        </View>

        {/* BOUTON 2: ACCUEIL (CENTRAL) */}
        <TouchableOpacity 
          style={[styles.tabItem, (activeTab === 'HOME' || activeTab === 'GAME') && styles.tabItemActive]} 
          onPress={() => { setActiveTab('HOME'); setProfileSubSection(null); }}
        >
          <Home size={22} color={(activeTab === 'HOME' || activeTab === 'GAME') ? '#ffffff' : '#737373'} />
          <Text style={[(activeTab === 'HOME' || activeTab === 'GAME') ? styles.tabLabelActive : styles.tabLabel]}>ACCUEIL</Text>
        </TouchableOpacity>

        {/* BOUTON 3: PROFIL (DROIT) */}
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'PROFILE' && styles.tabItemActive]} 
          onPress={() => setActiveTab('PROFILE')}
        >
          <User size={22} color={activeTab === 'PROFILE' ? '#ffffff' : '#737373'} />
          <Text style={[activeTab === 'PROFILE' ? styles.tabLabelActive : styles.tabLabel]}>PROFIL</Text>
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
  brandTitle: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 2,
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
  
  /* HOME STYLES */
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

  /* BOTTOM TAB BAR (3 BOUTONS: BOUTIQUE, ACCUEIL, PROFIL) */
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
});

registerRootComponent(App);

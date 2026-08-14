// Global polyfill for web APIs missing in React Native Hermes engine
if (typeof global.DOMRect === 'undefined') {
  (global as any).DOMRect = class DOMRect {
    x: number; y: number; width: number; height: number;
    top: number; right: number; bottom: number; left: number;
    constructor(x = 0, y = 0, width = 0, height = 0) {
      this.x = x; this.y = y; this.width = width; this.height = height;
      this.top = y; this.left = x; this.right = x + width; this.bottom = y + height;
    }
    static fromRect(rect?: { x?: number; y?: number; width?: number; height?: number }) {
      return new DOMRect(rect?.x, rect?.y, rect?.width, rect?.height);
    }
    toJSON() {
      return { x: this.x, y: this.y, width: this.width, height: this.height, top: this.top, right: this.right, bottom: this.bottom, left: this.left };
    }
  };
}

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

export default function App() {
  const [activeTab, setActiveTab] = useState<'HOME' | 'GAME'>('HOME');
  const [credits, setCredits] = useState(100);
  const [currentBet, setCurrentBet] = useState(10);
  const [betChips, setBetChips] = useState<number[]>([]);

  const handleAddChip = (val: number) => {
    const total = betChips.reduce((a, c) => a + c, 0);
    if (total + val <= credits) {
      const newChips = [...betChips, val];
      setBetChips(newChips);
      setCurrentBet(total + val);
    }
  };

  const handleRemoveChip = (idx: number) => {
    const newChips = betChips.filter((_, i) => i !== idx);
    setBetChips(newChips);
    setCurrentBet(newChips.reduce((a, c) => a + c, 0));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />
      
      {/* HEADER PERMANENT */}
      <View style={styles.header}>
        <View style={styles.brandGroup}>
          <View style={styles.brandIcon}>
            <Text style={styles.brandIconText}>♠</Text>
          </View>
          <Text style={styles.brandTitle}>Blackjack Royale</Text>
        </View>

        <View style={styles.creditsBadge}>
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

      {/* BODY SCREEN */}
      {activeTab === 'HOME' ? (
        <ScrollView contentContainerStyle={styles.homeContent}>
          <Text style={styles.welcomeTitle}>Bienvenue au Casino Natif</Text>
          <Text style={styles.welcomeSub}>Application React Native Expo 100% rapide</Text>

          <TouchableOpacity style={styles.bigPlayBtn} onPress={() => setActiveTab('GAME')}>
            <Text style={styles.bigPlayBtnText}>LANCER UNE PARTIE ♠</Text>
          </TouchableOpacity>

          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Table de Blackjack Locale</Text>
            <Text style={styles.statsText}>• Réseau ultra-rapide</Text>
            <Text style={styles.statsText}>• 0 décalage, 0 écran noir</Text>
            <Text style={styles.statsText}>• Jetons 1, 2, 5, 10, 20</Text>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.gameContent}>
          {/* TAPIS DE JEU */}
          <View style={styles.tableFelt}>
            <Text style={styles.feltLabel}>CROUPIER (Score: 18)</Text>
            
            {/* Dealer Cards */}
            <View style={styles.cardsRow}>
              <View style={styles.cardFront}>
                <Text style={styles.cardRankRed}>K</Text>
                <Text style={styles.cardSuitRed}>♥</Text>
              </View>
              <View style={styles.cardFront}>
                <Text style={styles.cardRankBlack}>8</Text>
                <Text style={styles.cardSuitBlack}>♠</Text>
              </View>
            </View>

            <Text style={styles.feltLabel}>JOUEUR (Score: 20)</Text>
            
            {/* Player Cards */}
            <View style={styles.cardsRow}>
              <View style={styles.cardFront}>
                <Text style={styles.cardRankBlack}>10</Text>
                <Text style={styles.cardSuitBlack}>♣</Text>
              </View>
              <View style={styles.cardFront}>
                <Text style={styles.cardRankRed}>J</Text>
                <Text style={styles.cardSuitRed}>♦</Text>
              </View>
            </View>
          </View>

          {/* CHIPS AND BETTING CONTROL */}
          <View style={styles.bettingPanel}>
            <Text style={styles.betTitle}>Mise actuelle : {currentBet} CR</Text>

            {/* Placed chips */}
            <View style={styles.placedChipsRow}>
              {betChips.map((val, i) => (
                <TouchableOpacity key={i} style={styles.placedChip} onPress={() => handleRemoveChip(i)}>
                  <Text style={styles.placedChipText}>{val}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Chip selector */}
            <View style={styles.chipsRow}>
              {[1, 2, 5, 10, 20].map((val) => (
                <TouchableOpacity key={val} style={styles.chipBtn} onPress={() => handleAddChip(val)}>
                  <Text style={styles.chipBtnText}>{val}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.dealBtn}>
              <Text style={styles.dealBtnText}>DISTRIBUER ({currentBet} CR)</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
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
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandIconText: {
    color: '#020617',
    fontWeight: '900',
    fontSize: 16,
  },
  brandTitle: {
    color: '#f59e0b',
    fontWeight: '900',
    fontSize: 14,
  },
  creditsBadge: {
    backgroundColor: '#020617',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  creditsText: {
    color: '#f59e0b',
    fontWeight: '900',
    fontSize: 12,
  },
  playHeaderBtn: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  playHeaderBtnText: {
    color: '#020617',
    fontWeight: '900',
    fontSize: 12,
  },
  menuHeaderBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  menuHeaderBtnText: {
    color: '#f8fafc',
    fontWeight: '700',
    fontSize: 12,
  },
  homeContent: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeTitle: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 20,
  },
  welcomeSub: {
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 30,
  },
  bigPlayBtn: {
    backgroundColor: '#10b981',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  bigPlayBtnText: {
    color: '#020617',
    fontWeight: '900',
    fontSize: 18,
  },
  statsCard: {
    backgroundColor: '#0f172a',
    borderColor: '#1e293b',
    borderWidth: 1,
    width: '100%',
    padding: 20,
    borderRadius: 20,
    marginTop: 30,
  },
  statsTitle: {
    color: '#f59e0b',
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 10,
  },
  statsText: {
    color: '#cbd5e1',
    fontSize: 13,
    marginVertical: 4,
  },
  gameContent: {
    flex: 1,
  },
  tableFelt: {
    flex: 1,
    backgroundColor: '#064e3b',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20,
  },
  feltLabel: {
    color: '#a7f3d0',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cardFront: {
    width: 60,
    height: 90,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
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
    color: '#0f172a',
    fontWeight: '900',
    fontSize: 20,
  },
  cardSuitBlack: {
    color: '#0f172a',
    fontSize: 18,
  },
  bettingPanel: {
    backgroundColor: '#020617',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    alignItems: 'center',
  },
  betTitle: {
    color: '#f59e0b',
    fontWeight: '800',
    fontSize: 13,
    marginBottom: 10,
  },
  placedChipsRow: {
    flexDirection: 'row',
    gap: 8,
    minHeight: 40,
    marginBottom: 10,
  },
  placedChip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0284c7',
    borderWidth: 2,
    borderColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placedChipText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 12,
  },
  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  chipBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#d97706',
    borderWidth: 2,
    borderColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipBtnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 13,
  },
  dealBtn: {
    backgroundColor: '#10b981',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  dealBtnText: {
    color: '#020617',
    fontWeight: '900',
    fontSize: 16,
  },
});

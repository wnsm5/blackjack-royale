import './polyfill';
import { registerRootComponent } from 'expo';
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
  PanResponder,
  TextInput,
  Vibration,
  Dimensions,
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
  ChevronLeft,
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
  Check,
  TrendingDown,
  Activity,
  Target,
  RotateCcw,
  Edit3,
  Smartphone,
  Gem,
  Sparkles,
  Package,
  Gift
} from 'lucide-react-native';
import Svg, { Polygon, Line } from 'react-native-svg';

const CHIP_VALUES = [1, 2, 5, 10, 20];

// 15 DOS DE CARTES DE LUXE AVEC MOTIFS GÉOMÉTRIQUES UNIQUE (15 AUTHENTIC VECTOR PATTERNS)
const INITIAL_CARD_BACKS = [
  { id: 'ROUGE_OFFSUIT', name: 'Offsuit Rouge', bg: '#991b1b', innerBg: '#7f1d1d', border: '#fca5a5', pattern: 'lattice', price: 0, unlocked: true },
  { id: 'NOIR_CARBONE', name: 'Noir Carbone VIP', bg: '#171717', innerBg: '#262626', border: '#f59e0b', pattern: 'stripes', price: 50, unlocked: false },
  { id: 'DRAGON_DOR', name: 'Dragon d\'Or', bg: '#b45309', innerBg: '#78350f', border: '#fef08a', pattern: 'diamonds', price: 100, unlocked: false },
  { id: 'BLEU_ROYAL', name: 'Bleu Royal', bg: '#1d4ed8', innerBg: '#1e40af', border: '#bfdbfe', pattern: 'crosshatch', price: 100, unlocked: false },
  { id: 'EMERAUDE_VIP', name: 'Émeraude VIP', bg: '#15803d', innerBg: '#166534', border: '#bbf7d0', pattern: 'chevron', price: 150, unlocked: false },
  { id: 'NEON_RED', name: 'Néon Rouge', bg: '#e11d48', innerBg: '#be123c', border: '#fecdd3', pattern: 'neon_grid', price: 150, unlocked: false },
  { id: 'AMETHYSTE', name: 'Améthyste', bg: '#7e22ce', innerBg: '#6b21a8', border: '#e9d5ff', pattern: 'radial', price: 200, unlocked: false },
  { id: 'GOLDEN_ROYALE', name: 'Or Pur Royale', bg: '#ca8a04', innerBg: '#a16207', border: '#fef08a', pattern: 'double_ring', price: 250, unlocked: false },
  { id: 'SILVER_MATTE', name: 'Argent Mat', bg: '#475569', innerBg: '#334155', border: '#e2e8f0', pattern: 'hex', price: 250, unlocked: false },
  { id: 'CYBERPUNK', name: 'Cyberpunk 2077', bg: '#0891b2', innerBg: '#0e7490', border: '#f43f5e', pattern: 'circuits', price: 300, unlocked: false },
  { id: 'MARBRE_BLANC', name: 'Marbre Blanc VIP', bg: '#e2e8f0', innerBg: '#cbd5e1', border: '#64748b', pattern: 'marble', price: 300, unlocked: false },
  { id: 'VELOURS_ROUGE', name: 'Rouge Velours', bg: '#881337', innerBg: '#4c0519', border: '#fecdd3', pattern: 'velvet_damask', price: 350, unlocked: false },
  { id: 'ROSE_GOLD', name: 'Or Rose Filigrane', bg: '#9f1239', innerBg: '#881337', border: '#fecdd3', pattern: 'rose_gold', price: 350, unlocked: false },
  { id: 'MIDNIGHT_BLUE', name: 'Midnight Constellation', bg: '#0f172a', innerBg: '#1e293b', border: '#38bdf8', pattern: 'constellation', price: 400, unlocked: false },
  { id: 'BRONZE_ARMOR', name: 'Bronze Tactique', bg: '#78350f', innerBg: '#451a03', border: '#d97706', pattern: 'bronze_mesh', price: 400, unlocked: false },
];

const ROULETTE_ITEM_WIDTH = 76;
const ROULETTE_CARD_W = 54;
const ROULETTE_CARD_H = 80;
const ROULETTE_WINNER_INDEX = 32;

// GEM HEXAGONE VERTICAL — pointu haut/bas, côtés plats gauche/droite (style Ascendant Valorant)
function GemDiamond({ size = 16, color = '#22c55e' }) {
  const h = size * 1.45;
  const w = size * 0.68;
  const sideX = w * 0.16;
  const shoulderY = h * 0.17;
  const baseY = h * 0.83;

  const points = [
    `${w / 2},0`,
    `${w - sideX},${shoulderY}`,
    `${w - sideX},${baseY}`,
    `${w / 2},${h}`,
    `${sideX},${baseY}`,
    `${sideX},${shoulderY}`,
  ].join(' ');

  return (
    <View style={{ width: w, height: h }}>
      <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <Polygon points={points} fill={color} />
        <Line
          x1={w / 2}
          y1={shoulderY}
          x2={w / 2}
          y2={baseY}
          stroke="rgba(255,255,255,0.24)"
          strokeWidth={Math.max(0.5, w * 0.035)}
        />
        <Line
          x1={sideX + (w - 2 * sideX) * 0.22}
          y1={h * 0.42}
          x2={w - sideX - (w - 2 * sideX) * 0.22}
          y2={h * 0.42}
          stroke="rgba(255,255,255,0.14)"
          strokeWidth={Math.max(0.4, w * 0.028)}
        />
      </Svg>
    </View>
  );
}

// VISUEL COFFRE SOBRE (vectoriel pur, sans emoji)
function ChestVisual({ chest, scale = 1 }) {
  const w = 46 * scale;
  const bodyH = 30 * scale;
  const lidH = 11 * scale;
  const bandH = Math.max(2, 2.5 * scale);
  const lockW = 9 * scale;
  const lockH = 11 * scale;

  return (
    <View style={{ width: w + 6 * scale, height: bodyH + lidH + 4 * scale, alignItems: 'center', justifyContent: 'flex-end' }}>
      <View style={{
        position: 'absolute',
        bottom: 0,
        width: w * 0.82,
        height: Math.max(3, 3 * scale),
        backgroundColor: 'rgba(0,0,0,0.45)',
        borderRadius: 2,
      }} />

      <View style={{
        width: w,
        height: bodyH,
        backgroundColor: chest.bgGlow,
        borderWidth: 1,
        borderColor: chest.borderColor,
        borderBottomLeftRadius: 5 * scale,
        borderBottomRightRadius: 5 * scale,
        overflow: 'hidden',
      }}>
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: bodyH * 0.22,
          backgroundColor: chest.color,
          opacity: 0.35,
        }} />
        <View style={{
          position: 'absolute',
          top: bodyH * 0.36,
          left: 0,
          right: 0,
          height: bandH,
          backgroundColor: chest.borderColor,
          opacity: 0.55,
        }} />
        <View style={{
          position: 'absolute',
          top: bodyH * 0.3,
          alignSelf: 'center',
          width: lockW,
          height: lockH,
          backgroundColor: '#141414',
          borderWidth: 1,
          borderColor: chest.borderColor,
          borderRadius: 2 * scale,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <View style={{
            width: Math.max(2, 2.5 * scale),
            height: Math.max(2, 2.5 * scale),
            borderRadius: Math.max(1, 1.2 * scale),
            backgroundColor: '#050505',
          }} />
        </View>
      </View>

      <View style={{
        position: 'absolute',
        top: 0,
        width: w + 5 * scale,
        height: lidH,
        backgroundColor: chest.color,
        borderWidth: 1,
        borderColor: chest.borderColor,
        borderTopLeftRadius: 6 * scale,
        borderTopRightRadius: 6 * scale,
      }}>
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 5 * scale,
          right: 5 * scale,
          height: Math.max(1, 1.5 * scale),
          backgroundColor: chest.borderColor,
          opacity: 0.45,
        }} />
        <View style={{
          position: 'absolute',
          top: lidH * 0.28,
          alignSelf: 'center',
          width: w * 0.55,
          height: Math.max(1, 1.2 * scale),
          backgroundColor: chest.borderColor,
          opacity: 0.3,
          borderRadius: 1,
        }} />
      </View>
    </View>
  );
}

// Rich Pattern Component for Card Backs (Authentic unique geometry per skin)
function CardBackVisual({ skin, width = 58, height = 84 }) {
  const cornerRadius = Math.round(width * 0.14);
  const borderThickness = Math.max(1.5, Math.round(width * 0.035));

  return (
    <View
      style={{
        width,
        height,
        borderRadius: cornerRadius,
        backgroundColor: skin.bg,
        borderWidth: borderThickness,
        borderColor: skin.border,
        padding: Math.max(2, Math.round(width * 0.04)),
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          flex: 1,
          borderRadius: cornerRadius - 2,
          backgroundColor: skin.innerBg,
          borderWidth: 1,
          borderColor: skin.border,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Motifs Géométriques distincts par Skin */}
        {skin.pattern === 'stripes' ? (
          <View style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'space-around', alignItems: 'center' }}>
            <View style={{ width: '85%', height: 1.5, backgroundColor: skin.border, opacity: 0.7 }} />
            <View style={{ width: '85%', height: 1.5, backgroundColor: skin.border, opacity: 0.7 }} />
            <View style={{ width: '85%', height: 1.5, backgroundColor: skin.border, opacity: 0.7 }} />
            <View style={{ width: '85%', height: 1.5, backgroundColor: skin.border, opacity: 0.7 }} />
          </View>
        ) : skin.pattern === 'diamonds' ? (
          <View
            style={{
              position: 'absolute',
              width: '65%',
              height: '65%',
              borderWidth: 1.5,
              borderColor: skin.border,
              transform: [{ rotate: '45deg' }],
            }}
          />
        ) : skin.pattern === 'chevron' ? (
          <View style={{ position: 'absolute', width: '75%', height: '75%', borderRadius: cornerRadius, borderWidth: 1, borderColor: skin.border, borderStyle: 'dashed' }} />
        ) : skin.pattern === 'radial' ? (
          <View style={{ position: 'absolute', width: '70%', height: '70%', borderRadius: 100, borderWidth: 1.5, borderColor: skin.border, borderStyle: 'dotted' }} />
        ) : skin.pattern === 'marble' ? (
          <View style={{ position: 'absolute', width: '85%', height: '85%', borderWidth: 1.5, borderColor: skin.border, borderRadius: 6 }} />
        ) : skin.pattern === 'constellation' ? (
          <View style={{ position: 'absolute', width: '60%', height: '60%', borderRadius: 100, borderWidth: 2, borderColor: skin.border }} />
        ) : (
          <View
            style={{
              position: 'absolute',
              width: '82%',
              height: '82%',
              borderRadius: cornerRadius - 4,
              borderWidth: 1,
              borderColor: skin.border,
              borderStyle: 'dashed',
              opacity: 0.6,
            }}
          />
        )}

        {/* Emblème Central de Luxe */}
        <View
          style={{
            width: '44%',
            height: '44%',
            borderRadius: Math.round(width * 0.22),
            borderWidth: 1.5,
            borderColor: skin.border,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: skin.bg,
          }}
        >
          <View
            style={{
              width: '42%',
              height: '42%',
              borderRadius: Math.round(width * 0.1),
              backgroundColor: skin.border,
            }}
          />
        </View>
      </View>
    </View>
  );
}

// COMPOSANT ROULETTE / TIRAGE ALÉATOIRE DE CRÉDITS (COFFRES BRONZE & OR)
function CreditRouletteModal({ visible, minCredits, maxCredits, winnerCredits, tierName, onComplete }) {
  const [displayedCredits, setDisplayedCredits] = useState(minCredits);
  const [phase, setPhase] = useState('rolling'); // 'rolling' | 'revealed'
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible || !winnerCredits) return;

    setPhase('rolling');
    setDisplayedCredits(minCredits);
    scaleAnim.setValue(1);
    glowAnim.setValue(0);

    const startTime = Date.now();
    const duration = 2400; // 2.4s de roulement de chiffres

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);

      if (progress >= 1) {
        clearInterval(interval);
        setDisplayedCredits(winnerCredits);
        setPhase('revealed');

        Animated.parallel([
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.25,
              duration: 250,
              easing: Easing.out(Easing.back(1.5)),
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        // Défilement de nombres aléatoires accéléré puis ralenti
        const randomVal = Math.floor(minCredits + Math.random() * (maxCredits - minCredits));
        setDisplayedCredits(randomVal);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [visible, winnerCredits, minCredits, maxCredits]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => {}}>
      <View style={styles.rouletteOverlay}>
        <Text style={styles.rouletteTitle}>COFFRE {tierName?.toUpperCase()}</Text>
        <Text style={styles.rouletteSubtitle}>
          {phase === 'rolling' ? 'Tirage des crédits…' : 'Gain débloqué !'}
        </Text>

        <View style={styles.creditRouletteBox}>
          <Animated.View
            style={[
              styles.creditRouletteGlow,
              { opacity: glowAnim },
            ]}
            pointerEvents="none"
          />

          <Coins size={36} color="#fbbf24" />

          <Animated.Text
            style={[
              styles.creditRouletteValue,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            +{displayedCredits} CR
          </Animated.Text>
        </View>

        {phase === 'revealed' && (
          <View style={styles.rouletteResultBox}>
            <Text style={styles.rouletteResultHint}>
              Crédits ajoutés immédiatement à votre solde
            </Text>
            <TouchableOpacity
              style={styles.rouletteContinueBtn}
              onPress={onComplete}
              activeOpacity={0.85}
            >
              <Text style={styles.rouletteContinueBtnText}>CONTINUER</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

function CardBackRouletteModal({ visible, cardBackSkins, winnerId, onComplete }) {
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const winnerLockFade = useRef(new Animated.Value(1)).current;
  const winnerScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const [phase, setPhase] = useState('spinning');

  const winnerSkin = cardBackSkins.find((s) => s.id === winnerId);
  const viewportWidth = Dimensions.get('window').width - 48;
  const lockedPool = useMemo(() => {
    return cardBackSkins.filter((s) => !s.unlocked);
  }, [cardBackSkins]);

  const strip = useMemo(() => {
    if (!winnerId || !winnerSkin || lockedPool.length === 0) return [];
    const items = [];
    const total = 60; // 60 cartes pour un défilement infini long et fluide
    const otherLocked = lockedPool.filter((s) => s.id !== winnerId);
    const poolToCycle = otherLocked.length > 0 ? otherLocked : [winnerSkin];

    for (let i = 0; i < total; i++) {
      if (i === ROULETTE_WINNER_INDEX) {
        items.push(winnerSkin);
      } else {
        // Répète en boucle ordonnée les skins restants à débloquer
        items.push(poolToCycle[i % poolToCycle.length]);
      }
    }
    return items;
  }, [winnerId, winnerSkin, lockedPool]);

  useEffect(() => {
    if (!visible || !winnerId) return;

    setPhase('spinning');
    scrollAnim.setValue(0);
    winnerLockFade.setValue(1);
    winnerScale.setValue(1);
    glowOpacity.setValue(0);

    const vw = Dimensions.get('window').width - 48;
    const offset = ROULETTE_WINNER_INDEX * ROULETTE_ITEM_WIDTH - (vw / 2) + ROULETTE_ITEM_WIDTH / 2;

    const anim = Animated.timing(scrollAnim, {
      toValue: offset,
      duration: 5200, // 5.2s défilement progressif qui ralentit naturellement
      easing: Easing.bezier(0.12, 0.8, 0.22, 1), // Courbe de décélération de type casino roulette
      useNativeDriver: true,
    });

    anim.start(({ finished }) => {
      if (!finished) return;
      setPhase('revealed');
      Animated.parallel([
        Animated.timing(winnerLockFade, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(winnerScale, {
            toValue: 1.18,
            duration: 350,
            easing: Easing.out(Easing.back(1.4)),
            useNativeDriver: true,
          }),
          Animated.timing(winnerScale, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(glowOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    });

    return () => anim.stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, winnerId]);

  if (!visible || !winnerSkin) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => {}}>
      <View style={styles.rouletteOverlay}>
        <Text style={styles.rouletteTitle}>ROULETTE DES DOS</Text>
        <Text style={styles.rouletteSubtitle}>
          {phase === 'spinning' ? 'Ouverture en cours…' : 'Nouveau dos débloqué !'}
        </Text>

        <View style={[styles.rouletteViewport, { width: viewportWidth }]}>
          {phase === 'revealed' && (
            <View style={styles.rouletteCenterMarker} pointerEvents="none" />
          )}

          <Animated.View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              transform: [{ translateX: Animated.multiply(scrollAnim, -1) }],
            }}
          >
            {strip.map((skin, idx) => {
              const isWinner = idx === ROULETTE_WINNER_INDEX;
              const cardNode = (
                <View style={styles.rouletteItem}>
                  <CardBackVisual skin={skin} width={ROULETTE_CARD_W} height={ROULETTE_CARD_H} />
                </View>
              );

              if (isWinner) {
                return (
                  <Animated.View
                    key={`${skin.id}-${idx}`}
                    style={[
                      styles.rouletteItemWrap,
                      { transform: [{ scale: winnerScale }] },
                    ]}
                  >
                    {cardNode}
                    <Animated.View
                      style={[styles.rouletteWinnerGlow, { opacity: glowOpacity }]}
                      pointerEvents="none"
                    />
                  </Animated.View>
                );
              }

              return (
                <View key={`${skin.id}-${idx}`} style={styles.rouletteItemWrap}>
                  {cardNode}
                </View>
              );
            })}
          </Animated.View>
        </View>

        {phase === 'revealed' && (
          <View style={styles.rouletteResultBox}>
            <Text style={styles.rouletteResultName}>{winnerSkin.name}</Text>
            <Text style={styles.rouletteResultHint}>
              Disponible dans Profil → Dos de Cartes
            </Text>
            <TouchableOpacity
              style={styles.rouletteContinueBtn}
              onPress={onComplete}
              activeOpacity={0.85}
            >
              <Text style={styles.rouletteContinueBtnText}>CONTINUER</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

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
        <Text
          style={[
            styles.chipValueText,
            {
              color: chipColors.text,
              fontSize: String(value).length >= 4 ? 7 : String(value).length === 3 ? 8 : size < 30 ? 9 : 11,
              fontWeight: '900',
            },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit={true}
        >
          {value}
        </Text>
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
  const width = compact ? 44 : 58;
  const height = compact ? 64 : 84;

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
        <CardBackVisual skin={cardSkin} width={width} height={height} />
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

  // Gems Currency State (Default: 0)
  const [gems, setGems] = useState(0);
  const [rewardModalInfo, setRewardModalInfo] = useState(null);
  const [chestDetailChest, setChestDetailChest] = useState(null);
  const [cardBackRoulette, setCardBackRoulette] = useState(null);
  const [creditRoulette, setCreditRoulette] = useState(null); // { minCredits, maxCredits, winnerCredits, tierName }

  // User Profile State (Default: user_XXXX with random digits)
  const [username, setUsername] = useState(() => `user_${Math.floor(1000 + Math.random() * 9000)}`);
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [nameInput, setNameInput] = useState('');

  // Coffres de la Boutique
  const CHESTS = [
    {
      id: 'BRONZE',
      name: 'Coffre Bronze',
      tierName: 'Bronze',
      cost: 50,
      color: '#a16207',
      borderColor: '#854d0e',
      bgGlow: '#1a1208',
      minCredits: 250,
      maxCredits: 600,
      type: 'CREDITS',
      rewards: [
        { label: 'Crédits', value: '250 – 600 CR' },
      ],
    },
    {
      id: 'ARGENT',
      name: 'Coffre Épique',
      tierName: 'Épique',
      cost: 100,
      color: '#64748b',
      borderColor: '#475569',
      bgGlow: '#0f1419',
      minCredits: 0,
      maxCredits: 0,
      type: 'CARDBACKS',
      rewards: [
        { label: 'Dos de carte aléatoire', value: '1 garanti' },
      ],
    },
    {
      id: 'OR',
      name: 'Coffre Légendaire',
      tierName: 'Légendaire',
      cost: 150,
      color: '#ca8a04',
      borderColor: '#a16207',
      bgGlow: '#1a1508',
      minCredits: 1600,
      maxCredits: 4000,
      type: 'CREDITS',
      rewards: [
        { label: 'Crédits', value: '1 600 – 4 000 CR' },
      ],
    },
  ];

  const handleBuyChest = (chest) => {
    // Si pas assez de gems, le clic est déjà désactivé / bloqué sans aucun popup
    if (gems < chest.cost) {
      triggerHaptic(20);
      return;
    }

    if (chest.id === 'ARGENT') {
      const lockedPool = cardBackSkins.filter((s) => !s.unlocked);
      if (lockedPool.length === 0) {
        triggerHaptic(20);
        return;
      }
    }

    triggerHaptic(40);
    setGems(prev => prev - chest.cost);
    setChestDetailChest(null);

    if (chest.id === 'ARGENT') {
      const lockedPool = cardBackSkins.filter((s) => !s.unlocked);
      const winner = lockedPool[Math.floor(Math.random() * lockedPool.length)];
      setCardBackRoulette({ winnerId: winner.id });
      return;
    }

    // Tirage aléatoire animé pour les crédits
    const rewardCredits = Math.floor(chest.minCredits + Math.random() * (chest.maxCredits - chest.minCredits));
    setCreditRoulette({
      minCredits: chest.minCredits,
      maxCredits: chest.maxCredits,
      winnerCredits: rewardCredits,
      tierName: chest.tierName,
    });
  };

  const handleCreditRouletteComplete = () => {
    if (!creditRoulette) return;
    const { winnerCredits } = creditRoulette;
    setCredits(prev => prev + winnerCredits);
    setBalanceHistory(prev => [...prev, credits + winnerCredits]);
    setCreditRoulette(null);
    triggerHaptic(50);
  };

  const handleRouletteComplete = () => {
    if (!cardBackRoulette) return;
    const { winnerId } = cardBackRoulette;
    setCardBackSkins((prev) =>
      prev.map((s) => (s.id === winnerId ? { ...s, unlocked: true } : s))
    );
    setCardBackRoulette(null);
    triggerHaptic(50);
  };
  
  // Vibration / Haptics State
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  const triggerHaptic = (pattern = 15) => {
    if (hapticsEnabled) {
      try {
        Vibration.vibrate(pattern);
      } catch (e) {}
    }
  };

  const handleSaveUsername = () => {
    const trimmed = nameInput.trim();
    if (trimmed.length > 0) {
      setUsername(trimmed);
    }
    setShowEditNameModal(false);
  };

  // Shoe / Pioche state (6 decks = 312 cards)
  const [cardsRemaining, setCardsRemaining] = useState(312);

  // Card Back Skins State (15 total)
  const [cardBackSkins, setCardBackSkins] = useState(INITIAL_CARD_BACKS);
  const [equippedCardBackId, setEquippedCardBackId] = useState('ROUGE_OFFSUIT');

  // Solde history tracking for progression chart (starts with initial balance)
  const [balanceHistory, setBalanceHistory] = useState([100]);

  // Decision Tracking Stats (starts at 0)
  const [decisionStats, setDecisionStats] = useState({
    hits: 0,
    stands: 0,
    doubles: 0,
    splits: 0,
  });

  // Financial Records State (starts at 0)
  const [financialRecords, setFinancialRecords] = useState({
    highestBet: 0,
    highestWin: 0,
    highestLoss: 0,
  });

  // Reset all stats & history
  const handleResetStats = () => {
    setHistory([]);
    setBalanceHistory([credits]);
    setDecisionStats({ hits: 0, stands: 0, doubles: 0, splits: 0 });
    setFinancialRecords({ highestBet: 0, highestWin: 0, highestLoss: 0 });
  };

  // Animations
  const subSectionSlideAnim = useRef(new Animated.Value(250)).current;
  const tabFadeAnim = useRef(new Animated.Value(1)).current;

  // Refs to avoid stale closures inside PanResponders
  const closeSubSectionRef = useRef(null);
  const activeTabRef = useRef(activeTab);
  const profileSubSectionRef = useRef(profileSubSection);
  const changeTabRef = useRef(null);
  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);
  useEffect(() => { profileSubSectionRef.current = profileSubSection; }, [profileSubSection]);

  // PanResponder: swipe right inside a profile sub-section to close it
  const swipeSubSectionPanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        gs.dx > 25 && Math.abs(gs.dy) < 80 && gs.dx > Math.abs(gs.dy) * 1.5,
      onPanResponderRelease: (_, gs) => {
        if (gs.dx > 60) closeSubSectionRef.current && closeSubSectionRef.current();
      },
    })
  ).current;

  // PanResponder: swipe left/right on HOME or PROFILE to switch tab
  // Uses CAPTURE phase so it activates before inner ScrollViews,
  // but only for clearly horizontal gestures (angle < ~22° from horizontal)
  const swipeTabPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponderCapture: (_, gs) => {
        if (activeTabRef.current === 'GAME') return false;
        if (profileSubSectionRef.current !== null) return false;
        // Only capture if gesture is clearly horizontal (dx dominates dy by 3:1)
        return Math.abs(gs.dx) > 10 && Math.abs(gs.dx) > Math.abs(gs.dy) * 3;
      },
      onPanResponderRelease: (_, gs) => {
        if (Math.abs(gs.dx) < 50) return;
        const tab = activeTabRef.current;
        if (gs.dx < -50) { // Swipe left -> Next tab
          if (tab === 'SHOP') changeTabRef.current && changeTabRef.current('HOME');
          else if (tab === 'HOME') changeTabRef.current && changeTabRef.current('PROFILE');
        } else if (gs.dx > 50) { // Swipe right -> Previous tab
          if (tab === 'PROFILE') changeTabRef.current && changeTabRef.current('HOME');
          else if (tab === 'HOME') changeTabRef.current && changeTabRef.current('SHOP');
        }
      },
    })
  ).current;

  // Chest Sheet vertical drag animation and PanResponder
  const chestSheetTranslateY = useRef(new Animated.Value(0)).current;
  const chestDetailChestRef = useRef(chestDetailChest);
  useEffect(() => {
    chestDetailChestRef.current = chestDetailChest;
    if (chestDetailChest !== null) {
      chestSheetTranslateY.setValue(0);
    }
  }, [chestDetailChest]);

  const chestSheetPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dy) > 5,
      onMoveShouldSetPanResponderCapture: (_, gs) => gs.dy > 6,
      onPanResponderMove: (_, gs) => {
        // Permet de déplacer de haut en bas (avec résistance vers le haut)
        if (gs.dy > 0) {
          chestSheetTranslateY.setValue(gs.dy);
        } else {
          // Résistance élastique légère vers le haut
          chestSheetTranslateY.setValue(gs.dy * 0.25);
        }
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > 80 || gs.vy > 0.6) {
          Animated.timing(chestSheetTranslateY, {
            toValue: 650,
            duration: 200,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }).start(() => {
            setChestDetailChest(null);
            chestSheetTranslateY.setValue(0);
          });
        } else {
          Animated.spring(chestSheetTranslateY, {
            toValue: 0,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Leave confirmation modal state
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Daily Challenges State
  const [challenges, setChallenges] = useState([
    { id: 1, title: 'Jouer 5 manches', reward: 25, progress: 4, total: 5, claimed: false },
    { id: 2, title: 'Gagner avec un Double Down', reward: 50, progress: 1, total: 1, claimed: false },
    { id: 3, title: 'Atteindre un solde de 150 CR', reward: 40, progress: 140, total: 150, claimed: false },
  ]);

  // Succès organisés en 2 listes (En cours / Terminés)
  const [achievements, setAchievements] = useState([
    { id: 1, title: 'Premier Pas', desc: 'Gagner votre première manche', completed: true },
    { id: 2, title: 'High Roller', desc: 'Miser 100 CR en une seule manche', completed: true },
    { id: 3, title: 'Pro du Split', desc: 'Gagner une manche après un Split', completed: true },
    { id: 4, title: 'Maître du Double', desc: 'Réussir 3 Double Down gagnants', completed: false, current: 2, target: 3 },
    { id: 5, title: 'Blackjack Royale', desc: 'Obtenir 3 Blackjacks naturels', completed: false, current: 1, target: 3 },
    { id: 6, title: 'Grand Collectionneur', desc: 'Débloquer 10 Dos de Cartes', completed: false, current: 5, target: 10 },
  ]);

  // Match History state (starts empty)
  const [history, setHistory] = useState([]);

  const activeCardSkin = cardBackSkins.find(s => s.id === equippedCardBackId) || cardBackSkins[0];

  // Handle Tab Change — simple state update with fade
  const changeTab = (newTab) => {
    if (newTab === activeTab) return;
    Animated.timing(tabFadeAnim, {
      toValue: 0, duration: 100, useNativeDriver: true,
    }).start(() => {
      setActiveTab(newTab);
      setProfileSubSection(null);
      Animated.timing(tabFadeAnim, {
        toValue: 1, duration: 180, useNativeDriver: true,
      }).start();
    });
  };

  // Keep refs current (avoid stale closures in PanResponders)
  closeSubSectionRef.current = closeSubSection;
  changeTabRef.current = changeTab;

  // Handle Opening Sub-Section with Slide Up Animation
  const openSubSection = (section) => {
    setProfileSubSection(section);
    subSectionSlideAnim.setValue(250);
    Animated.timing(subSectionSlideAnim, {
      toValue: 0,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  // Handle Closing Sub-Section with Slide Down Animation
  const closeSubSection = () => {
    Animated.timing(subSectionSlideAnim, {
      toValue: 250,
      duration: 200,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setProfileSubSection(null);
    });
  };

  // Keep closeSubSection ref current
  closeSubSectionRef.current = closeSubSection;

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

  // Equip / Select Card Back
  const handleEquipCardBack = (skin) => {
    if (!skin.unlocked) return;
    setEquippedCardBackId(skin.id);
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

    // Track highest bet
    setFinancialRecords(prev => ({
      ...prev,
      highestBet: Math.max(prev.highestBet, currentBet),
    }));

    const p1 = getRandomCard(true);
    const d1 = getRandomCard(true);
    const p2 = getRandomCard(true);
    const d2 = getRandomCard(false);

    triggerHaptic(18); // Carte 1 joueur

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
      triggerHaptic(18); // Carte 1 croupier
      setGame(prev => ({
        ...prev,
        dealerHand: [d1],
        dealerScore: calcScore([d1]),
      }));

      setTimeout(() => {
        triggerHaptic(18); // Carte 2 joueur
        setGame(prev => ({
          ...prev,
          playerHand: [p1, p2],
          playerScore: calcScore([p1, p2]),
        }));

        setTimeout(() => {
          const pScore = calcScore([p1, p2]);
          setCardsRemaining(prev => Math.max(10, prev - 4));

          // Natural Blackjack (21 on initial 2 cards deal) -> Immediate win at 3:2 (+1.5x bet)
          if (pScore === 21) {
            triggerHaptic(18); // Carte 2 croupier retournée
            const d2Revealed = { ...d2, faceUp: true };
            const dScore = calcScore([d1, d2Revealed]);
            const winAmount = Math.floor(currentBet * 2.5); // returns bet + 1.5x bet
            const netGain = Math.floor(currentBet * 1.5);   // profit is 1.5x bet

            setCredits(prev => prev + winAmount);
            setGame(prev => ({
              ...prev,
              dealerHand: [d1, d2Revealed],
              dealerScore: dScore,
              status: 'FINISHED',
            }));
            setGameResult(`BLACKJACK ! (+${netGain} CR)`);
            setFinancialRecords(prev => ({
              ...prev,
              highestWin: Math.max(prev.highestWin, netGain),
            }));
            setHistory(prev => [{
              id: Date.now(),
              type: 'BLACKJACK',
              bet: currentBet,
              payout: +netGain,
              score: `21 (BJ) vs ${dScore}`,
              date: 'À l\'instant'
            }, ...prev]);
            setBalanceHistory(prev => [...prev, credits - currentBet + winAmount]);
            setIsDealing(false);
          } else {
            triggerHaptic(18); // Carte 2 croupier cachée distribuée
            setGame(prev => ({
              ...prev,
              dealerHand: [d1, d2],
            }));
            setIsDealing(false);
          }
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
    triggerHaptic(18); // Pioche d'une carte

    setDecisionStats(prev => ({ ...prev, hits: prev.hits + 1 }));
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
          setGameResult(`BUST - PERDU (-${game.bet} CR)`);
          setFinancialRecords(prev => ({ ...prev, highestLoss: Math.min(prev.highestLoss, -game.bet) }));
          setHistory(prev => [{ id: Date.now(), type: 'LOSS', bet: game.bet, payout: -game.bet, score: `BUST (${score})`, date: 'À l\'instant' }, ...prev]);
          setBalanceHistory(prev => [...prev, credits]);
        }
      }, 350);
    }
  };

  // Double Down Action
  const handleDouble = () => {
    if (!game || game.status !== 'PLAYING' || credits < game.bet || game.playerHand.length !== 2 || isDealing) return;
    triggerHaptic(18); // Pioche d'une carte sur double

    setDecisionStats(prev => ({ ...prev, doubles: prev.doubles + 1 }));
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
        setGameResult(`DOUBLE BUST - PERDU (-${totalBet} CR)`);
        setFinancialRecords(prev => ({ ...prev, highestLoss: Math.min(prev.highestLoss, -totalBet) }));
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
    triggerHaptic(18); // Distribution des cartes de split

    setDecisionStats(prev => ({ ...prev, splits: prev.splits + 1 }));
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

    setDecisionStats(prev => ({ ...prev, stands: prev.stands + 1 }));
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
          triggerHaptic(18); // Carte piochée par le croupier
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
            type = 'WIN';
            winAmount = betAmount * 2;
            const netWin = winAmount - betAmount;
            finalCredits += winAmount;
            result = `GAGNÉ (+${netWin} CR)`;
            setCredits(prev => prev + winAmount);
            setFinancialRecords(prev => ({ ...prev, highestWin: Math.max(prev.highestWin, netWin) }));
          } else if (pScore === finalDScore) {
            type = 'PUSH';
            winAmount = betAmount;
            finalCredits += winAmount;
            result = 'ÉGALITÉ (0 CR)';
            setCredits(prev => prev + winAmount);
          } else {
            type = 'LOSS';
            result = `PERDU (-${betAmount} CR)`;
            setFinancialRecords(prev => ({ ...prev, highestLoss: Math.min(prev.highestLoss, -betAmount) }));
          }

          if (hasInsurance && currentHand.length === 2 && finalDScore === 21) {
            const insurancePayout = game.bet;
            setCredits(prev => prev + insurancePayout);
            finalCredits += insurancePayout;
            result += ' • ASSURANCE (+ ' + insurancePayout + ' CR)';
          }

          setGame(prev => ({ ...prev, status: 'FINISHED' }));
          setGameResult(result);
          setHistory(prev => [{ id: Date.now(), type, bet: betAmount, payout: type === 'WIN' ? +(winAmount - betAmount) : type === 'PUSH' ? 0 : -betAmount, score: `${pScore} vs ${finalDScore}`, date: 'À l\'instant' }, ...prev]);
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

    // If all split hands busted (>21), no need for dealer to draw
    if (splitScores.every(s => s > 21)) {
      setTimeout(() => {
        setGame(prev => ({ ...prev, status: 'FINISHED' }));
        setGameResult(`DOUBLE BUST - SPLIT PERDU (-${game.bet} CR)`);
        setFinancialRecords(prev => ({ ...prev, highestLoss: Math.min(prev.highestLoss, -game.bet) }));
        setHistory(prev => [{
          id: Date.now(),
          type: 'LOSS',
          bet: game.bet,
          payout: -game.bet,
          score: `M1:${splitScores[0]} M2:${splitScores[1]} (BUST)`,
          date: 'À l\'instant'
        }, ...prev]);
        setBalanceHistory(prev => [...prev, credits]);
        setIsDealing(false);
      }, 400);
      return;
    }

    const drawNextDealerCardSplit = (currentHand) => {
      let score = calcScore(currentHand);
      if (score < 17) {
        setTimeout(() => {
          triggerHaptic(18); // Carte piochée par le croupier en split
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
          let handDetails = [];

          splitScores.forEach((sScore, idx) => {
            if (sScore > 21) {
              handDetails.push(`M${idx + 1}: Perdu (${sScore})`);
            } else if (finalDScore > 21 || sScore > finalDScore) {
              totalPayout += singleBet * 2;
              handDetails.push(`M${idx + 1}: Gagné (${sScore})`);
            } else if (sScore === finalDScore) {
              totalPayout += singleBet;
              handDetails.push(`M${idx + 1}: Égalité (${sScore})`);
            } else {
              handDetails.push(`M${idx + 1}: Perdu (${sScore})`);
            }
          });

          const netProfit = totalPayout - game.bet;
          if (netProfit > 0) {
            setFinancialRecords(prev => ({ ...prev, highestWin: Math.max(prev.highestWin, netProfit) }));
          } else if (netProfit < 0) {
            setFinancialRecords(prev => ({ ...prev, highestLoss: Math.min(prev.highestLoss, netProfit) }));
          }

          let resultBanner = '';
          if (netProfit > 0) {
            resultBanner = `SPLIT GAGNÉ (+${netProfit} CR) • ${handDetails.join(' | ')}`;
          } else if (netProfit === 0) {
            resultBanner = `BILAN NEUTRE (0 CR NET) • ${handDetails.join(' | ')}`;
          } else {
            resultBanner = `SPLIT PERDU (${netProfit} CR) • ${handDetails.join(' | ')}`;
          }

          const newTotalCredits = credits + totalPayout;
          setCredits(newTotalCredits);
          setGame(prev => ({ ...prev, status: 'FINISHED' }));
          setGameResult(resultBanner);
          setHistory(prev => [{
            id: Date.now(),
            type: netProfit > 0 ? 'WIN' : netProfit === 0 ? 'PUSH' : 'LOSS',
            bet: game.bet,
            payout: netProfit,
            score: `M1:${splitScores[0]} M2:${splitScores[1]} vs ${finalDScore}`,
            date: 'À l\'instant'
          }, ...prev]);
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

  // Computed Stats for Répartition
  const totalRounds = history.length;
  const winsCount = history.filter(h => h.type === 'WIN' || h.type === 'BLACKJACK').length;
  const pushCount = history.filter(h => h.type === 'PUSH').length;
  const lossCount = history.filter(h => h.type === 'LOSS').length;

  const winPct = totalRounds > 0 ? Math.round((winsCount / totalRounds) * 100) : 0;
  const pushPct = totalRounds > 0 ? Math.round((pushCount / totalRounds) * 100) : 0;
  const lossPct = totalRounds > 0 ? Math.round((lossCount / totalRounds) * 100) : 0;

  // Decision Percentages
  const totalDecisions = decisionStats.hits + decisionStats.stands + decisionStats.doubles + decisionStats.splits || 1;
  const hitPct = Math.round((decisionStats.hits / totalDecisions) * 100);
  const standPct = Math.round((decisionStats.stands / totalDecisions) * 100);
  const doublePct = Math.round((decisionStats.doubles / totalDecisions) * 100);
  const splitPct = Math.round((decisionStats.splits / totalDecisions) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* HEADER DE TABLE SEULEMENT EN JEU (FOND NOIR PUR, SANS DÉLIMITATION GRISE) */}
      {activeTab === 'GAME' && (
        <View style={styles.header}>
          <TouchableOpacity style={styles.leaveHeaderIconBtn} onPress={() => setShowLeaveModal(true)} activeOpacity={0.7}>
            <LogOut size={18} color="#f43f5e" />
          </TouchableOpacity>

          <View style={styles.bankrollPureTag}>
            <Coins size={14} color="#fbbf24" />
            <Text style={styles.bankrollPureText}>{credits}</Text>
          </View>
        </View>
      )}

      {/* GAME: full screen overlay, no paging */}
      {activeTab === 'GAME' && (
        <View style={styles.mainContent}>
          <View style={styles.gameContainer}>
            <View style={styles.tableFrame}>
              <View style={styles.tableInnerFelt}>

                {/* FILIGRANE TABLE AVEC PIOCHE COMPACTE AU MILIEU */}
                <View style={styles.tableCenterMarking}>
                  <Text style={styles.tableArcText}>BLACKJACK PAYS 3 TO 2</Text>

                  {/* PIOCHE DE CARTES AU MILIEU (JUSTE LOGO + NOMBRE) */}
                  <View style={styles.shoeCenterCompact}>
                    <View style={styles.shoeStackWrapperMini}>
                      <View style={{ position: 'absolute', top: -2, left: -2 }}>
                        <CardBackVisual skin={activeCardSkin} width={36} height={52} />
                      </View>
                      <View style={{ position: 'absolute', top: 0, left: 0 }}>
                        <CardBackVisual skin={activeCardSkin} width={36} height={52} />
                      </View>
                    </View>
                    <View style={styles.shoeCountMiniBadge}>
                      <Layers size={10} color="#737373" />
                      <Text style={styles.shoeCountMiniText}>{cardsRemaining}</Text>
                    </View>
                  </View>
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
                                <Text style={styles.splitHandBadgeText}>
                                  MAIN {hIdx + 1} ({game.splitScores[hIdx]})
                                  {game.status === 'FINISHED' && (
                                    game.splitScores[hIdx] > 21 ? ' • BUST' :
                                    (game.dealerScore > 21 || game.splitScores[hIdx] > game.dealerScore) ? ' • GAGNÉ' :
                                    game.splitScores[hIdx] === game.dealerScore ? ' • ÉGALITÉ' : ' • PERDU'
                                  )}
                                </Text>
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
                    <View style={styles.betAmountCleanRow}>
                      <Coins size={14} color="#fbbf24" />
                      <Text style={styles.betAmountCleanText}>{currentBet}</Text>
                    </View>
                    
                    <View style={styles.betHeaderActions}>
                      <TouchableOpacity style={styles.soberMaxBetBtn} onPress={handleMaxBet} activeOpacity={0.7}>
                        <Maximize2 size={11} color="#a3a3a3" />
                        <Text style={styles.soberMaxBetText}>MAX</Text>
                      </TouchableOpacity>

                      {betChips.length > 0 && (
                        <TouchableOpacity style={styles.soberClearBtn} onPress={handleClearChips} activeOpacity={0.7}>
                          <RotateCcw size={11} color="#737373" />
                          <Text style={styles.soberClearText}>EFFACER</Text>
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
                        return count === 1 ? (
                          <TouchableOpacity
                            key={val}
                            style={styles.singleChipWrap}
                            onPress={() => handleRemoveChip(val)}
                            activeOpacity={0.7}
                          >
                            <CasinoChip value={val} size={28} />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            key={val}
                            style={styles.chipSummaryBadge}
                            onPress={() => handleRemoveChip(val)}
                            activeOpacity={0.7}
                          >
                            <CasinoChip value={val} size={24} />
                            <Text style={styles.chipCountText}>x{count}</Text>
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
                    onPress={handleDeal} 
                    disabled={currentBet <= 0 || currentBet > credits || isDealing}
                  >
                    <Text style={styles.dealBtnText}>DISTRIBUER</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      )}

      {/* CONTENU PRINCIPAL (SHOP + HOME + PROFILE): rendu conditionnel + swipe via PanResponder capture */}
      {activeTab !== 'GAME' && (
        <Animated.View
          style={[styles.mainContent, { opacity: tabFadeAnim }]}
          {...swipeTabPanResponder.panHandlers}
        >
          {profileSubSection === null && (
            <View style={styles.gemsTopBand}>
              <GemDiamond size={18} color="#22c55e" />
              <Text style={styles.gemsTagText}>{gems}</Text>
            </View>
          )}

          {/* TAB 1: BOUTIQUE */}
          {activeTab === 'SHOP' && (
            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.shopScroll}>

              <Text style={styles.sectionTitle}>BOUTIQUE</Text>

              {/* RECHARGE GEMS */}
              <TouchableOpacity 
                style={styles.shopRechargeRow} 
                onPress={() => {
                  setGems(prev => prev + 50);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.shopRechargeLeft}>
                  <GemDiamond size={18} color="#22c55e" />
                  <View>
                    <Text style={styles.shopRechargeTitle}>Recharge quotidienne</Text>
                    <Text style={styles.shopRechargeDesc}>Obtenir +50 Gems gratuitement</Text>
                  </View>
                </View>
                <ChevronRight size={16} color="#525252" />
              </TouchableOpacity>

              <Text style={styles.shopSectionLabel}>COFFRES</Text>
              <View style={styles.chestsRow}>
                {CHESTS.map((chest) => (
                  <TouchableOpacity
                    key={chest.id}
                    style={styles.chestCellCompact}
                    onPress={() => {
                      setChestDetailChest(chest);
                    }}
                    activeOpacity={0.75}
                  >
                    <ChestVisual chest={chest} scale={0.78} />
                    <Text style={styles.chestCellTier}>{chest.tierName}</Text>
                    <View style={styles.chestCellPrice}>
                      <GemDiamond size={10} color="#22c55e" />
                      <Text style={styles.chestCellPriceText}>{chest.cost}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

            </ScrollView>
          )}

          {/* TAB 2: ACCUEIL */}
          {activeTab === 'HOME' && (
            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.homeScroll}>
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
                <Text style={styles.sectionTitle}>
                  DERNIÈRES PARTIES {history.length > 0 ? `(${Math.min(history.length, 10)})` : ''}
                </Text>
                {history.length === 0 ? (
                  <View style={styles.emptyHistoryBox}>
                    <Text style={styles.emptyHistoryText}>Aucune partie jouée pour le moment</Text>
                  </View>
                ) : (
                  history.slice(0, 10).map((item) => (
                    <View
                      key={item.id}
                      style={[
                        styles.historyRow,
                        item.type === 'WIN' || item.type === 'BLACKJACK' ? styles.historyRowWin
                          : item.type === 'PUSH' ? styles.historyRowPush
                          : styles.historyRowLoss
                      ]}
                    >
                      <View style={styles.historyLeft}>
                        <Text style={[styles.historyTypeBadge,
                          item.type === 'WIN' || item.type === 'BLACKJACK' ? styles.textGreen
                            : item.type === 'PUSH' ? styles.textGray : styles.textRed]}>
                          {item.type === 'WIN' ? 'GAGNÉ' : item.type === 'BLACKJACK' ? 'BLACKJACK' : item.type === 'PUSH' ? 'ÉGALITÉ' : 'PERDU'}
                        </Text>
                        <Text style={styles.historyScoreText}>{item.score}</Text>
                      </View>
                      <View style={styles.historyRight}>
                        <Text style={[styles.historyAmountText,
                          item.payout > 0 ? styles.textGreen : item.payout < 0 ? styles.textRed : styles.textGray]}>
                          {item.payout > 0 ? `+${item.payout} CR` : item.payout < 0 ? `${item.payout} CR` : '0 CR'}
                        </Text>
                        <Text style={styles.historyDateText}>{item.date}</Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
            </ScrollView>
          )}

          {/* TAB PROFILE */}
          {activeTab === 'PROFILE' && (
            <View style={{ flex: 1, backgroundColor: '#000000' }}>
              {profileSubSection && (
                <View style={styles.stickySubHeaderBar}>
                  <TouchableOpacity
                    style={styles.stickyBackBtnIconOnly}
                    onPress={closeSubSection}
                    activeOpacity={0.7}
                  >
                    <ChevronLeft size={22} color="#ffffff" />
                  </TouchableOpacity>
                  {profileSubSection === 'CARDBACKS' && (
                    <View style={styles.equippedMiniCardHeaderRight}>
                      <CardBackVisual skin={activeCardSkin} width={24} height={34} />
                    </View>
                  )}
                </View>
              )}

              <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.profileScroll}>
                {profileSubSection ? (
                  <Animated.View
                    style={[styles.subSectionContainer, { transform: [{ translateY: subSectionSlideAnim }] }]}
                    {...swipeSubSectionPanResponder.panHandlers}
                  >

                    {/* 1. STATISTIQUES AVANCÉES COMPLETES */}
                  {profileSubSection === 'STATS' && (
                    <View style={styles.subCard}>
                      <Text style={styles.subTitle}>STATISTIQUES AVANCÉES</Text>

                      {/* PROGRESSION SOLDE */}
                      <View style={styles.chartContainer}>
                        <Text style={styles.chartTitle}>PROGRESSION DU SOLDE</Text>
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

                      {/* RÉPARTITION DES RÉSULTATS */}
                      <View style={styles.statsSectionBox}>
                        <View style={styles.statsSectionHeaderRow}>
                          <Activity size={14} color="#e11d48" />
                          <Text style={styles.statsSectionTitleText}>RÉPARTITION DES RÉSULTATS</Text>
                        </View>

                        <View style={styles.distributionBarContainer}>
                          <View style={[styles.distBarSeg, { width: `${winPct}%`, backgroundColor: '#16a34a' }]} />
                          <View style={[styles.distBarSeg, { width: `${pushPct}%`, backgroundColor: '#737373' }]} />
                          <View style={[styles.distBarSeg, { width: `${lossPct}%`, backgroundColor: '#dc2626' }]} />
                        </View>

                        <View style={styles.distLegendRow}>
                          <Text style={[styles.distLegendText, styles.textGreen]}>Victoires: {winsCount} ({winPct}%)</Text>
                          <Text style={[styles.distLegendText, styles.textGray]}>Égalités: {pushCount} ({pushPct}%)</Text>
                          <Text style={[styles.distLegendText, styles.textRed]}>Défaites: {lossCount} ({lossPct}%)</Text>
                        </View>
                      </View>

                      {/* RECORDS FINANCIERS */}
                      <View style={styles.statsSectionBox}>
                        <View style={styles.statsSectionHeaderRow}>
                          <TrendingUp size={14} color="#f59e0b" />
                          <Text style={styles.statsSectionTitleText}>RECORDS FINANCIERS</Text>
                        </View>

                        <View style={styles.recordsGrid}>
                          <View style={styles.recordCard}>
                            <Text style={styles.recordLabel}>PLUS GROSSE MISE</Text>
                            <Text style={styles.recordValue}>{financialRecords.highestBet} CR</Text>
                          </View>

                          <View style={styles.recordCard}>
                            <Text style={styles.recordLabel}>PLUS GROS GAIN</Text>
                            <Text style={[styles.recordValue, styles.textGreen]}>+{financialRecords.highestWin} CR</Text>
                          </View>

                          <View style={styles.recordCard}>
                            <Text style={styles.recordLabel}>PLUS GROSSE PERTE</Text>
                            <Text style={[styles.recordValue, styles.textRed]}>{financialRecords.highestLoss} CR</Text>
                          </View>
                        </View>
                      </View>

                      {/* HISTORIQUE DES DÉCISIONS */}
                      <View style={styles.statsSectionBox}>
                        <View style={styles.statsSectionHeaderRow}>
                          <Target size={14} color="#2563eb" />
                          <Text style={styles.statsSectionTitleText}>HISTORIQUE DES DÉCISIONS</Text>
                        </View>

                        <View style={styles.decisionRow}>
                          <Text style={styles.decisionLabel}>Tirer (Hit)</Text>
                          <Text style={styles.decisionValue}>{decisionStats.hits} fois ({hitPct}%)</Text>
                        </View>

                        <View style={styles.decisionRow}>
                          <Text style={styles.decisionLabel}>Rester (Stand)</Text>
                          <Text style={styles.decisionValue}>{decisionStats.stands} fois ({standPct}%)</Text>
                        </View>

                        <View style={styles.decisionRow}>
                          <Text style={styles.decisionLabel}>Double (Double Down)</Text>
                          <Text style={styles.decisionValue}>{decisionStats.doubles} fois ({doublePct}%)</Text>
                        </View>

                        <View style={styles.decisionRow}>
                          <Text style={styles.decisionLabel}>Split</Text>
                          <Text style={styles.decisionValue}>{decisionStats.splits} fois ({splitPct}%)</Text>
                        </View>
                      </View>

                      {/* BOUTON DE RÉINITIALISATION DE TOUTES LES STATS */}
                      <TouchableOpacity style={styles.resetStatsBtn} onPress={handleResetStats} activeOpacity={0.8}>
                        <RotateCcw size={14} color="#f43f5e" />
                        <Text style={styles.resetStatsBtnText}>RÉINITIALISER LES STATISTIQUES</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* 2. SUCCÈS CLAIRMENT SÉPARÉS (EN COURS / TERMINÉS) */}
                  {profileSubSection === 'ACHIEVEMENTS' && (
                    <View style={styles.subCard}>
                      <Text style={styles.subTitle}>SUCCÈS</Text>
                      
                      {/* GROUPE 1: SUCCÈS EN COURS */}
                      <Text style={styles.groupHeaderTitle}>SUCCÈS EN COURS</Text>
                      {achievements.filter(a => !a.completed).map((ach) => (
                        <View key={ach.id} style={styles.achievementRow}>
                          <Zap size={20} color="#f59e0b" />
                          <View style={styles.achievementInfo}>
                            <Text style={styles.achievementTitle}>{ach.title}</Text>
                            <Text style={styles.achievementDesc}>{ach.desc}</Text>
                          </View>
                          <View style={styles.progressBadge}>
                            <Text style={styles.progressText}>
                              {ach.id === 6
                                ? `${cardBackSkins.filter((s) => s.unlocked).length}/${ach.target}`
                                : `${ach.current}/${ach.target}`}
                            </Text>
                          </View>
                        </View>
                      ))}

                      {/* GROUPE 2: SUCCÈS TERMINÉS */}
                      <Text style={[styles.groupHeaderTitle, { marginTop: 14 }]}>SUCCÈS TERMINÉS</Text>
                      {achievements.filter(a => a.completed).map((ach) => (
                        <View key={ach.id} style={styles.achievementRowCompleted}>
                          <CheckCircle2 size={20} color="#16a34a" />
                          <View style={styles.achievementInfo}>
                            <Text style={styles.achievementTitle}>{ach.title}</Text>
                            <Text style={styles.achievementDesc}>{ach.desc}</Text>
                          </View>
                          <View style={styles.unlockedBadge}>
                            <Text style={styles.unlockedText}>TERMINÉ</Text>
                          </View>
                        </View>
                      ))}
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

                  {/* 4. DOS DE CARTES (GRILLE COMPACTE: 2 CARTES EN CHEVAUCHEMENT PAR SKIN) */}
                  {profileSubSection === 'CARDBACKS' && (
                    <View style={styles.subCard}>
                      <Text style={styles.subTitle}>
                        DOS DE CARTES ({cardBackSkins.filter((s) => s.unlocked).length}/{cardBackSkins.length})
                      </Text>

                      {cardBackSkins.filter((s) => s.unlocked).length < cardBackSkins.length && (
                        <Text style={styles.cardBackUnlockHint}>
                          Débloquez de nouveaux designs via le Coffre Épique
                        </Text>
                      )}

                      <View style={styles.cardSkinsTwoColumnGrid}>
                        {cardBackSkins.map((skin) => {
                          const isEquipped = equippedCardBackId === skin.id;
                          const isLocked = !skin.unlocked;
                          return (
                            <TouchableOpacity
                              key={skin.id}
                              style={[
                                styles.compactSkinHandContainer,
                                isEquipped && styles.compactSkinHandContainerEquipped,
                                isLocked && styles.compactSkinHandContainerLocked,
                              ]}
                              onPress={() => !isLocked && handleEquipCardBack(skin)}
                              activeOpacity={isLocked ? 1 : 0.85}
                            >
                              <View style={styles.overlappingHandWrapper}>
                                <View style={styles.cardOverlapBack}>
                                  <CardBackVisual skin={skin} width={50} height={74} />
                                </View>
                                <View style={styles.cardOverlapFront}>
                                  <CardBackVisual skin={skin} width={50} height={74} />
                                </View>
                              </View>

                              {/* Overlay gris cadenas pour les cartes verrouillées */}
                              {isLocked && (
                                <View style={styles.lockedSkinOverlay}>
                                  <Lock size={16} color="#737373" />
                                </View>
                              )}

                              {isEquipped && (
                                <View style={styles.equippedBadge}>
                                  <Check size={10} color="#ffffff" />
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

                      <View style={styles.settingRowItem}>
                        <Text style={styles.subText}>• Pseudo : <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>{username}</Text></Text>
                        <TouchableOpacity 
                          style={styles.editNameSmallBtn} 
                          onPress={() => { setNameInput(username); setShowEditNameModal(true); }}
                          activeOpacity={0.7}
                        >
                          <Edit3 size={13} color="#f43f5e" />
                          <Text style={styles.editNameSmallBtnText}>MODIFIER</Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.settingRowItem}>
                        <Text style={styles.subText}>• Vibrations : <Text style={{ color: hapticsEnabled ? '#16a34a' : '#ef4444', fontWeight: 'bold' }}>{hapticsEnabled ? 'Activées' : 'Désactivées'}</Text></Text>
                        <TouchableOpacity 
                          style={[styles.toggleBtn, hapticsEnabled ? styles.toggleBtnActive : styles.toggleBtnInactive]} 
                          onPress={() => {
                            const next = !hapticsEnabled;
                            setHapticsEnabled(next);
                            if (next) try { Vibration.vibrate(20); } catch(e){}
                          }}
                          activeOpacity={0.7}
                        >
                          <Smartphone size={12} color={hapticsEnabled ? '#ffffff' : '#a3a3a3'} />
                          <Text style={styles.toggleBtnText}>{hapticsEnabled ? 'OUI' : 'NON'}</Text>
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.subText}>• Effets sonores : Activés</Text>
                      <Text style={styles.subText}>• Thème : Sombre Épuré Offsuit OLED</Text>
                      <Text style={styles.subText}>• Version App : 2.6.0 Standalone Native</Text>

                      <View style={{ marginTop: 16 }}>
                        <TouchableOpacity style={styles.resetStatsBtn} onPress={handleResetStats} activeOpacity={0.8}>
                          <RotateCcw size={14} color="#f43f5e" />
                          <Text style={styles.resetStatsBtnText}>RÉINITIALISER STATS & HISTORIQUE</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                </Animated.View>
              ) : (
                /* MENU PROFIL EN GRILLE INTERACTIVE DE TUILES MODERNE (2 COLONNES) */
                <View style={styles.profileMenuContainer}>
                  <View style={styles.profileHeaderCard}>
                    <View style={styles.avatarCircle}>
                      <User size={28} color="#ffffff" />
                    </View>
                    <Text style={styles.profileUsername}>{username}</Text>
                    <Text style={styles.profileLevelText}>Joueur Niveau 5 • {credits} CR</Text>
                  </View>

                  {credits === 0 && (
                    <TouchableOpacity style={styles.failsafeBtn} onPress={handleClaimFailsafe}>
                      <LifeBuoy size={18} color="#ffffff" />
                      <Text style={styles.failsafeBtnText}>OBTENIR 100 CR GRATUITS</Text>
                    </TouchableOpacity>
                  )}

                  {/* GRILLE D'ONGLETS / TUILES DE PROFIL (2 COLONNES) */}
                  <View style={styles.profileTilesGrid}>
                    
                    <TouchableOpacity style={styles.profileTileCard} onPress={() => openSubSection('STATS')}>
                      <View style={[styles.tileIconCircle, { backgroundColor: '#311018' }]}>
                        <BarChart2 size={20} color="#f43f5e" />
                      </View>
                      <Text style={styles.tileTitle}>Statistiques</Text>
                      <Text style={styles.tileSubtitle}>Graphique & bilans</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.profileTileCard} onPress={() => openSubSection('CARDBACKS')}>
                      <View style={[styles.tileIconCircle, { backgroundColor: '#2d1222' }]}>
                        <Palette size={20} color="#e11d48" />
                      </View>
                      <Text style={styles.tileTitle}>Dos de Cartes</Text>
                      <Text style={styles.tileSubtitle}>
                        {cardBackSkins.filter((s) => s.unlocked).length}/{cardBackSkins.length} débloqués
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.profileTileCard} onPress={() => openSubSection('CHALLENGES')}>
                      <View style={[styles.tileIconCircle, { backgroundColor: '#2a1a08' }]}>
                        <Flame size={20} color="#f59e0b" />
                      </View>
                      <Text style={styles.tileTitle}>Défis Quotidiens</Text>
                      <Text style={styles.tileSubtitle}>Missions & CR</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.profileTileCard} onPress={() => openSubSection('ACHIEVEMENTS')}>
                      <View style={[styles.tileIconCircle, { backgroundColor: '#092716' }]}>
                        <Award size={20} color="#16a34a" />
                      </View>
                      <Text style={styles.tileTitle}>Succès</Text>
                      <Text style={styles.tileSubtitle}>Objectifs & jalons</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.profileTileCard} onPress={() => openSubSection('LEARN')}>
                      <View style={[styles.tileIconCircle, { backgroundColor: '#0a1d37' }]}>
                        <HelpCircle size={20} color="#2563eb" />
                      </View>
                      <Text style={styles.tileTitle}>Apprendre</Text>
                      <Text style={styles.tileSubtitle}>Règles & conseils</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.profileTileCard} onPress={() => openSubSection('SETTINGS')}>
                      <View style={[styles.tileIconCircle, { backgroundColor: '#1c1c1c' }]}>
                        <Settings size={20} color="#a3a3a3" />
                      </View>
                      <Text style={styles.tileTitle}>Paramètres</Text>
                      <Text style={styles.tileSubtitle}>Options du compte</Text>
                    </TouchableOpacity>

                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        )}

      </Animated.View>
      )}

      {/* BARRE EN BAS (MASQUÉE PENDANT LE JEU ET DANS TOUS LES SOUS-ONGLETS DU PROFIL) */}
      {activeTab !== 'GAME' && profileSubSection === null && (
        <View style={styles.bottomTabBarTranslucent}>
          <TouchableOpacity 
            style={[styles.tabItem, activeTab === 'SHOP' && styles.tabItemActive]} 
            onPress={() => changeTab('SHOP')}
          >
            <ShoppingBag size={24} color={activeTab === 'SHOP' ? '#06b6d4' : '#737373'} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabItem, activeTab === 'HOME' && styles.tabItemActive]} 
            onPress={() => changeTab('HOME')}
          >
            <Home size={24} color={activeTab === 'HOME' ? '#ffffff' : '#737373'} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabItem, activeTab === 'PROFILE' && styles.tabItemActive]} 
            onPress={() => changeTab('PROFILE')}
          >
            <User size={24} color={activeTab === 'PROFILE' ? '#ffffff' : '#737373'} />
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

      {/* MODAL DE CHANGER LE PSEUDO */}
      <Modal
        visible={showEditNameModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowEditNameModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.leaveModalBox}>
            <Text style={styles.modalTitle}>MODIFIER LE PSEUDO</Text>
            <Text style={styles.modalSubText}>Choisissez votre nouveau pseudo :</Text>

            <TextInput
              style={styles.usernameInput}
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="ex: user_1234"
              placeholderTextColor="#525252"
              maxLength={16}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowEditNameModal(false)}>
                <Text style={styles.modalCancelBtnText}>ANNULER</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalConfirmBtn} onPress={handleSaveUsername}>
                <Text style={styles.modalConfirmBtnText}>ENREGISTRER</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* SOUS-MENU DÉTAIL COFFRE (3/4 ÉCRAN) */}
      <Modal
        visible={chestDetailChest !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setChestDetailChest(null)}
      >
        <View style={styles.chestSheetOverlay}>
          <TouchableOpacity
            style={styles.chestSheetBackdrop}
            activeOpacity={1}
            onPress={() => setChestDetailChest(null)}
          />
          {chestDetailChest && (
            <Animated.View
              style={[
                styles.chestSheet,
                { transform: [{ translateY: chestSheetTranslateY }] },
              ]}
              {...chestSheetPanResponder.panHandlers}
            >
              <View style={styles.chestSheetHandle} />

              <View style={styles.chestSheetVisualWrap}>
                <ChestVisual chest={chestDetailChest} scale={1.55} />
              </View>

              <Text style={styles.chestSheetTitle}>
                Coffre de {chestDetailChest.tierName}
              </Text>

              <Text style={styles.chestSheetSectionLabel}>CONTENU DU COFFRE</Text>

              {/* CONTENU DIRECT ET VISUEL (PAS DE TEXTE DESCRIPTIF) */}
              {chestDetailChest.type === 'CREDITS' ? (
                <View style={styles.chestVisualRewardDirectBox}>
                  <Coins size={38} color="#fbbf24" />
                  <Text style={styles.chestVisualRewardDirectText}>
                    {chestDetailChest.minCredits} – {chestDetailChest.maxCredits} CR
                  </Text>
                </View>
              ) : (
                <View style={styles.chestVisualCardsDirectRow}>
                  {cardBackSkins.filter((s) => !s.unlocked).slice(0, 4).map((skin) => (
                    <View key={skin.id} style={styles.chestDirectMiniCardWrap}>
                      <CardBackVisual skin={skin} width={42} height={60} />
                    </View>
                  ))}
                  {cardBackSkins.filter((s) => !s.unlocked).length > 4 && (
                    <View style={styles.chestDirectMoreBadge}>
                      <Text style={styles.chestDirectMoreText}>
                        +{cardBackSkins.filter((s) => !s.unlocked).length - 4}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              <View style={styles.chestSheetSpacer} />

              <TouchableOpacity
                style={[
                  styles.chestOpenBtn,
                  gems < chestDetailChest.cost && styles.chestOpenBtnDisabled,
                ]}
                onPress={() => handleBuyChest(chestDetailChest)}
                disabled={gems < chestDetailChest.cost}
                activeOpacity={gems < chestDetailChest.cost ? 1 : 0.85}
              >
                <Text style={[
                  styles.chestOpenBtnLabel,
                  gems < chestDetailChest.cost && { color: '#525252' },
                ]}>
                  {gems < chestDetailChest.cost ? 'GEMS INSUFFISANTES' : 'OUVRIR'}
                </Text>
                <View style={styles.chestOpenBtnPrice}>
                  <GemDiamond size={14} color={gems < chestDetailChest.cost ? '#525252' : '#22c55e'} />
                  <Text style={[
                    styles.chestOpenBtnPriceText,
                    gems < chestDetailChest.cost && { color: '#525252' },
                  ]}>
                    {chestDetailChest.cost}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </Modal>

      {/* ROULETTE TIRAGE CRÉDITS (COFFRES BRONZE & OR) */}
      <CreditRouletteModal
        visible={creditRoulette !== null}
        minCredits={creditRoulette?.minCredits}
        maxCredits={creditRoulette?.maxCredits}
        winnerCredits={creditRoulette?.winnerCredits}
        tierName={creditRoulette?.tierName}
        onComplete={handleCreditRouletteComplete}
      />

      {/* ROULETTE DOS DE CARTE (COFFRE ÉPIQUE) */}
      <CardBackRouletteModal
        visible={cardBackRoulette !== null}
        cardBackSkins={cardBackSkins}
        winnerId={cardBackRoulette?.winnerId}
        onComplete={handleRouletteComplete}
      />

      {/* MODAL D'OUVERTURE DE COFFRE ET GEMS */}
      <Modal
        visible={rewardModalInfo !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setRewardModalInfo(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.leaveModalBox}>
            <Text style={[
              styles.modalTitle, 
              rewardModalInfo?.type === 'ERROR' ? { color: '#ef4444' } : { color: '#06b6d4' }
            ]}>
              {rewardModalInfo?.title}
            </Text>
            <Text style={styles.modalSubText}>{rewardModalInfo?.desc}</Text>

            {rewardModalInfo?.cardBackId && (
              <View style={styles.rewardCardBackPreview}>
                <CardBackVisual
                  skin={cardBackSkins.find((s) => s.id === rewardModalInfo.cardBackId) || cardBackSkins[0]}
                  width={58}
                  height={84}
                />
              </View>
            )}

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity 
                style={[
                  styles.modalConfirmBtn, 
                  rewardModalInfo?.type === 'ERROR' ? { backgroundColor: '#dc2626' } : { backgroundColor: '#0891b2' }
                ]} 
                onPress={() => setRewardModalInfo(null)}
              >
                <Text style={styles.modalConfirmBtnText}>SUPER !</Text>
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
    backgroundColor: '#000000',
  },
  // Bande dédiée en haut pour les Gems (pousse le contenu des onglets vers le bas)
  gemsTopBand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#000000',
  },
  gemsTagText: {
    color: '#22c55e',
    fontSize: 16,
    fontWeight: '900',
  },

  // SHOP STYLES
  shopScroll: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 110,
    gap: 6,
  },
  shopRechargeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0d0d0d',
    borderColor: '#1c1c1c',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  shopRechargeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  shopRechargeTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  shopRechargeDesc: {
    color: '#525252',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  shopSectionLabel: {
    color: '#404040',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  chestsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    gap: 8,
  },
  chestCellCompact: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1c1c1c',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 6,
    gap: 10,
  },
  chestCellTier: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  chestCellPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chestCellPriceText: {
    color: '#22c55e',
    fontSize: 11,
    fontWeight: '900',
  },
  chestSheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  chestSheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  chestSheet: {
    height: '75%',
    backgroundColor: '#0a0a0a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: '#262626',
    borderBottomWidth: 0,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 28,
    flexDirection: 'column',
  },
  chestSheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#333333',
    marginBottom: 20,
  },
  chestSheetVisualWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginBottom: 16,
  },
  chestSheetTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.3,
    marginBottom: 24,
  },
  chestSheetSectionLabel: {
    color: '#525252',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  chestVisualRewardDirectBox: {
    backgroundColor: '#121212',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f1f1f',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 12,
    marginBottom: 20,
  },
  chestVisualRewardDirectText: {
    color: '#fbbf24',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  chestVisualCardsDirectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#121212',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f1f1f',
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  chestDirectMiniCardWrap: {
    borderRadius: 6,
    overflow: 'hidden',
  },
  chestDirectMoreBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1c1c1c',
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chestDirectMoreText: {
    color: '#a3a3a3',
    fontSize: 12,
    fontWeight: '900',
  },
  chestOpenBtnDisabled: {
    backgroundColor: '#0a0a0a',
    borderColor: '#1a1a1a',
    opacity: 0.6,
  },

  /* ROULETTE CRÉDITS */
  creditRouletteBox: {
    width: '100%',
    backgroundColor: '#0d0d0d',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#ca8a04',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    gap: 14,
    position: 'relative',
    overflow: 'hidden',
  },
  creditRouletteValue: {
    color: '#fbbf24',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  creditRouletteGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(251, 191, 36, 0.08)',
  },
  chestOpenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  chestOpenBtnLabel: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
  chestOpenBtnPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  chestOpenBtnPriceText: {
    color: '#22c55e',
    fontSize: 15,
    fontWeight: '900',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000000',
  },
  leaveHeaderIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankrollPureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  bankrollPureText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  mainContent: {
    flex: 1,
  },
  homeScroll: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 20,
    backgroundColor: '#000000',
  },
  homeHeroCard: {
    backgroundColor: '#080808',
    borderWidth: 1,
    borderColor: '#1c1c1c',
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
    marginVertical: 10,
  },
  heroPlayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#e11d48',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 10,
  },
  heroPlayBtnText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1,
  },
  failsafeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#15803d',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#4ade80',
  },
  settingRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  toggleBtnActive: {
    backgroundColor: '#15803d',
    borderColor: '#22c55e',
  },
  toggleBtnInactive: {
    backgroundColor: '#1c1c1c',
    borderColor: '#333333',
  },
  toggleBtnText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  editNameSmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1f1214',
    borderColor: '#4c1d24',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  editNameSmallBtnText: {
    color: '#f43f5e',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  usernameInput: {
    backgroundColor: '#0a0a0a',
    borderColor: '#262626',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    marginVertical: 14,
    textAlign: 'center',
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
  emptyHistoryBox: {
    backgroundColor: '#080808',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1a1a1a',
    borderStyle: 'dashed',
  },
  emptyHistoryText: {
    color: '#525252',
    fontSize: 13,
    fontWeight: '600',
  },
  resetStatsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1f1214',
    borderColor: '#4c1d24',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  resetStatsBtnText: {
    color: '#f43f5e',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  historyItem: {
    backgroundColor: '#080808',
    borderColor: '#1c1c1c',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 6,
  },
  historyRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyScore: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  historyType: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  historyRowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyBet: {
    color: '#525252',
    fontSize: 10,
    fontWeight: '700',
  },
  historyTime: {
    color: '#525252',
    fontSize: 9,
    fontWeight: '500',
  },
  historyPayout: {
    fontWeight: '900',
    fontSize: 12,
  },
  gameContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  tableFrame: {
    flex: 1,
    margin: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#1c1c1c',
    backgroundColor: '#050505',
    padding: 10,
  },
  tableInnerFelt: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#181818',
    backgroundColor: '#0d0d0d',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    position: 'relative',
  },
  tableCenterMarking: {
    position: 'absolute',
    top: '38%',
    alignItems: 'center',
    gap: 8,
  },
  tableArcText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 3,
    opacity: 0.22,
  },
  shoeCenterCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  shoeStackWrapperMini: {
    position: 'relative',
    width: 36,
    height: 52,
  },
  shoeCountMiniBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1c1c1c',
  },
  shoeCountMiniText: {
    color: '#a3a3a3',
    fontSize: 11,
    fontWeight: '900',
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
    minHeight: 84,
    justifyContent: 'center',
  },
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
  cardRankRed: { color: '#dc2626', fontWeight: '900', fontSize: 18 },
  cardSuitRed: { color: '#dc2626', fontSize: 16 },
  cardRankBlack: { color: '#171717', fontWeight: '900', fontSize: 18 },
  cardSuitBlack: { color: '#171717', fontSize: 16 },
  cardRankRedSmall: { color: '#dc2626', fontWeight: '900', fontSize: 14 },
  cardSuitRedSmall: { color: '#dc2626', fontSize: 12 },
  cardRankBlackSmall: { color: '#171717', fontWeight: '900', fontSize: 14 },
  cardSuitBlackSmall: { color: '#171717', fontSize: 12 },
  emptyCardSlotClean: {
    width: 58,
    height: 84,
  },
  splitHandsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  splitHandBox: {
    backgroundColor: '#141414',
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
    backgroundColor: '#1c1c1c',
    borderColor: '#333333',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  resultBannerText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1,
  },
  gameControlsPanel: {
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#1c1c1c',
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
  betAmountCleanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  betAmountCleanText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 17,
  },
  betHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  soberMaxBetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#121212',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#262626',
  },
  soberMaxBetText: {
    color: '#e5e5e5',
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  soberClearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#121212',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#262626',
  },
  soberClearText: {
    color: '#737373',
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
  singleChipWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSummaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121212',
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
  profileScroll: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#000000',
  },
  profileMenuContainer: {
    gap: 16,
  },
  profileHeaderCard: {
    backgroundColor: '#080808',
    borderWidth: 1,
    borderColor: '#1c1c1c',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#1c1c1c',
    borderWidth: 1,
    borderColor: '#333333',
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
  profileTilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  profileTileCard: {
    width: '48%',
    backgroundColor: '#080808',
    borderWidth: 1,
    borderColor: '#1c1c1c',
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  tileIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  tileTitle: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 13,
  },
  tileSubtitle: {
    color: '#737373',
    fontSize: 10,
    fontWeight: '600',
  },
  subSectionContainer: {
    gap: 12,
  },
  
  /* EN-TÊTE FIXE POUR SOUS-SECTIONS DE PROFIL */
  stickySubHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#080808',
    borderBottomWidth: 1,
    borderBottomColor: '#1c1c1c',
  },
  stickyBackBtnIconOnly: {
    backgroundColor: '#1c1c1c',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  equippedMiniCardHeaderRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  subCard: {
    backgroundColor: '#080808',
    borderWidth: 1,
    borderColor: '#1c1c1c',
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

  /* STATISTIQUES AVANCÉES ENRICHIES */
  statsSectionBox: {
    backgroundColor: '#121212',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1c1c1c',
    gap: 8,
    marginVertical: 4,
  },
  statsSectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  statsSectionTitleText: {
    color: '#e5e5e5',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  distributionBarContainer: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#262626',
  },
  distBarSeg: {
    height: '100%',
  },
  distLegendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  distLegendText: {
    fontSize: 10,
    fontWeight: '800',
  },
  recordsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  recordCard: {
    flex: 1,
    backgroundColor: '#080808',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1c1c1c',
    alignItems: 'center',
  },
  recordLabel: {
    color: '#737373',
    fontSize: 8,
    fontWeight: '900',
    textAlign: 'center',
  },
  recordValue: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    marginTop: 4,
  },
  decisionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#1c1c1c',
  },
  decisionLabel: {
    color: '#a3a3a3',
    fontSize: 11,
    fontWeight: '700',
  },
  decisionValue: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },

  /* SUCCÈS CLAIRMENT SÉPARÉS */
  groupHeaderTitle: {
    color: '#f59e0b',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 6,
    marginBottom: 2,
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#121212',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1c1c1c',
  },
  achievementRowCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#052e16',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#16a34a',
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
    color: '#a3a3a3',
    fontSize: 10,
  },
  unlockedBadge: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  unlockedText: {
    color: '#ffffff',
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
    color: '#f59e0b',
    fontSize: 9,
    fontWeight: '900',
  },

  /* DÉFIS QUOTIDIENS */
  challengeCard: {
    backgroundColor: '#121212',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1c1c1c',
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
    backgroundColor: '#1c1c1c',
    paddingVertical: 6,
    borderRadius: 6,
  },
  claimedBtnText: {
    color: '#a3a3a3',
    fontWeight: '900',
    fontSize: 9,
  },
  inProgressBtn: {
    backgroundColor: '#1c1c1c',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  inProgressBtnText: {
    color: '#737373',
    fontWeight: '900',
    fontSize: 9,
  },

  /* DOS DE CARTES (GRILLE COMPACTE: 2 CARTES EN CHEVAUCHEMENT PAR SKIN) */
  cardSkinsTwoColumnGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 8,
  },
  compactSkinHandContainer: {
    width: '48%',
    height: 100,
    backgroundColor: '#050505',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#1c1c1c',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  compactSkinHandContainerEquipped: {
    borderColor: '#e11d48',
    borderWidth: 2,
    backgroundColor: '#14070a',
    shadowColor: '#e11d48',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  compactSkinHandContainerLocked: {
    borderColor: '#1c1c1c',
    opacity: 0.45,
  },
  lockedSkinOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlappingHandWrapper: {
    width: 90,
    height: 74,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardOverlapBack: {
    position: 'absolute',
    left: 8,
    top: 0,
    transform: [{ rotate: '-6deg' }],
  },
  cardOverlapFront: {
    position: 'absolute',
    left: 32,
    top: 0,
    transform: [{ rotate: '4deg' }],
  },
  equippedBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#e11d48',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBackUnlockHint: {
    color: '#525252',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },

  /* ROULETTE DOS DE CARTE */
  rouletteOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  rouletteTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  rouletteSubtitle: {
    color: '#737373',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 28,
  },
  rouletteViewport: {
    height: 120,
    overflow: 'hidden',
    position: 'relative',
    alignSelf: 'center',
  },
  rouletteCenterMarker: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    marginLeft: -(ROULETTE_ITEM_WIDTH / 2),
    width: ROULETTE_ITEM_WIDTH,
    borderWidth: 2,
    borderColor: '#22c55e',
    borderRadius: 10,
    zIndex: 10,
    backgroundColor: 'rgba(34, 197, 94, 0.06)',
  },
  rouletteItemWrap: {
    width: ROULETTE_ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rouletteItem: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rouletteLockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.62)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rouletteWinnerGlow: {
    position: 'absolute',
    width: ROULETTE_CARD_W + 16,
    height: ROULETTE_CARD_H + 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#22c55e',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
  },
  rouletteResultBox: {
    marginTop: 32,
    alignItems: 'center',
    width: '100%',
  },
  rouletteResultName: {
    color: '#22c55e',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center',
  },
  rouletteResultHint: {
    color: '#737373',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  rouletteContinueBtn: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
  },
  rouletteContinueBtnText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  rewardCardBackPreview: {
    alignItems: 'center',
    marginVertical: 16,
  },

  /* GRAPHIQUE DU SOLDE */
  chartContainer: {
    backgroundColor: '#121212',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1c1c1c',
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

  /* BOTTOM TAB BAR TRANSLUCIDE (ALPHAS / FLOU SUR NOIR OLED) */
  bottomTabBarTranslucent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.52)',
    borderTopWidth: 0,
    paddingVertical: 20,
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemActive: {
    opacity: 1,
  },
  tabItemDisabled: {
    opacity: 0.35,
  },

  /* LEAVE CONFIRMATION MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  leaveModalBox: {
    backgroundColor: '#080808',
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
    backgroundColor: '#1c1c1c',
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

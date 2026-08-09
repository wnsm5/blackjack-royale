# 🃏 Blackjack Royale — Application Web & Mobile PWA

Application full-stack de **Blackjack** complète, réactive et sécurisée, utilisable sur navigateur desktop et smartphone (PWA installable).

---

## 🚀 Stack Technique

- **Frontend :** React 18 + TypeScript + Vite + Tailwind CSS v3 + Zustand + Lucide Icons + PWA
- **Backend :** Node.js + TypeScript + Express + Prisma ORM + SQLite
- **Sécurité :** JWT Token + bcrypt password hashing + crypto-shuffle + machine à états serveur
- **Tests :** Vitest (unitaires, règles, machine à états et simulation de 1 000 parties)

---

## 🛠️ PRÉREQUIS

- Node.js (version 18+ recommandée)
- npm (version 9+ recommandée)

---

## 📦 INSTALLATION

1. **Cloner le projet et installer les dépendances :**

```bash
npm install
```

2. **Configurer l'environnement :**

Le fichier `.env` à la racine est préconfiguré :
```env
PORT=3001
NODE_ENV=development
JWT_SECRET=supersecret-blackjack-jwt-key-2026-change-in-prod
DATABASE_URL="file:./dev.db"
CORS_ORIGIN=http://localhost:5173
```

3. **Générer et initialiser la base de données SQLite :**

```bash
npm run prisma:generate
npm run prisma:push
```

---

## ⚡ LANCEMENT EN DÉVELOPPEMENT

Lancer simultanément le serveur backend (port 3001) et le frontend Vite (port 5173) :

```bash
npm run dev
```

- **Application Web / Mobile :** [http://localhost:5173](http://localhost:5173)
- **API Backend :** [http://localhost:3001/api](http://localhost:3001/api)

---

## 🧪 EXÉCUTION DES TESTS

Lancer la suite de tests complète (Unitaires + Simulation 1 000 parties) :

```bash
npm run test
```

---

## 📱 FONCTIONNALITÉS CLÉS

1. **Moteur Blackjack Indépendant :**
   - Règle Dealer Soft 17 (`As + 6 = 17 -> STAND`)
   - Paiement Natural Blackjack 3:2
   - Doubler (Double Down) & Séparer jusqu'à 4 mains (Split)
   - Re-Split des As & Split d'As (1 seule carte par As)
   - Late Surrender (Récupération de 50% de la mise)
   - Insurance & Even Money

2. **Progression & Gamification :**
   - 50+ Niveaux XP & Bankroll virtuelle de départ (10 000 🪙)
   - Bonus quotidien de 7 jours consécutifs (500 🪙 à 5 000 🪙)
   - Secours Bankroll (1 000 🪙 si solde à 0)
   - 14+ Succès débloquables & Défis quotidiens
   - Séries de victoires (🔥 Win Streak) & défaites (❄️ Lose Streak)

3. **Académie & Analyse Stratégique :**
   - Analyse instantanée post-partie (décision vs Stratégie de base)
   - Quiz interactif de révision et cours sur les règles

---

## 📁 STRUCTURE DU PROJET

```text
blackjack/
├── client/          # Frontend React Vite Tailwind
│   ├── src/
│   │   ├── components/ # Composants UI (Table, Cartes, Modales)
│   │   ├── pages/      # Pages (Table, Profil, Stats, History, Learn, etc.)
│   │   ├── stores/     # State management Zustand
│   │   ├── utils/      # Syntétiseur audio Web Audio API, i18n
│   │   └── styles/     # Design system CSS & Tailwind
│   └── public/      # Manifest PWA & Favicon SVG
├── server/          # Backend Express TypeScript
│   ├── src/
│   │   ├── blackjack/  # Moteur Blackjack pur & indépendant
│   │   ├── services/   # Logique métier & Ledger financier
│   │   ├── routes/     # Routes API REST
│   │   └── database/   # Client Prisma SQLite
│   └── tests/          # Tests Vitest & simulation 1 000 parties
├── prisma/          # Schéma de base de données
└── package.json     # Workspaces npm root
```

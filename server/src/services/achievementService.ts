import { prisma } from '../database/prisma';

export interface AchievementDef {
  code: string;
  name: string;
  description: string;
  category: 'WINS' | 'BLACKJACK' | 'STREAK' | 'GAMES' | 'SPLIT' | 'DOUBLE' | 'SPECIAL';
  targetValue: number;
  rewardXp: number;
  rewardCredits: number;
  icon: string;
}

export const INITIAL_ACHIEVEMENTS: AchievementDef[] = [
  { code: 'FIRST_WIN', name: 'Première Victoire', description: 'Gagnez votre première partie de Blackjack', category: 'WINS', targetValue: 1, rewardXp: 100, rewardCredits: 500, icon: 'trophy' },
  { code: 'WINS_10', name: 'Joueur Confirmé', description: 'Gagnez 10 parties', category: 'WINS', targetValue: 10, rewardXp: 300, rewardCredits: 1000, icon: 'award' },
  { code: 'WINS_100', name: 'Maître de la Table', description: 'Gagnez 100 parties', category: 'WINS', targetValue: 100, rewardXp: 2000, rewardCredits: 5000, icon: 'crown' },
  { code: 'FIRST_BJ', name: 'Premier Blackjack !', description: 'Obtenez un Blackjack naturel (A + 10)', category: 'BLACKJACK', targetValue: 1, rewardXp: 200, rewardCredits: 750, icon: 'zap' },
  { code: 'BJ_10', name: 'Roi du 21', description: 'Obtenez 10 Blackjacks', category: 'BLACKJACK', targetValue: 10, rewardXp: 800, rewardCredits: 2500, icon: 'star' },
  { code: 'BJ_100', name: 'Légende du 21', description: 'Obtenez 100 Blackjacks', category: 'BLACKJACK', targetValue: 100, rewardXp: 5000, rewardCredits: 15000, icon: 'flame' },
  { code: 'STREAK_5', name: 'En Veine !', description: 'Réalisez une série de 5 victoires consécutives', category: 'STREAK', targetValue: 5, rewardXp: 500, rewardCredits: 1500, icon: 'flame' },
  { code: 'STREAK_10', name: 'Inarrêtable !', description: 'Réalisez une série de 10 victoires consécutives', category: 'STREAK', targetValue: 10, rewardXp: 2000, rewardCredits: 5000, icon: 'shield' },
  { code: 'GAMES_100', name: 'Fidèle au Casino', description: 'Jouez 100 parties au total', category: 'GAMES', targetValue: 100, rewardXp: 1000, rewardCredits: 3000, icon: 'target' },
  { code: 'GAMES_1000', name: 'Vétéran', description: 'Jouez 1000 parties au total', category: 'GAMES', targetValue: 1000, rewardXp: 10000, rewardCredits: 30000, icon: 'medal' },
  { code: 'DOUBLE_WIN_1', name: 'Quitte ou Double', description: 'Réussissez un Double Down', category: 'DOUBLE', targetValue: 1, rewardXp: 250, rewardCredits: 750, icon: 'trending-up' },
  { code: 'DOUBLE_WIN_10', name: 'Audacieux', description: 'Réussissez 10 Doubles', category: 'DOUBLE', targetValue: 10, rewardXp: 1000, rewardCredits: 3000, icon: 'zap' },
  { code: 'SPLIT_WIN_1', name: 'Diviser pour Régner', description: 'Gagnez après avoir exécuté un Split', category: 'SPLIT', targetValue: 1, rewardXp: 300, rewardCredits: 1000, icon: 'git-branch' },
  { code: 'HIGH_ROLLER_BET', name: 'High Roller', description: 'Misez 1 000 crédits ou plus sur une seule partie', category: 'SPECIAL', targetValue: 1, rewardXp: 500, rewardCredits: 2000, icon: 'dollar-sign' },
];

export class AchievementService {
  static async seedAchievements() {
    for (const def of INITIAL_ACHIEVEMENTS) {
      await prisma.achievement.upsert({
        where: { code: def.code },
        update: def,
        create: def,
      });
    }
  }

  static async getUserAchievements(userId: string) {
    await AchievementService.seedAchievements();

    const all = await prisma.achievement.findMany();
    const userUnlocked = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
    });

    const unlockedMap = new Map(userUnlocked.map(ua => [ua.achievementId, ua]));

    return all.map(ach => {
      const userAch = unlockedMap.get(ach.id);
      return {
        ...ach,
        unlocked: !!userAch,
        unlockedAt: userAch?.unlockedAt || null,
        progress: userAch?.progress || 0,
      };
    });
  }

  static async checkAchievements(userId: string) {
    const stats = await prisma.statistics.findUnique({ where: { userId } });
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!stats || !profile) return [];

    const achievements = await prisma.achievement.findMany();
    const unlockedList = await prisma.userAchievement.findMany({ where: { userId } });
    const unlockedIds = new Set(unlockedList.map(u => u.achievementId));

    const newlyUnlocked: any[] = [];

    for (const ach of achievements) {
      if (unlockedIds.has(ach.id)) continue;

      let currentVal = 0;
      if (ach.code === 'FIRST_WIN' || ach.code === 'WINS_10' || ach.code === 'WINS_100') currentVal = stats.wins;
      else if (ach.code === 'FIRST_BJ' || ach.code === 'BJ_10' || ach.code === 'BJ_100') currentVal = stats.blackjacks;
      else if (ach.code === 'STREAK_5' || ach.code === 'STREAK_10') currentVal = profile.maxWinStreak;
      else if (ach.code === 'GAMES_100' || ach.code === 'GAMES_1000') currentVal = stats.gamesPlayed;
      else if (ach.code === 'DOUBLE_WIN_1' || ach.code === 'DOUBLE_WIN_10') currentVal = stats.successfulDoubles;

      if (currentVal >= ach.targetValue) {
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: ach.id,
            progress: currentVal,
          },
        });

        // Award rewards
        let newCredits = profile.credits + ach.rewardCredits;
        let newXp = profile.xp + ach.rewardXp;

        await prisma.profile.update({
          where: { userId },
          data: { credits: newCredits, xp: newXp },
        });

        await prisma.transaction.create({
          data: {
            userId,
            type: 'ACHIEVEMENT_REWARD',
            amount: ach.rewardCredits,
            balanceBefore: profile.credits,
            balanceAfter: newCredits,
          },
        });

        newlyUnlocked.push(ach);
      }
    }

    return newlyUnlocked;
  }
}

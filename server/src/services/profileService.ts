import { prisma } from '../database/prisma';

const DAILY_REWARDS = [500, 750, 1000, 1250, 1500, 2000, 5000];

export class ProfileService {
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        statistics: true,
      },
    });

    if (!user || !user.profile) {
      throw new Error('Profil introuvable');
    }

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isGuest: user.isGuest,
      },
      profile: user.profile,
      statistics: user.statistics,
    };
  }

  static async updateProfile(userId: string, data: { avatarUrl?: string }) {
    return prisma.profile.update({
      where: { userId },
      data,
    });
  }

  static async addXpAndCredits(userId: string, xpGained: number, creditsGained: number = 0) {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) return;

    let newXp = profile.xp + xpGained;
    let newCredits = profile.credits + creditsGained;
    let newLevel = profile.level;

    // Calculate level ups
    while (newXp >= ProfileService.getXpForLevel(newLevel + 1)) {
      newLevel++;
    }

    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        xp: newXp,
        level: newLevel,
        credits: newCredits,
      },
    });

    if (creditsGained !== 0) {
      await prisma.transaction.create({
        data: {
          userId,
          type: 'BONUS',
          amount: creditsGained,
          balanceBefore: profile.credits,
          balanceAfter: newCredits,
        },
      });
    }

    return updatedProfile;
  }

  static getXpForLevel(level: number): number {
    if (level <= 1) return 0;
    return Math.floor(100 * Math.pow(level, 1.5));
  }

  static async claimDailyReward(userId: string) {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Profil introuvable');

    const now = new Date();
    const lastClaim = profile.lastDailyClaim;

    if (lastClaim) {
      const diffHours = (now.getTime() - new Date(lastClaim).getTime()) / (1000 * 60 * 60);
      if (diffHours < 24) {
        const remainingHours = Math.ceil(24 - diffHours);
        throw new Error(`Récompense déjà récupérée. Revenez dans ${remainingHours}h.`);
      }
    }

    let consecutiveDays = profile.consecutiveDailyDays;
    if (lastClaim) {
      const diffHours = (now.getTime() - new Date(lastClaim).getTime()) / (1000 * 60 * 60);
      if (diffHours > 48) {
        // Reset streak if missed more than 48h
        consecutiveDays = 0;
      }
    }

    consecutiveDays = (consecutiveDays % 7) + 1;
    const rewardAmount = DAILY_REWARDS[consecutiveDays - 1];

    const balanceBefore = profile.credits;
    const balanceAfter = balanceBefore + rewardAmount;

    await prisma.$transaction([
      prisma.profile.update({
        where: { userId },
        data: {
          credits: balanceAfter,
          lastDailyClaim: now,
          consecutiveDailyDays: consecutiveDays,
        },
      }),
      prisma.dailyReward.create({
        data: {
          userId,
          dayStreak: consecutiveDays,
          amount: rewardAmount,
        },
      }),
      prisma.transaction.create({
        data: {
          userId,
          type: 'DAILY_REWARD',
          amount: rewardAmount,
          balanceBefore,
          balanceAfter,
        },
      }),
    ]);

    return {
      claimedAmount: rewardAmount,
      streak: consecutiveDays,
      newBalance: balanceAfter,
    };
  }

  static async claimFailsafeReward(userId: string) {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Profil introuvable');

    if (profile.credits > 0) {
      throw new Error('Le secours bankroll est disponible uniquement lorsque votre solde est à 0.');
    }

    const failsafeAmount = 1000;
    const balanceBefore = 0;
    const balanceAfter = failsafeAmount;

    await prisma.$transaction([
      prisma.profile.update({
        where: { userId },
        data: { credits: balanceAfter },
      }),
      prisma.transaction.create({
        data: {
          userId,
          type: 'FAILSAFE_REWARD',
          amount: failsafeAmount,
          balanceBefore,
          balanceAfter,
        },
      }),
    ]);

    return {
      claimedAmount: failsafeAmount,
      newBalance: balanceAfter,
    };
  }
}

import { prisma } from '../database/prisma';

export const TODAY_CHALLENGES = [
  { code: 'PLAY_5', title: 'Joueur régulier', description: 'Jouez 5 parties aujourd\'hui', targetType: 'PLAY_GAMES', targetAmount: 5, rewardCredits: 500, rewardXp: 150 },
  { code: 'WIN_3', title: 'Triplé gagnant', description: 'Gagnez 3 parties aujourd\'hui', targetType: 'WIN_GAMES', targetAmount: 3, rewardCredits: 800, rewardXp: 200 },
  { code: 'BJ_1', title: 'Touche de magie', description: 'Obtenez 1 Blackjack naturel', targetType: 'GET_BLACKJACK', targetAmount: 1, rewardCredits: 1000, rewardXp: 300 },
  { code: 'DOUBLE_1', title: 'Coup d\'audace', description: 'Réussissez 1 Double Down', targetType: 'SUCCESSFUL_DOUBLE', targetAmount: 1, rewardCredits: 750, rewardXp: 200 },
];

export class ChallengeService {
  static async getDailyChallenges(userId: string) {
    const todayStr = new Date().toISOString().split('T')[0];

    for (const ch of TODAY_CHALLENGES) {
      await prisma.dailyChallenge.upsert({
        where: { code: ch.code },
        update: { ...ch, date: todayStr },
        create: { ...ch, date: todayStr },
      });
    }

    const challenges = await prisma.dailyChallenge.findMany({
      where: { date: todayStr },
    });

    const userChallenges = await prisma.userChallenge.findMany({
      where: { userId, challenge: { date: todayStr } },
      include: { challenge: true },
    });

    const userMap = new Map(userChallenges.map(uc => [uc.challengeId, uc]));

    return challenges.map(ch => {
      const uc = userMap.get(ch.id);
      return {
        id: ch.id,
        code: ch.code,
        title: ch.title,
        description: ch.description,
        targetAmount: ch.targetAmount,
        rewardCredits: ch.rewardCredits,
        rewardXp: ch.rewardXp,
        progress: uc?.progress || 0,
        completed: uc?.completed || false,
        claimed: uc?.claimed || false,
      };
    });
  }

  static async updateChallengeProgress(userId: string, eventType: string, amount: number = 1) {
    const todayStr = new Date().toISOString().split('T')[0];
    const challenges = await prisma.dailyChallenge.findMany({
      where: { date: todayStr, targetType: eventType },
    });

    for (const ch of challenges) {
      const existing = await prisma.userChallenge.findUnique({
        where: { userId_challengeId: { userId, challengeId: ch.id } },
      });

      const currentProgress = (existing?.progress || 0) + amount;
      const completed = currentProgress >= ch.targetAmount;

      await prisma.userChallenge.upsert({
        where: { userId_challengeId: { userId, challengeId: ch.id } },
        update: {
          progress: currentProgress,
          completed,
        },
        create: {
          userId,
          challengeId: ch.id,
          progress: currentProgress,
          completed,
        },
      });
    }
  }

  static async claimReward(userId: string, challengeId: string) {
    const userChallenge = await prisma.userChallenge.findUnique({
      where: { userId_challengeId: { userId, challengeId } },
      include: { challenge: true },
    });

    if (!userChallenge || !userChallenge.completed) {
      throw new Error('Défi non complété');
    }
    if (userChallenge.claimed) {
      throw new Error('Récompense déjà réclamée');
    }

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Profil introuvable');

    const newCredits = profile.credits + userChallenge.challenge.rewardCredits;
    const newXp = profile.xp + userChallenge.challenge.rewardXp;

    let newLevel = profile.level;
    while (newXp >= Math.floor(100 * Math.pow(newLevel + 1, 1.5))) {
      newLevel++;
    }

    await prisma.$transaction([
      prisma.userChallenge.update({
        where: { id: userChallenge.id },
        data: { claimed: true },
      }),
      prisma.profile.update({
        where: { userId },
        data: { credits: newCredits, xp: newXp, level: newLevel },
      }),
      prisma.transaction.create({
        data: {
          userId,
          type: 'CHALLENGE_REWARD',
          amount: userChallenge.challenge.rewardCredits,
          balanceBefore: profile.credits,
          balanceAfter: newCredits,
        },
      }),
    ]);

    return {
      rewardCredits: userChallenge.challenge.rewardCredits,
      rewardXp: userChallenge.challenge.rewardXp,
      newBalance: newCredits,
    };
  }
}

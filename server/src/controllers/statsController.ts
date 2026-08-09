import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { prisma } from '../database/prisma';

export class StatsController {
  static async getStats(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const stats = await prisma.statistics.findUnique({ where: { userId } });
      const profile = await prisma.profile.findUnique({ where: { userId } });

      if (!stats || !profile) {
        return res.status(404).json({ error: 'Statistiques introuvables' });
      }

      const winRate = stats.gamesPlayed > 0 ? ((stats.wins / stats.gamesPlayed) * 100).toFixed(1) : '0.0';
      const bjRate = stats.gamesPlayed > 0 ? ((stats.blackjacks / stats.gamesPlayed) * 100).toFixed(1) : '0.0';
      const avgProfit = stats.gamesPlayed > 0 ? (stats.netProfit / stats.gamesPlayed).toFixed(1) : '0.0';

      return res.json({
        ...stats,
        winStreak: profile.winStreak,
        loseStreak: profile.loseStreak,
        maxWinStreak: profile.maxWinStreak,
        maxLoseStreak: profile.maxLoseStreak,
        winRate: parseFloat(winRate),
        bjRate: parseFloat(bjRate),
        avgProfit: parseFloat(avgProfit),
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async getLeaderboard(req: AuthenticatedRequest, res: Response) {
    try {
      const topProfiles = await prisma.profile.findMany({
        take: 20,
        orderBy: { credits: 'desc' },
        include: {
          user: { include: { statistics: true } },
        },
      });

      return res.json(topProfiles);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}

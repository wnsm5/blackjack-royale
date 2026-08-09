import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { AchievementService } from '../services/achievementService';

export class AchievementController {
  static async getAchievements(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const achievements = await AchievementService.getUserAchievements(userId);
      return res.json(achievements);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}

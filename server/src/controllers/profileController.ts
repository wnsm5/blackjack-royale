import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { ProfileService } from '../services/profileService';

export class ProfileController {
  static async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const data = await ProfileService.getProfile(userId);
      return res.json(data);
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { avatarUrl } = req.body;
      const updated = await ProfileService.updateProfile(userId, { avatarUrl });
      return res.json(updated);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  static async claimDaily(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const result = await ProfileService.claimDailyReward(userId);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  static async claimFailsafe(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const result = await ProfileService.claimFailsafeReward(userId);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}

import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { ChallengeService } from '../services/challengeService';

export class ChallengeController {
  static async getChallenges(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const challenges = await ChallengeService.getDailyChallenges(userId);
      return res.json(challenges);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async claimReward(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { challengeId } = req.body;
      const result = await ChallengeService.claimReward(userId, challengeId);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}

import { Router } from 'express';
import { ChallengeController } from '../controllers/challengeController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', ChallengeController.getChallenges);
router.post('/claim', ChallengeController.claimReward);

export default router;

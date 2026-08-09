import { Router } from 'express';
import { AchievementController } from '../controllers/achievementController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', AchievementController.getAchievements);

export default router;

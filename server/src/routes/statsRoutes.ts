import { Router } from 'express';
import { StatsController } from '../controllers/statsController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', StatsController.getStats);
router.get('/leaderboard', StatsController.getLeaderboard);

export default router;

import { Router } from 'express';
import authRoutes from './authRoutes';
import gameRoutes from './gameRoutes';
import profileRoutes from './profileRoutes';
import statsRoutes from './statsRoutes';
import achievementRoutes from './achievementRoutes';
import challengeRoutes from './challengeRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/game', gameRoutes);
router.use('/profile', profileRoutes);
router.use('/stats', statsRoutes);
router.use('/achievements', achievementRoutes);
router.use('/challenges', challengeRoutes);

export default router;

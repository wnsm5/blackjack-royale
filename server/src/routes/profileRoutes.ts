import { Router } from 'express';
import { ProfileController } from '../controllers/profileController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', ProfileController.getProfile);
router.patch('/', ProfileController.updateProfile);
router.post('/daily-reward', ProfileController.claimDaily);
router.post('/failsafe-reward', ProfileController.claimFailsafe);

export default router;

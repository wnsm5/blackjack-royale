import { Router } from 'express';
import { GameController } from '../controllers/gameController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/create', GameController.create);
router.post('/hit', GameController.hit);
router.post('/stand', GameController.stand);
router.post('/double', GameController.double);
router.post('/split', GameController.split);
router.post('/surrender', GameController.surrender);
router.post('/insurance', GameController.insurance);

router.get('/', GameController.getHistory);
router.get('/:id', GameController.getDetails);

export default router;

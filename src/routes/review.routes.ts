import { Router } from 'express';

import { AuthMiddleware } from '../api/auth/auth.middleware';
import { ReviewController } from '../controllers/review.controller';

const router = Router();

router.post('/', AuthMiddleware.requireAuth, ReviewController.createReview);
router.put('/:id', AuthMiddleware.requireAuth, ReviewController.updateReview);
router.delete('/:id', AuthMiddleware.requireAuth, ReviewController.deleteReview);

export default router;

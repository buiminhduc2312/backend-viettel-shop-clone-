import { Router } from 'express';

import { StatisticsController } from '../controllers/statistics.controller';

const router = Router();

router.get('/overview', StatisticsController.getOverview);
router.get('/top-rated', StatisticsController.getTopRatedProducts);
router.get('/top-wishlist', StatisticsController.getTopWishlistProducts);

export default router;

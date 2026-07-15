import express, { Request, Response } from 'express';
import userRoutes from './user/user.route';
import { authRoutes } from './auth/auth.route';
import productRoutes from '../routes/product.routes';
import orderRoutes from '../routes/order.routes';
import wishlistRoutes from '../routes/wishlist.routes';
import reviewRoutes from '../routes/review.routes';
import statisticsRoutes from '../routes/statistics.routes';
import { AuthMiddleware } from './auth/auth.middleware';

const router = express.Router();

/**
 * GET /status
 */
router.get('/status', (req: Request, res: Response) => res.send('OK'));

router.use('/users', userRoutes);
router.use('/products', productRoutes); // API Product
router.use('/orders', AuthMiddleware.requireAuth, orderRoutes); // API Order
router.use('/wishlist', AuthMiddleware.requireAuth, wishlistRoutes);
router.use('/reviews', reviewRoutes);
router.use('/admin/statistics', AuthMiddleware.requireAuth, AuthMiddleware.requireAdmin, statisticsRoutes);

// API Auth
router.use('/auth', authRoutes);

export default router;

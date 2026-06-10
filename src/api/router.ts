import express, { Request, Response } from 'express';
import userRoutes from './user/user.route';
import productRoutes from './product/product.route';

const router = express.Router();

/**
 * GET /status
 */
router.get('/status', (req: Request, res: Response) => res.send('OK'));

router.use('/users', userRoutes);

router.use('/products', productRoutes);

export default router;

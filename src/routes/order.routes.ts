import { Router } from 'express';

import { AuthMiddleware } from '../api/auth/auth.middleware';
import { OrderController } from '../controllers/order.controller';

const router = Router();

router.post('/', OrderController.createOrder);
router.get('/', OrderController.getOrdersByUser);
router.get('/admin/all', AuthMiddleware.requireAdmin, OrderController.getAllOrders);
router.get('/:id', OrderController.getOrderById);
router.patch('/:id/status', AuthMiddleware.requireAdmin, OrderController.updateOrderStatus);

export default router;

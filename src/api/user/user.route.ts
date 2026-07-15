import { Router } from 'express';
import { UserController } from './user.controller';
import { validate } from 'express-validation';
import { AuthMiddleware } from '../auth/auth.middleware';
import * as UserValidator from './user.validator';

const router = Router();

// --- CÁC ĐƯỜNG DẪN XỬ LÝ AUTHENTICATION ---

// Đường dẫn: POST /api/user/register
router.post('/register', UserController.register);

// Đường dẫn: POST /api/user/login
router.post('/login', UserController.login);

router.get('/me', AuthMiddleware.requireAuth, UserController.getMe);
router.put('/profile', AuthMiddleware.requireAuth, validate(UserValidator.updateProfile, {}, {}), UserController.updateProfile);
router.get('/cart', AuthMiddleware.requireAuth, UserController.getCart);
router.put('/cart', AuthMiddleware.requireAuth, UserController.updateCart);
router.post('/logout', AuthMiddleware.requireAuth, UserController.logout);

export default router;

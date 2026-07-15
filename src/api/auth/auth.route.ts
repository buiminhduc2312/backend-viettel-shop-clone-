import express from 'express';
import rateLimit from 'express-rate-limit';
import { AuthController } from './auth.controller';
import { UserController } from '../user/user.controller';

const router = express.Router();

// Hỗ trợ cả URL auth chuẩn và URL users cũ để không làm hỏng client sau refactor.
router.post('/login', UserController.login);
router.post('/register', UserController.register);

//  chống Spam (Rate Limit)
const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 5 phút
    max: 5, // Tối đa 5 lần
    message: { success: false, message: 'Bạn đã yêu cầu gửi mã quá nhiều lần. Vui lòng thử lại sau 5 phút.' },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/forgot-password', forgotPasswordLimiter, AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

export { router as authRoutes };

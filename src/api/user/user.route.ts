import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();

// --- CÁC ĐƯỜNG DẪN XỬ LÝ AUTHENTICATION ---

// Đường dẫn: POST /api/user/register
router.post('/register', UserController.register);

// Đường dẫn: POST /api/user/login
router.post('/login', UserController.login);

export default router;

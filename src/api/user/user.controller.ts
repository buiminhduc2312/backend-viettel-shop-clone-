import { Request, Response } from 'express';
import { UserBiz } from '../../biz/user/user.biz';

export class UserController {
    // 1. ĐĂNG KÝ
    public static async register(req: Request, res: Response) {
        try {
            const user = await UserBiz.registerPostgres(req.body);
            res.status(201).json({
                success: true,
                message: 'Đăng ký thành công!',
                data: user,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || 'Đăng ký thất bại',
            });
        }
    }

    // 2. ĐĂNG NHẬP (Cấp Token)
    public static async login(req: Request, res: Response) {
        try {
            // Gọi hàm loginPostgres từ UserBiz đã viết lúc nãy
            const result = await UserBiz.loginPostgres(req.body);

            res.status(200).json({
                success: true,
                message: 'Đăng nhập thành công!',
                token: result.token, // Gửi Token về cho React
                user: result.user,
            });
        } catch (error: any) {
            res.status(401).json({
                success: false,
                message: error.message || 'Sai thông tin đăng nhập',
            });
        }
    }
}

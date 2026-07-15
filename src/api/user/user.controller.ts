import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { UserBiz } from '../../biz/user/user.biz';
import { BlacklistModel } from '../../biz/user/blacklist.model';
import { UserRepo } from '../../biz/user/user.repo';

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
            // Gọi hàm loginPostgres từ UserBiz
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
    public static async getMe(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.userId;
            const user = await UserBiz.getUserById(userId as string);
            if (!user) {
                return res.status(httpStatus.UNAUTHORIZED).json({
                    success: false,
                    message: 'nguoi dung khong ton tai',
                });
            }
            res.status(httpStatus.OK).json({
                success: true,
                user,
            });
        } catch (error) {
            next(error);
        }
    }

    public static async getCart(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.userId as string;
            const cart = await UserBiz.getCart(userId);
            res.status(httpStatus.OK).json({ success: true, cart });
        } catch (error) {
            next(error);
        }
    }

    public static async updateCart(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.userId as string;
            const { cartItems } = req.body;
            const cart = await UserBiz.updateCart(userId, cartItems);
            res.status(httpStatus.OK).json({ success: true, cart });
        } catch (error) {
            next(error);
        }
    }

    public static async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];
            if (token) {
                await BlacklistModel.create({ token });
            }
            return res.status(200).json({
                success: true,
                message: 'Dang xuat thanh cong va da luu token vao Blacklist!',
            });
        } catch (error) {
            next(error);
        }
    }

    public static async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.userId as string;
            const { fullName, phone, avatar } = req.body;
            const updatedUser = await UserRepo.updateProfile(userId, { fullName, phone, avatar });

            if (!updatedUser) {
                return res.status(httpStatus.NOT_FOUND).json({
                    success: false,
                    message: 'Khong tim thay nguoi dung!',
                });
            }

            res.status(httpStatus.OK).json({
                success: true,
                message: 'Cap nhat profile thanh cong!',
                data: updatedUser,
            });
        } catch (error) {
            next(error);
        }
    }
}

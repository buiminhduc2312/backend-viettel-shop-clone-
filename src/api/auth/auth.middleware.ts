import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { isValidObjectId } from 'mongoose';
import jwt from 'jsonwebtoken';

import { APIError } from '@common/error/api.error';
import { UNAUTHORIZED } from '@common/message.response';
import { ErrorCode } from '@config/errors';

import { BlacklistModel } from '../../biz/user/blacklist.model';

declare module 'express-serve-static-core' {
    interface Request {
        userId?: string;
        userRole?: string;
    }
}

export class AuthMiddleware {
    public static async requireAuth(req: Request, res: Response, next: NextFunction) { // yêu cầu có token hợp lệ mới đi tiếp 
        try {
            // Lấy token xác thực từ header của yêu cầu.
            const authHeader = req.headers.authorization;
            const token: string = (authHeader && authHeader.split(' ')[1]) as string; // tách chuỗi và lấy phần tử thứ 2 là token 

            if (!token) {
                throw new APIError({
                    message: UNAUTHORIZED,
                    status: httpStatus.UNAUTHORIZED,
                    errorCode: ErrorCode.REQUEST_UNAUTHORIZED,
                });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { 
                id?: string;
                role?: string;
                jti?: string;
            };

            if (!decoded || !decoded.id) {
                throw new APIError({
                    message: UNAUTHORIZED,
                    status: httpStatus.UNAUTHORIZED,
                    errorCode: ErrorCode.REQUEST_UNAUTHORIZED,
                });
            }

            const isBlacklisted = await BlacklistModel.findOne({ token });
            if (isBlacklisted) {
                throw new APIError({
                    message: 'Token da bi vo hieu hoa do dang xuat! Vui long dang nhap lai.',
                    status: httpStatus.UNAUTHORIZED,
                    errorCode: ErrorCode.REQUEST_UNAUTHORIZED,
                });
            }

            const isValidId = isValidObjectId(decoded.id);
            if (!isValidId) {
                throw new APIError({
                    message: UNAUTHORIZED,
                    status: httpStatus.UNAUTHORIZED,
                    errorCode: ErrorCode.REQUEST_UNAUTHORIZED,
                });
            }

            req.userId = decoded.id;
            req.userRole = decoded.role;

            next();
        } catch (error) {
            next(error);
        }
    }

    public static async optionalAuth(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next();
        }

        return AuthMiddleware.requireAuth(req, res, next);
    }

    public static async requireAdmin(req: Request, res: Response, next: NextFunction) {
        if (req.userRole === 'admin' || req.userRole === 'root') {
            return next();
        }

        return res.status(httpStatus.FORBIDDEN).json({
            success: false,
            message: 'Ban khong co quyen truy cap tai nguyen nay!',
        });
    }
}

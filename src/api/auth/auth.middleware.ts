import { Request, Response, NextFunction } from 'express';
import { APIError } from '@common/error/api.error';
import { ErrorCode } from '@config/errors';
import httpStatus from 'http-status';
import { UNAUTHORIZED } from '@common/message.response';
import { isValidObjectId } from 'mongoose';
import { Jwt } from '@common/jwt';
import { IVerifyTokenPayLoad } from './auth.type';

export class AuthMiddleware {
    public static async requireAuth(req: Request, res: Response, next: NextFunction) {
        try {
            const authHeader = req.headers.authorization;
            const token: string = (authHeader && authHeader.split(' ')[1]) as string;
            if (!token) {
                throw new APIError({
                    message: UNAUTHORIZED,
                    status: httpStatus.UNAUTHORIZED,
                    errorCode: ErrorCode.REQUEST_UNAUTHORIZED,
                });
            }

            // Verify token
            const decoded = await Jwt.verify<IVerifyTokenPayLoad>(token);
            if (!decoded.payload) {
                throw new APIError({
                    message: UNAUTHORIZED,
                    status: httpStatus.UNAUTHORIZED,
                    errorCode: ErrorCode.REQUEST_UNAUTHORIZED,
                });
            }

            const isValidId = isValidObjectId(decoded.payload.id);
            if (!isValidId) {
                throw new APIError({
                    message: UNAUTHORIZED,
                    status: httpStatus.UNAUTHORIZED,
                    errorCode: ErrorCode.REQUEST_UNAUTHORIZED,
                });
            }

            req.userId = decoded.payload.id;

            // process auth
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

        AuthMiddleware.requireAuth(req, res, next);
    }
}

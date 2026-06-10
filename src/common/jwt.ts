import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@config/environment';
import dayjs from 'dayjs';
import { CustomError } from './error/custom.error';
import { ITokenResponse } from '@api/auth/auth.type';

interface IDecodedToken<T> {
    data: T;
}
interface IVerify<T> {
    payload: T | null;
    error: Error | null;
}
export class Jwt {
    public static async sign<T>(payload: T, type: string, expiresIn?: number): Promise<ITokenResponse> {
        try {
            const expiresTime = expiresIn ?? undefined;
            const result = {
                tokenType: type,
                accessToken: await jwt.sign(
                    {
                        data: payload,
                    },
                    JWT_SECRET,
                    expiresTime ? { expiresIn: expiresTime } : undefined,
                ),
                iat: dayjs().unix(),
                exp: expiresTime ? dayjs().add(expiresTime, 'seconds').unix() : undefined,
            };
            return result;
        } catch (error) {
            throw CustomError.CustomMessage(error.message);
        }
    }

    public static async verify<T>(token: string): Promise<IVerify<T>> {
        try {
            const decoded: IDecodedToken<T> = (await jwt.verify(token, JWT_SECRET)) as IDecodedToken<T>;
            const payload: T = decoded.data as T;
            return {
                payload,
                error: null,
            };
        } catch (error) {
            return {
                payload: null,
                error,
            };
        }
    }
}

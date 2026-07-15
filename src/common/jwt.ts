import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@config/environment';
import dayjs from 'dayjs';
import { CustomError } from './error/custom.error';
import { ITokenResponse } from '@api/auth/auth.type';

interface IDecodedToken<T> {  // Token giải mã sẽ có cấu trúc như thế này
    data: T;
}
interface IVerify<T> { // Kết quả trả về khi verify token
    payload: T | null;
    error: Error | null;
}
export class Jwt {
    public static async sign<T>(payload: T, type: string, expiresIn?: number): Promise<ITokenResponse> {
        try {
            const expiresTime = expiresIn ?? undefined; // kiểm tra cài đặt thời gian hết hạn, nếu không có thì để undefined
            const result = {
                tokenType: type,  
                accessToken: await jwt.sign(  // tạo mã chuỗi Token 
                    {
                        data: payload, // cho thông tin user vào data 
                    },
                    JWT_SECRET, 
                    expiresTime ? { expiresIn: expiresTime } : undefined, // cài đặt thời gian tự hết hạn 
                ),
                iat: dayjs().unix(),  // đánh dấu thời điểm tạo Token 
                exp: expiresTime ? dayjs().add(expiresTime, 'seconds').unix() : undefined, // đánh dấu thời điểm Token hết hạn 
            };
            return result;
        } catch (error) {
            throw CustomError.CustomMessage(error.message); // nếu có lỗi thì ném ra lỗi tùy chỉnh
        }
    }

    //  GIẢI MÃ TOKEN 
    
    // cho Token vào để dịch lại sang dữ liệu ban đầu 
    public static async verify<T>(token: string): Promise<IVerify<T>> {
        try {
            // dùng JWT_SECRET để giải mã Token, nếu thành công thì trả về payload, nếu thất bại thì trả về lỗi
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

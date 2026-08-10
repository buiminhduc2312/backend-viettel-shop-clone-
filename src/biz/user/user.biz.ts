import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import { UserModel } from './user.model'; // Gọi kho chứa MongoDB
import { CartModel } from './cart.model';
import { BlacklistModel } from './blacklist.model';
import { FULL_NAME_ERROR_MESSAGE, isValidFullName } from '../../utils/fullNameValidation';
import { JWT_SECRET } from '../../config/environment';

export class UserBiz {
    // =====================================
    // 1. HÀM ĐĂNG KÝ (Đã chuyển sang MongoDB)
    // =====================================
    public static async registerPostgres(userData: any) {
        // Giữ tên cũ để tránh ảnh hưởng đến các phần khác của ứng dụng, nhưng thực chất là đang dùng MongoDB.
        try {
            const rawFullName = String(
                userData.fullName || userData.name || [userData.firstName || userData.first_name, userData.lastName || userData.last_name].filter(Boolean).join(' '),
            ).trim();

            if (!isValidFullName(rawFullName)) {
                throw new Error(FULL_NAME_ERROR_MESSAGE);
            }

            const nameParts = rawFullName.split(/\s+/);
            const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : nameParts[0];
            const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

            // Kiểm tra email đã tồn tại chưa
            const existingUser = await UserModel.findOne({ email: userData.email });

            if (existingUser) {
                throw new Error('Email này đã được đăng ký!');
            }

            // Kiểm tra username
            const existingUsername = await UserModel.findOne({ username: userData.username || userData.email });

            if (existingUsername) {
                throw new Error('Tên đăng nhập này đã tồn tại!');
            }

            // Băm mật khẩu
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);

            // Tạo User mới, lưu thẳng vào MongoDB
            const newUser = new UserModel({
                email: userData.email,
                username: userData.username || userData.email,
                password: hashedPassword,
                first_name: firstName,
                last_name: lastName,
                phone: userData.phone || '',
                role: userData.role || 'user',
            });

            await newUser.save(); // Lệnh lưu của MongoDB

            // Ẩn password trước khi trả về
            const userObj = newUser.toObject();
            const { password: storedPassword, ...userWithoutPassword } = userObj;

            return userWithoutPassword;
        } catch (error: any) {
            console.error(' LỖI TỪ MONGODB:', error);
            throw new Error(error.message);
        }
    }

    // =====================================
    // 2. HÀM ĐĂNG NHẬP (Đã chuyển sang MongoDB)
    // =====================================
    public static async loginPostgres(credentials: any) {
        try {
            // Chuẩn hóa email giống nhau ở lúc đặt lại và lúc đăng nhập.
            const email = String(credentials?.email || '')
                .trim()
                .toLowerCase();
            const password = String(credentials?.password || '');

            if (!email || !password) {
                throw new Error('Tài khoản hoặc mật khẩu không chính xác!');
            }

            // 1. Tìm user theo email trong MongoDB
            const user = await UserModel.findOne({ email });

            if (!user) {
                throw new Error('Tài khoản hoặc mật khẩu không chính xác!');
            }

            // 2. So sánh mật khẩu
            // So sánh mật khẩu thô với chuỗi đã băm bằng cùng thư viện bcryptjs.
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                throw new Error('Tài khoản hoặc mật khẩu không chính xác!');
            }

            // 3. Tạo Token
            const token = jwt.sign(
                { id: user._id, email: user.email, role: user.role, jti: randomUUID() }, // MongoDB dùng _id
                // Dùng cùng cấu hình JWT với toàn bộ ứng dụng để token luôn xác thực được.
                JWT_SECRET,
                { expiresIn: '7d' },
            );

            // 4. Bóc tách dữ liệu, bỏ password đi
            const userObj = user.toObject();
            const { password: storedPassword, ...userWithoutPassword } = userObj;

            return {
                token,
                user: userWithoutPassword,
            };
        } catch (error: any) {
            console.error(' LỖI ĐĂNG NHẬP MONGODB:', error);
            throw new Error(error.message);
        }
    }

    public static async resetPassword(email: string, newPassword: string) {
        const normalizedEmail = String(email || '')
            .trim()
            .toLowerCase();
        const user = await UserModel.findOne({ email: normalizedEmail });

        if (!user) {
            throw new Error('Tài khoản không tồn tại!');
        }

        // Luôn băm mật khẩu mới trước khi lưu vào MongoDB.
        user.password = await bcrypt.hash(String(newPassword), 10);
        await user.save();
    }

    public static async postRegister(userData: any) {
        return null;
    }

    public static async getUserById(userId: string) {
        try {
            const user = await UserModel.findById(userId);

            if (!user) {
                throw new Error('Khong tim thay nguoi dung!');
            }

            const userObj = user.toObject();
            const { password, ...userWithoutPassword } = userObj;

            return userWithoutPassword;
        } catch (error: any) {
            console.error('LOI LAY USER MONGODB:', error);
            throw new Error(error.message);
        }
    }

    public static async getCart(userId: string) {
        const cart = await CartModel.findOne({ userId });

        return cart ? cart.items : [];
    }

    public static async updateCart(userId: string, cartItems: any[]) {
        const cart = await CartModel.findOneAndUpdate(
            { userId },
            { items: cartItems },
            {
                new: true,
                upsert: true,
            },
        );
        return cart ? cart.items : [];
    }

    public static async logout(token: string) {
        try {
            const blacklistedToken = new BlacklistModel({ token });
            await blacklistedToken.save();
            return true;
        } catch (error: any) {
            if (error.code === 11000) return true;
            throw new Error('Loi khi dang xuat!');
        }
    }
}

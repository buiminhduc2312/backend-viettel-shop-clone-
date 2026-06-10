import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from './user.model'; // Gọi kho chứa MongoDB vừa tạo ở trên

export class UserBiz {
    // =====================================
    // 1. HÀM ĐĂNG KÝ (Đã chuyển sang MongoDB)
    // =====================================
    public static async registerPostgres(userData: any) {
        // Giữ tên cũ để Controller khỏi giật mình
        try {
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
                first_name: userData.firstName || userData.first_name || '',
                last_name: userData.lastName || userData.last_name || '',
                phone: userData.phone || '',
                role: userData.role || 'user',
            });

            await newUser.save(); // Lệnh lưu của MongoDB

            // Ẩn password trước khi trả về
            const userObj = newUser.toObject();
            const { password, ...userWithoutPassword } = userObj;

            return userWithoutPassword;
        } catch (error: any) {
            console.error('🚨 LỖI TỪ MONGODB:', error);
            throw new Error(error.message);
        }
    }

    // =====================================
    // 2. HÀM ĐĂNG NHẬP (Đã chuyển sang MongoDB)
    // =====================================
    public static async loginPostgres(credentials: any) {
        try {
            // 1. Tìm user theo email trong MongoDB
            const user = await UserModel.findOne({ email: credentials.email });

            if (!user) {
                throw new Error('Tài khoản hoặc mật khẩu không chính xác!');
            }

            // 2. So sánh mật khẩu
            const isMatch = await bcrypt.compare(credentials.password, user.password);

            if (!isMatch) {
                throw new Error('Tài khoản hoặc mật khẩu không chính xác!');
            }

            // 3. Tạo Token
            const token = jwt.sign(
                { id: user._id, email: user.email, role: user.role }, // MongoDB dùng _id
                'BI_MAT_CUA_DUC_123',
                { expiresIn: '7d' },
            );

            // 4. Bóc tách dữ liệu, bỏ password đi
            const userObj = user.toObject();
            const { password, ...userWithoutPassword } = userObj;

            return {
                token,
                user: userWithoutPassword,
            };
        } catch (error: any) {
            console.error('🚨 LỖI ĐĂNG NHẬP MONGODB:', error);
            throw new Error(error.message);
        }
    }

    public static async postRegister(userData: any) {
        return null;
    }
}

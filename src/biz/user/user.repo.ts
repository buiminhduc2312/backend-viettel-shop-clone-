import USER, { IUserDocument } from './User';
import { IUser } from './user.type';

export class UserRepo {
    static async getByEmail(email: string): Promise<IUserDocument | null> {
        return USER.findOne({ email });
    }

    static async create(userModel: IUser): Promise<IUserDocument> {
        return USER.create(userModel);
    }

    // ==========================================
    //  User Profile
    // ==========================================

    // 1. Tìm user bằng ID và ẩn đi trường mật khẩu
    static async findById(userId: string): Promise<IUserDocument | null> {
        return USER.findById(userId).select('-password');
    }

    // 2. Cập nhật Profile
    static async updateProfile(userId: string, updateData: { fullName?: string; phone?: string; avatar?: string }): Promise<IUserDocument | null> { // cập nhật thông tin người dùng, trả về bản ghi sau khi update
        const fullName = updateData.fullName?.trim(); 
        const nameParts = fullName ? fullName.split(/\s+/) : [];
        const firstName = nameParts.length > 0 ? nameParts.slice(0, -1).join(' ') || nameParts[0] : undefined;
        const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : nameParts.length === 1 ? '' : undefined;
        const payload: Record<string, string> = {}; // tạo 1 object rỗng để chứa các trường cần update

        if (updateData.phone !== undefined) { // nếu có trường phone trong updateData thì gán vào payload
            payload.phone = updateData.phone;
        }

        if (updateData.avatar !== undefined) { // nếu có trường avatar trong updateData thì gán vào payload
            payload.avatar = updateData.avatar;
        }

        if (fullName !== undefined) { // nếu có trường fullName trong updateData thì gán vào payload
            payload.first_name = firstName ?? '';
            payload.last_name = lastName ?? '';
        }

        return USER.findByIdAndUpdate( // tìm user theo userId và update các trường trong payload
            userId,
            { $set: payload },
            // new: true -> trả về bản ghi sau khi update
            // runValidators: true -> bắt Mongoose chạy lại các ràng buộc trong Schema
            { new: true, runValidators: true },
        ).select('-password');
    }
}

import mongoose, { Schema, Document } from 'mongoose';
import { Model } from 'sequelize';

export interface IUser extends Document {
    email: string;
    username: string;
    password: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    avatar?: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        first_name: { type: String, default: '' },
        last_name: { type: String, default: '' },
        phone: { type: String, default: '' },
        avatar: { type: String, default: '' },
        role: { type: String, default: 'user' }, // Mặc định ai đăng ký cũng là user
    },
    {
        timestamps: true, // Tự động tạo 2 cột createdAt và updatedAt
        versionKey: false,
    },
);

// Tạo Model để sử dụng trong DB
export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const UserPostgres = Model;

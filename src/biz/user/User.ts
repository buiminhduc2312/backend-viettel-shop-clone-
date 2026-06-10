import { ITimestamp } from '@common/timestamp.interface';
import mongoose, { Schema, Document } from 'mongoose';
import { IUser, EUserRole, EUserStatus } from './user.type';
import mongoosePagination from '@common/plugins/pagination';
import { PaginationModel } from '@common/plugins/pagination/pagination.type';

export interface IUserDocument extends IUser, Document, ITimestamp {
    _id: mongoose.Types.ObjectId;
}

const UserSchema: Schema<IUserDocument, unknown, IUser> = new Schema(
    {
        email: { type: String, trim: true, required: true },
        username: { type: String, trim: true, required: true },
        password: { type: String, trim: true, required: true },
        first_name: { type: String, trim: true },
        last_name: { type: String, trim: true },
        phone: { type: String, trim: true },
        role: { type: String, enum: EUserRole, default: EUserRole.USER },
        status: { type: String, enum: EUserStatus, default: EUserStatus.ACTIVE },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
        collection: 'users',
    },
);

UserSchema.plugin(mongoosePagination);

// Export the model and return your User interface
const User: PaginationModel<IUserDocument> = mongoose.model<IUserDocument, PaginationModel<IUserDocument>>('User', UserSchema);

export default User;

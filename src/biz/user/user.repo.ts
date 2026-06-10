import USER, { IUserDocument } from './User';
import { IUser } from './user.type';

export class UserRepo {
    static async getByEmail(email: string): Promise<IUserDocument | null> {
        return USER.findOne({ email });
    }

    static async create(userModel: IUser): Promise<IUserDocument> {
        return USER.create(userModel);
    }
}

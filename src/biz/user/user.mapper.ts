import { IResigterBody, IUser, EUserRole, EUserStatus, IUserResponse } from './user.type';
import { IUserDocument } from './User';

export class UserMapper {
    // MongoDB methods
    public static fromBodyToSchema(status: EUserStatus, role: EUserRole, postBody: IResigterBody): IUser {
        return {
            email: postBody.email,
            phone: postBody.phone,
            username: postBody.username,
            password: postBody.password,
            first_name: postBody.first_name,
            last_name: postBody.last_name,
            role,
            status,
        };
    }

    public static toUserResponse(post: IUserDocument): IUserResponse {
        return {
            email: post.email,
            phone: post.phone,
            username: post.username,
            first_name: post.first_name,
            last_name: post.last_name,
            role: post.role,
            status: post.status,
            password: post.password,
            id: post._id.toHexString(),
        };
    }
}

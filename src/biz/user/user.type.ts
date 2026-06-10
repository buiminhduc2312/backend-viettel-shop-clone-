export enum EUserRole {
    ADMIN = 'admin',
    USER = 'user',
    ROOT = 'root',
}

export enum EUserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export interface IResigterBody {
    email: string;
    phone: string;
    username: string;
    password: string;
    first_name: string;
    last_name: string;
}

export interface ILoginBody {
    username: string;
    password: string;
}

export interface IUser extends IResigterBody {
    role: EUserRole;
    status: EUserStatus;
}

export interface IUserResponse extends IUser {
    id: string;
}

// =====================================
// PostgreSQL Types
// =====================================
export interface IRegisterBody {
    email: string;
    phone?: string;
    username: string;
    password: string;
    first_name?: string;
    last_name?: string;
}

export interface ILoginBodyPostgres {
    username?: string;
    email?: string;
    password: string;
}

export interface IUserPostgres extends IRegisterBody {
    role?: string;
}

export interface IUserResponsePostgres extends IUserPostgres {
    id: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IAuthResponse {
    user: IUserResponsePostgres;
    token: any;
}

export interface IUpdateProfileBody {
    email?: string;
    phone?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    password?: string;
}

import { IRegisterBody, IUserPostgres } from './user.type';

type UserPostgresRecord = IUserPostgres & {
    id: number;
    createdAt: Date;
    updatedAt: Date;
};

const notConfigured = () => {
    throw new Error('UserPostgresRepo is not configured in this project.');
};

export class UserPostgresRepo {
    public static async create(_userData: IRegisterBody): Promise<UserPostgresRecord> {
        return notConfigured();
    }

    public static async findById(_id: number): Promise<UserPostgresRecord | null> {
        return notConfigured();
    }

    public static async findByEmail(_email: string): Promise<UserPostgresRecord | null> {
        return notConfigured();
    }

    public static async findByUsername(_username: string): Promise<UserPostgresRecord | null> {
        return notConfigured();
    }

    public static async findWithPagination(
        _page = 1,
        _limit = 10,
        _filter?: { isActive?: boolean }
    ): Promise<{ users: UserPostgresRecord[]; total: number }> {
        return notConfigured();
    }

    public static async emailExists(_email: string, _excludeId?: number): Promise<boolean> {
        return notConfigured();
    }

    public static async usernameExists(_username: string, _excludeId?: number): Promise<boolean> {
        return notConfigured();
    }

    public static async countAll(): Promise<number> {
        return notConfigured();
    }
}

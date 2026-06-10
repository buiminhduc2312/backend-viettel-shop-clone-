import { UserPostgres } from './user.model';
import { IRegisterBody } from './user.type';
import { Op } from 'sequelize';

export class UserPostgresRepo {
    public static async create(userData: IRegisterBody): Promise<UserPostgres> {
        return await UserPostgres.create(userData);
    }

    public static async findById(id: number): Promise<UserPostgres | null> {
        return await UserPostgres.findByPk(id);
    }

    public static async findByEmail(email: string): Promise<UserPostgres | null> {
        return await UserPostgres.findOne({
            where: { email },
        });
    }

    public static async findByUsername(username: string): Promise<UserPostgres | null> {
        return await UserPostgres.findOne({
            where: { username },
        });
    }

    public static async findWithPagination(page = 1, limit = 10, filter?: { isActive?: boolean }): Promise<{ users: UserPostgres[]; total: number }> {
        const offset = (page - 1) * limit;
        const where: any = {};

        if (filter?.isActive !== undefined) {
            where.isActive = filter.isActive;
        }

        const { rows, count } = await UserPostgres.findAndCountAll({
            where,
            limit,
            offset,
            order: [['createdAt', 'DESC']],
        });

        return {
            users: rows,
            total: count,
        };
    }

    public static async emailExists(email: string, excludeId?: number): Promise<boolean> {
        const where: any = { email };
        if (excludeId) {
            where.id = { [Op.ne]: excludeId };
        }
        const count = await UserPostgres.count({ where });
        return count > 0;
    }

    public static async usernameExists(username: string, excludeId?: number): Promise<boolean> {
        const where: any = { username };
        if (excludeId) {
            where.id = { [Op.ne]: excludeId };
        }
        const count = await UserPostgres.count({ where });
        return count > 0;
    }

    public static async countAll(): Promise<number> {
        return await UserPostgres.count();
    }
}

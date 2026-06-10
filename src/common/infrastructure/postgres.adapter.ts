import { Sequelize, Dialect } from 'sequelize';
import * as config from '@config/environment';
import logger from '@common/logger';

class PostgresAdapter {
    // eslint-disable-next-line no-use-before-define
    private static instance: PostgresAdapter;
    public sequelize: Sequelize;

    private constructor() {
        this.sequelize = new Sequelize({
            dialect: config.DB_DIALECT_POSTGRES as Dialect,
            username: config.DB_USERNAME_POSTGRES,
            password: config.DB_PASSWORD_POSTGRES,
            database: config.DB_DATABASE_POSTGRES,
            host: config.DB_HOST_POSTGRES,
            port: config.DB_PORT_POSTGRES,
            logging: config.NODE_ENV === 'development' ? console.log : false,
            define: {
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
            // pool: {
            //     max: config.db.poolMax,
            //     min: config.db.poolMin,
            //     acquire: config.db.poolAcquire,
            //     idle: config.db.poolIdle,
            // },
        });
    }

    public static getInstance(): PostgresAdapter {
        if (!PostgresAdapter.instance) {
            PostgresAdapter.instance = new PostgresAdapter();
        }
        return PostgresAdapter.instance;
    }

    public async connect(): Promise<void> {
        try {
            await this.sequelize.authenticate();
            logger.info('Connect to PostgreSQL successfully!');
        } catch (error) {
            logger.error('Connect to PostgreSQL failed: %o', error);
        }
    }

    public async disconnect(): Promise<void> {
        try {
            await this.sequelize.close();
            logger.info('Disconnect to PostgreSQL successfully!');
            PostgresAdapter.instance = undefined as unknown as PostgresAdapter; // Reset instance
        } catch (error) {
            logger.error('Disconnect to PostgreSQL failed: %o', error);
        }
    }
}

export const postgresAdapter = PostgresAdapter.getInstance();

export default PostgresAdapter;

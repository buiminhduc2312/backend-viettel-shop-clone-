import path from 'path';
import dotenv from 'dotenv-safe';

dotenv.config({
    path: path.join(__dirname, '../../.env'),
    sample: path.join(__dirname, '../../.env.example'),
});

export const APP_NAME: string = process.env.APP_NAME || 'demo_app';
export const NODE_ENV: string = process.env.NODE_ENV || 'development';
export const LOG_LEVEL: string = process.env.LOG_LEVEL || 'debug';
export const LOG_OUTPUT_JSON: boolean = process.env.LOG_OUTPUT_JSON === '1';

export const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

export const JWT_SECRET: string = process.env.JWT_SECRET || 'JWT_SECRET';

export const MONGODB_URI: string = process.env.MONGODB_URI || 'mongodb://demo-app:password@localhost:27072/demo-app';

export const REDIS_URI: string = process.env.REDIS_URI || 'redis://localhost:6379';

// PostgreSQL configuration
export const DB_DIALECT_POSTGRES: string = process.env.DB_DIALECT_POSTGRES || 'postgres';
export const DB_DATABASE_POSTGRES: string = process.env.DB_DATABASE_POSTGRES || 'demo_db';
export const DB_USERNAME_POSTGRES: string = process.env.DB_USERNAME_POSTGRES || 'postgres';
export const DB_PASSWORD_POSTGRES: string = process.env.DB_PASSWORD_POSTGRES || 'password';
export const DB_HOST_POSTGRES: string = process.env.DB_HOST_POSTGRES || 'localhost';
export const DB_PORT_POSTGRES: number = parseInt(process.env.DB_PORT_POSTGRES as string, 10) || 5432;

import 'ts-node/register';
import * as config from './environment';

const dbConfig = {
    [config.NODE_ENV]: {
        username: config.DB_USERNAME_POSTGRES,
        password: config.DB_PASSWORD_POSTGRES,
        database: config.DB_DATABASE_POSTGRES,
        host: config.DB_HOST_POSTGRES,
        dialect: config.DB_DIALECT_POSTGRES,
        port: config.DB_PORT_POSTGRES,
        define: {
            charset: 'utf8',
            dialectOptions: {
                collate: 'utf8_general_ci',
            },
        },
    },
};

console.log('dbConfig=%o', dbConfig);

export = dbConfig;

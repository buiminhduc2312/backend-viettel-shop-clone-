import { PORT } from '@config/environment';
import { ExpressServer } from '@api/server';
import { MongoAdapter } from '@common/infrastructure/mongo.adapter';
import { RedisAdapter } from '@common/infrastructure/redis.adapter';
// import { postgresAdapter } from '@common/infrastructure/postgres.adapter';
import logger from '@common/logger';
import { UserEvent } from '../biz/user/user.event';
import { ensureProductSeedData } from '../services/productSeeder';

// IMPORT CRONJOB
import { initBlacklistCronjob } from '../biz/user/blacklist.cron';

/**
 * Wrapper around the Node process, ExpressServer abstraction and complex dependencies such as services that ExpressServer needs.
 * When not using Dependency Injection, can be used as place for wiring together services which are dependencies of ExpressServer.
 */
export class Application {
    /**
     * Implement create application, connecting db here
     */
    public static async createApplication(): Promise<ExpressServer> {
        // await postgresAdapter.connect();
        await MongoAdapter.connect();
        await ensureProductSeedData();
        // await RedisAdapter.connect();//

        Application.registerEvents();

        initBlacklistCronjob();

        const expressServer = new ExpressServer();
        await expressServer.setup(PORT);
        Application.handleExit(expressServer);

        return expressServer;
    }

    /**
     * Register signal handler to graceful shutdown
     *
     * @param express Express server
     */
    private static handleExit(express: ExpressServer) {
        process.on('uncaughtException', (err: unknown) => {
            logger.error('Uncaught exception', err);
            Application.shutdownProperly(1, express);
        });
        process.on('unhandledRejection', (reason: unknown | null | undefined) => {
            logger.error('Unhandled Rejection at promise', reason);
            Application.shutdownProperly(2, express);
        });
        process.on('SIGINT', () => {
            logger.info('Caught SIGINT, exitting!');
            Application.shutdownProperly(128 + 2, express);
        });
        process.on('SIGTERM', () => {
            logger.info('Caught SIGTERM, exitting');
            Application.shutdownProperly(128 + 2, express);
        });
        process.on('exit', () => {
            logger.info('Exiting process...');
        });
    }

    /**
     * Handle graceful shutdown
     *
     * @param exitCode
     * @param express
     */
    private static shutdownProperly(exitCode: number, express: ExpressServer) {
        Promise.resolve()
            .then(() => express.kill())
            .then(() => RedisAdapter.disconnect())
            .then(() => MongoAdapter.disconnect())
            // .then(() => postgresAdapter.disconnect())
            .then(() => {
                logger.info('Shutdown complete, bye bye!');
                process.exit(exitCode);
            })
            .catch((err) => {
                logger.error('Error during shutdown', err);
                process.exit(1);
            });
    }

    private static registerEvents() {
        // register event
        UserEvent.register();
    }
}

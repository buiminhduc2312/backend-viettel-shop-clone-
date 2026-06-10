import { WorkerServer } from '@worker/server';
import { RedisAdapter } from '@common/infrastructure/redis.adapter';
import { MongoAdapter } from '@common/infrastructure/mongo.adapter';
// import { postgresAdapter } from '@common/infrastructure/postgres.adapter';
import logger from '@common/logger';

/**
 * Wrapper around the Node process, ExpressServer abstraction and complex dependencies such as services that ExpressServer needs.
 * When not using Dependency Injection, can be used as place for wiring together services which are dependencies of ExpressServer.
 */
export class Application {
    /**
     * Implement create application, connecting db here
     */
    public static async createApplication(): Promise<void> {
        // await postgresAdapter.connect();
        await RedisAdapter.connect();
        await MongoAdapter.connect();
        Application.registerEvents();
        await WorkerServer.setup();
        Application.handleExit();
    }

    /**
     * Register signal handler to graceful shutdown
     *
     */
    private static handleExit() {
        process.on('uncaughtException', (err: unknown) => {
            logger.error('Uncaught exception', err);
            Application.shutdownProperly(1);
        });
        process.on('unhandledRejection', (reason: unknown | null | undefined) => {
            logger.error('Unhandled Rejection at promise', reason);
            Application.shutdownProperly(2);
        });
        process.on('SIGINT', () => {
            logger.info('Caught SIGINT, exitting!');
            Application.shutdownProperly(128 + 2);
        });
        process.on('SIGTERM', () => {
            logger.info('Caught SIGTERM, exitting');
            Application.shutdownProperly(128 + 2);
        });
        process.on('exit', () => {
            logger.info('Exiting process...');
        });
    }

    /**
     * Handle graceful shutdown
     *
     * @param exitCode
     */
    private static shutdownProperly(exitCode: number) {
        Promise.resolve()
            .then(() => Application.flushThrottled())
            .then(() => WorkerServer.kill())
            .then(() => MongoAdapter.disconnect())
            .then(() => RedisAdapter.disconnect())
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
        // register events
    }

    private static async flushThrottled() {
        // todo
    }
}

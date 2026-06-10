import logger from '@common/logger';
import { Queue } from 'bull';
import { Router } from './router';

/**
 * Abstraction around bull processor
 */
export class WorkerServer {
    private static queues: Queue[];

    public static async setup(): Promise<void> {
        await WorkerServer.registerQueues();
        return;
    }

    public static async kill(): Promise<unknown> {
        const promises = WorkerServer.queues.map((queue) => {
            if (queue) {
                queue.close(false).catch((e) => logger.error('Error closing queue', e));
            }
        });
        return Promise.all(promises);
    }

    private static async registerQueues(): Promise<void> {
        WorkerServer.queues = await Router.register();
    }
}

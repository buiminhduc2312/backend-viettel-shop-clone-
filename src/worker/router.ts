import { JobHandler } from '@worker/interface';
import { Queue } from 'bull';

export class Router {
    static async register(): Promise<Queue[]> {
        // List job to register here
        const queues: JobHandler[] = [];

        return Promise.all(queues.map((queue) => queue.register()));
    }
}

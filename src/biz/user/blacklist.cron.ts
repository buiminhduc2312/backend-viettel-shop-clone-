import cron from 'node-cron';
import { BlacklistModel } from './blacklist.model';

export const initBlacklistCronjob = () => {
    cron.schedule('0 0 * * *', async () => {
        try {
            const twoDaysAgo = new Date();
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

            await BlacklistModel.deleteMany({
                createdAt: { $lt: twoDaysAgo },
            });
        } catch (error) {
            console.error('Blacklist cleanup failed:', error);
        }
    });
};

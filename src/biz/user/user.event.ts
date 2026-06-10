export const EVENT_USER_REGISTERED = 'event.user.registered';

import { EventBus } from '@common/eventbus';
import logger from '@common/logger';
import { IUserDocument } from './User';

function timeout(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export class UserEvent {
    public static register(): void {
        // register handler cho MongoDB
        EventBus.on(EVENT_USER_REGISTERED, UserEvent.UserRegisterHandler);
    }

    private static async UserRegisterHandler(user: IUserDocument): Promise<void> {
        logger.info(`Process send Mail success for user: ${user._id.toHexString()}`);
        await timeout(3000);
        logger.info(`Delay not affect api or worker processing`);
    }
}

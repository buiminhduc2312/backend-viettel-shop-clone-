import { EventEmitter } from 'events';

const eventbus = new EventEmitter();

// eventbus.e;
// export default eventbus;

export class EventBus {
    static emit<T>(eventName: string | symbol, args: T): boolean {
        return eventbus.emit(eventName, args);
    }

    static on<T>(eventName: string | symbol, listener: (args: T) => void): EventEmitter {
        return eventbus.on(eventName, listener);
    }
}

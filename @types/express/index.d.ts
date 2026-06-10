/* eslint-disable @typescript-eslint/ban-types */

declare global {
    namespace Express {
        interface Response {
            sendJson(data: unknown): this;
        }

        interface Request {
            userId: string | number; // Support both MongoDB (string) and PostgreSQL (number)
        }
    }
}

export {};

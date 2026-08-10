import { ExpressServer } from './server';
import { MongoAdapter } from '../common/infrastructure/mongo.adapter';

let app: any;

export default async function handler(req: any, res: any) {
    if (!app) {
        await MongoAdapter.connect();
        const expressServer = new ExpressServer();
        app = await expressServer.setup();
    }
    return app(req, res);
}

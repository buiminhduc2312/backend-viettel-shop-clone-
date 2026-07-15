import express, { Express } from 'express';
import { Server } from 'http';
import helmet from 'helmet';
import routes from '@api/router';
import logger from '@common/logger';
import morgan from 'morgan';
import { NODE_ENV } from '@config/environment';
import { ResponseMiddleware } from '@api/response.middleware';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerDefinition } from '@config/swagger';
import { swaggerUiOptions } from '@config/swagger';

// eslint-disable-next-line @typescript-eslint/ban-types
express.response.sendJson = function (data: object) {
    return this.json({ error_code: 0, message: 'OK', ...data });
};

/**
 * Abstraction around the raw Express.js server and Nodes' HTTP server.
 * Defines HTTP request mappings, basic as well as request-mapping-specific
 * middleware chains for application logic, config and everything else.
 */
export class ExpressServer {
    private server?: Express;
    private httpServer?: Server;

    public async setup(port: number): Promise<Express> {
        const server = express();
        this.setupStandardMiddlewares(server);
        this.setupSecurityMiddlewares(server);
        this.configureRoutes(server);
        this.setupErrorHandlers(server);

        this.httpServer = this.listen(server, port);
        this.server = server;
        return this.server;
    }

    public listen(server: Express, port: number): Server {
        logger.info(`Starting server on port ${port} (${NODE_ENV})`);
        return server.listen(port);
    }

    public async kill(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.httpServer) {
                this.httpServer.close((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    }

    private setupSecurityMiddlewares(server: Express) {
        server.use(helmet());
        server.use(helmet.referrerPolicy({ policy: 'same-origin' }));
        server.use(
            helmet.contentSecurityPolicy({
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'unsafe-inline'"],
                    scriptSrc: ["'unsafe-inline'", "'self'"],
                },
            }),
        );
        server.use(
            helmet.contentSecurityPolicy({
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'unsafe-inline'", "'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    connectSrc: ["'self'", 'blob:'],
                    imgSrc: ["'self'", 'data:', 'blob:'],
                    fontSrc: ["'self'", 'data:'],
                    objectSrc: ["'none'"],
                },
            }),
        );
    }

    private setupStandardMiddlewares(server: Express) {
        server.use(express.json());
        server.use(express.urlencoded({ extended: true }));
        server.use(
            cors({
                origin: '*',
                methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            }),
        );
        NODE_ENV !== 'development' ? server.use(morgan('tiny')) : server.use(morgan('dev'));
    }

    private configureRoutes(server: Express) {
        // Nhật ký tạm thời xác nhận router chính được mount trước khi server lắng nghe.
        console.log('API ROUTER MOUNTED');
        server.use(routes);
        server.use('/api-docs', swaggerUi.serve as any, swaggerUi.setup(swaggerDefinition, swaggerUiOptions) as any);
    }

    private setupErrorHandlers(server: Express) {
        // if error is not an instanceOf APIError, convert it.
        server.use(ResponseMiddleware.converter);

        // catch 404 and forward to error handler
        server.use(ResponseMiddleware.notFound);

        // error handler, send stacktrace only during development
        server.use(ResponseMiddleware.handler);
    }
}

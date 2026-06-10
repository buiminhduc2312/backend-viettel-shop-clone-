// Import swagger definitions from modules
import { authSchemas, authResponses, authSecuritySchemes } from '@api/auth/auth.swagger';
import { commonSchemas, commonResponses, healthSchemas, healthPaths } from '@config/swagger/common.swagger';

/** Merge all path objects into one so every path is guaranteed in spec (avoids server/build quirks). */
const paths = Object.assign({}, healthPaths);

/**
 * Swagger Configuration
 * Modular API documentation - imports definitions from individual modules
 */
export const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'ORTB API PLATFORM',
        version: '1.0.0',
        description: 'ORTB API Platform provides comprehensive endpoints for managing samples and users. This API follows RESTful principles and uses JWT for authentication.',
        license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT',
        },
    },
    tags: [
        {
            name: 'Health',
            description: 'Health check endpoints',
        },
    ],
    components: {
        securitySchemes: {
            ...authSecuritySchemes,
        },
        schemas: {
            ...commonSchemas,
            ...authSchemas,
            ...healthSchemas,
        },
        responses: {
            ...commonResponses,
            ...authResponses,
        },
    },
    paths,
};

/**
 * Swagger UI Options
 */
export const swaggerUiOptions = {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'PUBSTAR ORTB API Documentation',
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        tryItOutEnabled: true,
        supportedSubmitMethods: ['get', 'post', 'put', 'delete'],
        requestInterceptor: (req: any) => {
            req.credentials = 'same-origin';
            return req;
        },
    },
};

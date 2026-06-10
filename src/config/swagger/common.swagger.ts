/**
 * Common Swagger Definitions
 * Contains shared schemas and responses used across all modules
 */

import { createGetEndpoint } from './swagger.utils';

export const commonSchemas = {
    ApiResponse: {
        type: 'object',
        properties: {
            error_code: {
                type: 'number',
                example: 0,
                description: 'Error code (0 means success)',
            },
            message: {
                type: 'string',
                example: 'OK',
                description: 'Response message',
            },
            data: {
                type: 'object',
                description: 'Response data',
            },
        },
    },
    ErrorResponse: {
        type: 'object',
        properties: {
            error_code: {
                type: 'number',
                example: 1,
                description: 'Error code',
            },
            message: {
                type: 'string',
                example: 'Error message',
                description: 'Error description',
            },
        },
    },
    ValidationError: {
        type: 'object',
        properties: {
            error_code: {
                type: 'number',
                example: 400,
                description: 'Validation error code',
            },
            message: {
                type: 'string',
                example: 'Validation error',
                description: 'Validation error message',
            },
            details: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        field: {
                            type: 'string',
                            example: 'email',
                        },
                        message: {
                            type: 'string',
                            example: 'Email is required',
                        },
                    },
                },
                description: 'Detailed validation errors',
            },
        },
    },
};

export const commonResponses = {
    ValidationError: {
        description: 'Validation error',
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/ValidationError',
                },
                example: {
                    error_code: 400,
                    message: 'Validation error',
                    details: [
                        {
                            field: 'email',
                            message: 'Email is required',
                        },
                    ],
                },
            },
        },
    },
    NotFoundError: {
        description: 'Resource not found',
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                    error_code: 404,
                    message: 'Not found',
                },
            },
        },
    },
    InternalServerError: {
        description: 'Internal server error',
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                    error_code: 500,
                    message: 'Internal server error',
                },
            },
        },
    },
};
export const healthSchemas = {
    HealthStatus: {
        type: 'object',
        properties: {
            status: {
                type: 'string',
                example: 'OK',
                description: 'Health status',
            },
            timestamp: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-01T00:00:00.000Z',
                description: 'Current timestamp',
            },
            uptime: {
                type: 'number',
                example: 3600,
                description: 'Server uptime in seconds',
            },
        },
    },
};

export const healthPaths = {
    '/status': {
        get: createGetEndpoint({
            tags: ['Health'],
            summary: 'Health check endpoint',
            description: 'Returns OK if the server is running and healthy',
            operationId: 'getStatus',
            responses: [
                {
                    status: 200,
                    description: 'Server is running and healthy',
                    schema: 'HealthStatus',
                },
                {
                    status: 503,
                    description: 'Server is unhealthy',
                },
            ],
        }),
    },
};

/**
 * Auth Module Swagger Definitions
 * Contains all API documentation for authentication-related schemas and responses
 */

export const authSchemas = {
    TokenPayload: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                example: '123e4567-e89b-12d3-a456-426614174000',
                description: 'User ID from JWT token',
            },
        },
    },
    TokenResponse: {
        type: 'object',
        properties: {
            tokenType: {
                type: 'string',
                example: 'Bearer',
                description: 'Token type',
            },
            accessToken: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                description: 'JWT access token',
            },
            iat: {
                type: 'number',
                example: 1640995200,
                description: 'Issued at timestamp',
            },
            exp: {
                type: 'number',
                example: 1641081600,
                description: 'Expiration timestamp',
            },
        },
    },
    LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: {
                type: 'string',
                format: 'email',
                example: 'john@example.com',
                description: 'User email address',
            },
            password: {
                type: 'string',
                format: 'password',
                example: 'SecurePassword123!',
                description: 'User password',
            },
        },
    },
};

export const authResponses = {
    UnauthorizedError: {
        description: 'Authentication token is missing or invalid',
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                    error_code: 401,
                    message: 'Unauthorized',
                },
            },
        },
    },
    TokenExpiredError: {
        description: 'JWT token has expired',
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                    error_code: 401,
                    message: 'Token expired',
                },
            },
        },
    },
    InvalidCredentialsError: {
        description: 'Invalid email or password',
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                    error_code: 401,
                    message: 'Invalid credentials',
                },
            },
        },
    },
};

export const authSecuritySchemes = {
    BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token in the format: Bearer {token}',
    },
};

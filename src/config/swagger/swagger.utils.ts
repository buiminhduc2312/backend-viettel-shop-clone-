/**
 * Swagger HTTP Method Utilities
 * Reusable functions for creating standardized HTTP method definitions
 */

// Common parameter types
export interface QueryParam {
    name: string;
    description: string;
    required?: boolean;
    schema: {
        type: 'string' | 'number' | 'integer' | 'boolean' | 'array';
        format?: string;
        minimum?: number;
        maximum?: number;
        default?: any;
        example?: any;
        items?: any;
    };
}

export interface PathParam {
    name: string;
    description: string;
    schema: {
        type: 'string' | 'number' | 'integer';
        format?: string;
        example?: any;
    };
}

export interface RequestBody {
    schema: string;
    description?: string;
    required?: boolean;
}

export interface Response {
    status: number;
    description: string;
    schema?: string;
    isArray?: boolean;
    example?: any;
}

// Base configuration for all methods
interface BaseMethodConfig {
    tags: string[];
    summary: string;
    description: string;
    operationId: string;
    security?: Record<string, string[]>[];
    responses: Response[];
    queryParams?: QueryParam[];
    pathParams?: PathParam[];
    requestBody?: RequestBody;
}

// Operation object type definition
interface OperationObject {
    tags: string[];
    summary: string;
    description: string;
    operationId: string;
    security?: Record<string, string[]>[];
    parameters?: {
        name: string;
        in: 'path' | 'query';
        description: string;
        required: boolean;
        schema: any;
    }[];
    requestBody?: {
        required: boolean;
        description?: string;
        content: {
            'application/json': {
                schema: {
                    $ref: string;
                };
            };
        };
    };
    responses: Record<
        string,
        {
            description: string;
            content?: {
                'application/json': {
                    schema: any;
                    example?: any;
                };
            };
        }
    >;
}

/**
 * Creates a standardized GET endpoint definition
 */
export function createGetEndpoint(config: BaseMethodConfig): OperationObject {
    const operation: OperationObject = {
        tags: config.tags,
        summary: config.summary,
        description: config.description,
        operationId: config.operationId,
        responses: createResponses(config.responses),
    };

    // Add security if provided
    if (config.security) {
        operation.security = config.security;
    }

    // Add parameters
    const parameters: {
        name: string;
        in: 'path' | 'query';
        description: string;
        required: boolean;
        schema: any;
    }[] = [];

    if (config.pathParams) {
        config.pathParams.forEach((param) => {
            parameters.push({
                name: param.name,
                in: 'path',
                description: param.description,
                required: true,
                schema: param.schema,
            });
        });
    }

    if (config.queryParams) {
        config.queryParams.forEach((param) => {
            parameters.push({
                name: param.name,
                in: 'query',
                description: param.description,
                required: param.required || false,
                schema: param.schema,
            });
        });
    }

    if (parameters.length > 0) {
        operation.parameters = parameters;
    }

    return operation;
}

/**
 * Creates a standardized POST endpoint definition
 */
export function createPostEndpoint(config: BaseMethodConfig): OperationObject {
    const operation: OperationObject = {
        tags: config.tags,
        summary: config.summary,
        description: config.description,
        operationId: config.operationId,
        responses: createResponses(config.responses),
    };

    // Add security if provided
    if (config.security) {
        operation.security = config.security;
    }

    // Add parameters (path params only for POST)
    const parameters: {
        name: string;
        in: 'path' | 'query';
        description: string;
        required: boolean;
        schema: any;
    }[] = [];

    if (config.pathParams) {
        config.pathParams.forEach((param) => {
            parameters.push({
                name: param.name,
                in: 'path',
                description: param.description,
                required: true,
                schema: param.schema,
            });
        });
    }

    if (parameters.length > 0) {
        operation.parameters = parameters;
    }

    // Add request body
    if (config.requestBody) {
        operation.requestBody = {
            required: config.requestBody.required !== false,
            content: {
                'application/json': {
                    schema: {
                        $ref: `#/components/schemas/${config.requestBody.schema}`,
                    },
                },
            },
        };

        if (config.requestBody.description) {
            operation.requestBody.description = config.requestBody.description;
        }
    }

    return operation;
}

/**
 * Creates a standardized PUT endpoint definition
 */
export function createPutEndpoint(config: BaseMethodConfig): OperationObject {
    const operation: OperationObject = {
        tags: config.tags,
        summary: config.summary,
        description: config.description,
        operationId: config.operationId,
        responses: createResponses(config.responses),
    };

    // Add security if provided
    if (config.security) {
        operation.security = config.security;
    }

    // Add parameters (path params only for PUT)
    const parameters: {
        name: string;
        in: 'path' | 'query';
        description: string;
        required: boolean;
        schema: any;
    }[] = [];

    if (config.pathParams) {
        config.pathParams.forEach((param) => {
            parameters.push({
                name: param.name,
                in: 'path',
                description: param.description,
                required: true,
                schema: param.schema,
            });
        });
    }

    if (parameters.length > 0) {
        operation.parameters = parameters;
    }

    // Add request body (required for PUT)
    if (config.requestBody) {
        operation.requestBody = {
            required: config.requestBody.required !== false,
            content: {
                'application/json': {
                    schema: {
                        $ref: `#/components/schemas/${config.requestBody.schema}`,
                    },
                },
            },
        };

        if (config.requestBody.description) {
            operation.requestBody.description = config.requestBody.description;
        }
    }

    return operation;
}

/**
 * Creates a standardized DELETE endpoint definition
 */
export function createDeleteEndpoint(config: BaseMethodConfig): OperationObject {
    const operation: OperationObject = {
        tags: config.tags,
        summary: config.summary,
        description: config.description,
        operationId: config.operationId,
        responses: createResponses(config.responses),
    };

    // Add security if provided
    if (config.security) {
        operation.security = config.security;
    }

    // Add parameters (path params only for DELETE)
    const parameters: {
        name: string;
        in: 'path' | 'query';
        description: string;
        required: boolean;
        schema: any;
    }[] = [];

    if (config.pathParams) {
        config.pathParams.forEach((param) => {
            parameters.push({
                name: param.name,
                in: 'path',
                description: param.description,
                required: true,
                schema: param.schema,
            });
        });
    }

    if (parameters.length > 0) {
        operation.parameters = parameters;
    }

    return operation;
}

/**
 * Creates a standardized PATCH endpoint definition
 */
export function createPatchEndpoint(config: BaseMethodConfig): OperationObject {
    const operation: OperationObject = {
        tags: config.tags,
        summary: config.summary,
        description: config.description,
        operationId: config.operationId,
        responses: createResponses(config.responses),
    };

    // Add security if provided
    if (config.security) {
        operation.security = config.security;
    }

    // Add parameters (path params only for PATCH)
    const parameters: {
        name: string;
        in: 'path' | 'query';
        description: string;
        required: boolean;
        schema: any;
    }[] = [];

    if (config.pathParams) {
        config.pathParams.forEach((param) => {
            parameters.push({
                name: param.name,
                in: 'path',
                description: param.description,
                required: true,
                schema: param.schema,
            });
        });
    }

    if (parameters.length > 0) {
        operation.parameters = parameters;
    }

    // Add request body (optional for PATCH)
    if (config.requestBody) {
        operation.requestBody = {
            required: config.requestBody.required || false,
            content: {
                'application/json': {
                    schema: {
                        $ref: `#/components/schemas/${config.requestBody.schema}`,
                    },
                },
            },
        };

        if (config.requestBody.description) {
            operation.requestBody.description = config.requestBody.description;
        }
    }

    return operation;
}

/**
 * Helper function to create responses object
 */
function createResponses(responses: Response[]): Record<
    string,
    {
        description: string;
        content?: {
            'application/json': {
                schema: any;
                example?: any;
            };
        };
    }
> {
    const responsesObj: Record<
        string,
        {
            description: string;
            content?: {
                'application/json': {
                    schema: any;
                    example?: any;
                };
            };
        }
    > = {};

    responses.forEach((response) => {
        const responseObj: {
            description: string;
            content?: {
                'application/json': {
                    schema: any;
                    example?: any;
                };
            };
        } = {
            description: response.description,
        };

        if (response.schema) {
            responseObj.content = {
                'application/json': {
                    schema: response.isArray
                        ? {
                              allOf: [
                                  { $ref: '#/components/schemas/ApiResponse' },
                                  {
                                      type: 'object',
                                      properties: {
                                          data: {
                                              type: 'array',
                                              items: { $ref: `#/components/schemas/${response.schema}` },
                                          },
                                      },
                                  },
                              ],
                          }
                        : {
                              allOf: [
                                  { $ref: '#/components/schemas/ApiResponse' },
                                  {
                                      type: 'object',
                                      properties: {
                                          data: { $ref: `#/components/schemas/${response.schema}` },
                                      },
                                  },
                              ],
                          },
                },
            };

            if (response.example) {
                responseObj.content!['application/json'].example = response.example;
            }
        }

        responsesObj[response.status.toString()] = responseObj;
    });

    return responsesObj;
}

/**
 * Common response templates
 */
export const CommonResponses = {
    success: (schema: string, isArray = false): Response => ({
        status: 200,
        description: 'Success',
        schema,
        isArray,
    }),
    created: (schema: string): Response => ({
        status: 201,
        description: 'Created',
        schema,
    }),
    noContent: (): Response => ({
        status: 204,
        description: 'No Content',
    }),
    badRequest: (): Response => ({
        status: 400,
        description: 'Bad Request',
    }),
    unauthorized: (): Response => ({
        status: 401,
        description: 'Unauthorized',
    }),
    forbidden: (): Response => ({
        status: 403,
        description: 'Forbidden',
    }),
    notFound: (): Response => ({
        status: 404,
        description: 'Not Found',
    }),
    conflict: (): Response => ({
        status: 409,
        description: 'Conflict',
    }),
    internalError: (): Response => ({
        status: 500,
        description: 'Internal Server Error',
    }),
};

/**
 * Common query parameters
 */
export const CommonQueryParams = {
    limit: {
        name: 'limit',
        description: 'Number of items to return (1-100)',
        required: false,
        schema: {
            type: 'integer' as const,
            minimum: 1,
            maximum: 100,
            default: 10,
            example: 10,
        },
    },
    offset: {
        name: 'offset',
        description: 'Number of items to skip',
        required: false,
        schema: {
            type: 'integer' as const,
            minimum: 0,
            default: 0,
            example: 0,
        },
    },
    page: {
        name: 'page',
        description: 'Page number (1-based)',
        required: false,
        schema: {
            type: 'integer' as const,
            minimum: 1,
            default: 1,
            example: 1,
        },
    },
    search: {
        name: 'search',
        description: 'Search term',
        required: false,
        schema: {
            type: 'string' as const,
            example: 'search term',
        },
    },
    sort: {
        name: 'sort',
        description: 'Sort field',
        required: false,
        schema: {
            type: 'string' as const,
            example: 'createdAt',
        },
    },
    order: {
        name: 'order',
        description: 'Sort order (asc or desc)',
        required: false,
        schema: {
            type: 'string' as const,
            enum: ['asc', 'desc'],
            default: 'desc',
            example: 'desc',
        },
    },
};

/**
 * Common path parameters
 */
export const CommonPathParams = {
    id: {
        name: 'id',
        description: 'Resource ID',
        schema: {
            type: 'string' as const,
            example: '123e4567-e89b-12d3-a456-426614174000',
        },
    },
    userId: {
        name: 'userId',
        description: 'User ID',
        schema: {
            type: 'string' as const,
            example: '123e4567-e89b-12d3-a456-426614174000',
        },
    },
};

/**
 * Security schemes
 */
export const SecuritySchemes = {
    bearerAuth: [
        {
            BearerAuth: [],
        },
    ],
    optionalAuth: [
        {
            BearerAuth: [],
        },
    ],
};

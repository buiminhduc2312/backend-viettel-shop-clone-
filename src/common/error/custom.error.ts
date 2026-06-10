import { APIError } from './api.error';
import { NOT_FOUND, PERMISSION_DENIED } from '../message.response';
import { ErrorCode } from '@config/errors';
import httpStatus from 'http-status';

export class CustomError {
    static PermissionDenied(stack?: string) {
        return new APIError({
            message: PERMISSION_DENIED,
            errorCode: ErrorCode.REQUEST_VALIDATION_ERROR,
            status: httpStatus.BAD_REQUEST,
            stack: stack || '',
        });
    }

    static NotFound(stack?: string) {
        return new APIError({
            message: NOT_FOUND,
            errorCode: ErrorCode.REQUEST_VALIDATION_ERROR,
            status: httpStatus.BAD_REQUEST,
            stack: stack || '',
        });
    }

    static CustomMessage(message: string, stack?: string) {
        return new APIError({
            message,
            errorCode: ErrorCode.REQUEST_VALIDATION_ERROR,
            status: httpStatus.BAD_REQUEST,
            stack: !stack ? new Error(message).stack || '' : stack,
        });
    }

    static BadRequest(message: string, errorCode: ErrorCode, messageData?: Record<string, string>, stack?: string) {
        return new APIError({
            message,
            errorCode,
            status: httpStatus.BAD_REQUEST,
            messageData: messageData ? messageData : null,
            stack: !stack ? new Error(message).stack || '' : stack,
        });
    }
}

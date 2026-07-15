import { Joi, schema } from 'express-validation';
import { IResigterBody } from '@biz/user/user.type';
import { FULL_NAME_ERROR_MESSAGE, isValidFullName } from '../../utils/fullNameValidation';

export const register: schema = {
    body: Joi.object<IResigterBody, true, IResigterBody>({
        email: Joi.string().email().required(),
        phone: Joi.string().allow(''),
        username: Joi.string().required(),
        password: Joi.string().required(),
        first_name: Joi.string().allow(''),
        last_name: Joi.string().allow(''),
    }),
};

export const registerPostgres: schema = {
    body: Joi.object({
        username: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(100).required(),
        first_name: Joi.string().max(50).optional(),
        last_name: Joi.string().max(50).optional(),
        phone: Joi.string().max(20).optional(),
    }),
};

export const updateProfile: schema = {
    body: Joi.object({
        fullName: Joi.string()
            .required()
            .custom((value, helpers) => {
                if (!isValidFullName(value)) {
                    return helpers.message({ custom: FULL_NAME_ERROR_MESSAGE });
                }

                return value.trim();
            }),
        // Check số điện thoại chuẩn Việt Nam
        phone: Joi.string()
            .pattern(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)
            .optional(),
        // Check avatar phải là 1 đường link URL hợp lệ
        avatar: Joi.string().uri().optional(),
    }),
};

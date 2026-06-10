import { Joi, schema } from 'express-validation';
import { IResigterBody } from '@biz/user/user.type';

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

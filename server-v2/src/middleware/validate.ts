import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { HttpStatus } from '../constants/httpStatus.js';

export const validate = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map((detail) => detail.message);
            res.status(HttpStatus.BAD_REQUEST).json({ success: false, errors });
            return;
        }

        next();
    };
};

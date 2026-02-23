import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../constants/httpStatus.js';
import { Messages } from '../constants/messages.js';
import { env } from '../config/env.js';

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction): void => {
    let statusCode: number = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = err.message || Messages.SERVER_ERROR;

    console.error(`[Error] ${req.method} ${req.originalUrl} - ${statusCode} - ${message}`);
    if (err && err.stack) {
        console.error(err.stack);
    }

    if (err.name === 'CastError') {
        statusCode = HttpStatus.BAD_REQUEST;
        message = Messages.INVALID_ID;
    }

    if (err.code === 11000) {
        statusCode = HttpStatus.BAD_REQUEST;
        message = Messages.DUPLICATE_FIELD;
    }

    if (err.name === 'ValidationError') {
        statusCode = HttpStatus.BAD_REQUEST;
        const errors = Object.values(err.errors).map((e: any) => e.message);
        res.status(statusCode).json({ success: false, errors });
        return;
    }

    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        statusCode = HttpStatus.UNAUTHORIZED;
        message = Messages.TOKEN_INVALID;
    }

    const response: Record<string, any> = { success: false, error: message };

    if (env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

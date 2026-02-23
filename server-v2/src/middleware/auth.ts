import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HttpStatus } from '../constants/httpStatus.js';
import { Messages } from '../constants/messages.js';
import { env } from '../config/env.js';

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies.token;

    if (!token) {
        res.status(HttpStatus.UNAUTHORIZED).json({ success: false, error: Messages.NO_TOKEN });
        return;
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    (req as any).user = decoded;
    next();
};

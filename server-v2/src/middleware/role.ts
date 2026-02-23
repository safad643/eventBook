import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../constants/httpStatus.js';
import { Messages } from '../constants/messages.js';

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!roles.includes((req as any).user.role)) {
            res.status(HttpStatus.FORBIDDEN).json({ success: false, error: Messages.INSUFFICIENT_ROLE });
            return;
        }
        next();
    };
};

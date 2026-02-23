import { Response } from 'express';
import { HttpStatus } from '../constants/httpStatus.js';

export abstract class BaseController {
    protected success(res: Response, data: object, statusCode: HttpStatus = HttpStatus.OK): void {
        res.status(statusCode).json({ success: true, ...data });
    }

    protected error(res: Response, message: string, statusCode: HttpStatus = HttpStatus.BAD_REQUEST): void {
        res.status(statusCode).json({ success: false, error: message });
    }
}

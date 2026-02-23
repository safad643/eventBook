import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../di/types.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { BaseController } from './BaseController.js';
import { BookingService } from '../services/BookingService.js';

@injectable()
export class BookingController extends BaseController {
    constructor(@inject(TYPES.BookingService) private bookingService: BookingService) {
        super();
    }

    createBooking = async (req: Request, res: Response): Promise<void> => {
        const result = await this.bookingService.create((req as any).user.id, req.body);

        if ('error' in result) {
            const status = 'status' in result ? (result.status as HttpStatus) : HttpStatus.BAD_REQUEST;
            this.error(res, result.error!, status);
            return;
        }

        this.success(res, result, HttpStatus.CREATED);
    };

    getMyBookings = async (req: Request, res: Response): Promise<void> => {
        const result = await this.bookingService.getMyBookings((req as any).user.id);
        this.success(res, result);
    };

    cancelBooking = async (req: Request, res: Response): Promise<void> => {
        const result = await this.bookingService.cancel(req.params.id as string, (req as any).user.id);

        if ('error' in result) {
            const status = 'status' in result ? (result.status as HttpStatus) : HttpStatus.BAD_REQUEST;
            this.error(res, result.error!, status);
            return;
        }

        this.success(res, result);
    };
}

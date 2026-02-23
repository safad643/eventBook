import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../di/types.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { BaseController } from './BaseController.js';
import { AdminService } from '../services/AdminService.js';

@injectable()
export class AdminController extends BaseController {
    constructor(@inject(TYPES.AdminService) private adminService: AdminService) {
        super();
    }

    createService = async (req: Request, res: Response): Promise<void> => {
        const result = await this.adminService.createService(
            (req as any).user.id,
            req.body,
            req.files as Express.Multer.File[]
        );

        if ('error' in result) {
            this.error(res, result.error!, HttpStatus.BAD_REQUEST);
            return;
        }

        this.success(res, result, HttpStatus.CREATED);
    };

    updateService = async (req: Request, res: Response): Promise<void> => {
        const result = await this.adminService.updateService(
            req.params.id as string,
            (req as any).user.id,
            req.body,
            req.files as Express.Multer.File[]
        );

        if ('error' in result) {
            const status = 'status' in result ? (result.status as HttpStatus) : HttpStatus.BAD_REQUEST;
            this.error(res, result.error!, status);
            return;
        }

        this.success(res, result);
    };

    deleteService = async (req: Request, res: Response): Promise<void> => {
        const result = await this.adminService.deleteService(req.params.id as string, (req as any).user.id);

        if ('error' in result) {
            const status = 'status' in result ? (result.status as HttpStatus) : HttpStatus.BAD_REQUEST;
            this.error(res, result.error!, status);
            return;
        }

        this.success(res, { message: 'Service deleted' });
    };

    getAdminBookings = async (req: Request, res: Response): Promise<void> => {
        const result = await this.adminService.getBookings((req as any).user.id);
        this.success(res, result);
    };

    getDashboard = async (req: Request, res: Response): Promise<void> => {
        const result = await this.adminService.getDashboard((req as any).user.id);
        this.success(res, result);
    };
}

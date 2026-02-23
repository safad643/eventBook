import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../di/types.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { BaseController } from './BaseController.js';
import { ServiceService } from '../services/ServiceService.js';

@injectable()
export class ServiceController extends BaseController {
    constructor(@inject(TYPES.ServiceService) private serviceService: ServiceService) {
        super();
    }

    getServices = async (req: Request, res: Response): Promise<void> => {
        const result = await this.serviceService.getAll(req.query as Record<string, any>);
        this.success(res, result);
    };

    getServiceById = async (req: Request, res: Response): Promise<void> => {
        const result = await this.serviceService.getById(req.params.id as string);

        if ('error' in result) {
            this.error(res, result.error!, HttpStatus.NOT_FOUND);
            return;
        }

        this.success(res, result);
    };
}

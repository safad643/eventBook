import { injectable, inject } from 'inversify';
import { TYPES } from '../di/types.js';
import { Messages } from '../constants/messages.js';
import { buildFilter } from '../utils/serviceHelpers.js';
import type { IServiceRepository } from '../repositories/interfaces/IServiceRepository.js';

@injectable()
export class ServiceService {
    constructor(@inject(TYPES.IServiceRepository) private repo: IServiceRepository) { }

    async getAll(query: Record<string, any>) {
        const { page = 1, limit = 10, sort = '-createdAt', ...filterParams } = query;

        const filter = buildFilter(filterParams);
        const pageNum = Math.max(1, Number(page));
        const limitNum = Math.min(50, Math.max(1, Number(limit)));
        const skip = (pageNum - 1) * limitNum;
        const sortString = String(sort).replace(/,/g, ' ');

        const [services, total] = await Promise.all([
            this.repo.findWithPagination(filter, sortString, skip, limitNum),
            this.repo.countDocuments(filter),
        ]);

        return {
            count: services.length,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            services,
        };
    }

    async getById(id: string) {
        const service = await this.repo.findByIdPopulated(id);
        if (!service) return { error: Messages.SERVICE_NOT_FOUND };
        return { service };
    }
}

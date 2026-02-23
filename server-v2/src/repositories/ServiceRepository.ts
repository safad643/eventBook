import { injectable } from 'inversify';
import { Service, type IService } from '../models/Service.js';
import type { IServiceRepository } from './interfaces/IServiceRepository.js';

@injectable()
export class ServiceRepository implements IServiceRepository {
    async findWithPagination(filter: Record<string, any>, sort: string, skip: number, limit: number): Promise<IService[]> {
        return Service.find(filter)
            .populate('admin', 'name')
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .exec();
    }

    async countDocuments(filter: Record<string, any>): Promise<number> {
        return Service.countDocuments(filter).exec();
    }

    async findById(id: string): Promise<IService | null> {
        return Service.findById(id).exec();
    }

    async findByIdPopulated(id: string): Promise<IService | null> {
        return Service.findById(id).populate('admin', 'name').exec();
    }

    async findByIdAndAdmin(id: string, adminId: string): Promise<IService | null> {
        return Service.findOne({ _id: id, admin: adminId }).exec();
    }

    async findByAdmin(adminId: string): Promise<IService[]> {
        return Service.find({ admin: adminId }).exec();
    }

    async findByAdminSelect(adminId: string, fields: string): Promise<IService[]> {
        return Service.find({ admin: adminId }).select(fields).exec();
    }

    async create(data: Partial<IService>): Promise<IService> {
        return Service.create(data);
    }
}

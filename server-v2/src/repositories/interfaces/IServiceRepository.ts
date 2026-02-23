import { IService } from '../../models/Service.js';

export interface IServiceRepository {
    findWithPagination(filter: Record<string, any>, sort: string, skip: number, limit: number): Promise<IService[]>;
    countDocuments(filter: Record<string, any>): Promise<number>;
    findById(id: string): Promise<IService | null>;
    findByIdPopulated(id: string): Promise<IService | null>;
    findByIdAndAdmin(id: string, adminId: string): Promise<IService | null>;
    findByAdmin(adminId: string): Promise<IService[]>;
    findByAdminSelect(adminId: string, fields: string): Promise<IService[]>;
    create(data: Partial<IService>): Promise<IService>;
}

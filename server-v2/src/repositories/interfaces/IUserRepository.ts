import { IUser } from '../../models/User.js';

export interface IUserRepository {
    findByEmail(email: string, selectFields?: string): Promise<IUser | null>;
    findById(id: string): Promise<IUser | null>;
    create(data: Partial<IUser>): Promise<IUser>;
}

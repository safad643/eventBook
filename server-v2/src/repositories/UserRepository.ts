import { injectable } from 'inversify';
import { User, type IUser } from '../models/User.js';
import type { IUserRepository } from './interfaces/IUserRepository.js';

@injectable()
export class UserRepository implements IUserRepository {
    async findByEmail(email: string, selectFields?: string): Promise<IUser | null> {
        const query = User.findOne({ email });
        if (selectFields) query.select(selectFields);
        return query.exec();
    }

    async findById(id: string): Promise<IUser | null> {
        return User.findById(id).exec();
    }

    async create(data: Partial<IUser>): Promise<IUser> {
        return User.create(data);
    }
}

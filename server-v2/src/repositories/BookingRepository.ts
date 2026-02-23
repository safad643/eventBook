import { injectable } from 'inversify';
import { Booking, type IBooking } from '../models/Booking.js';
import type { IBookingRepository } from './interfaces/IBookingRepository.js';

@injectable()
export class BookingRepository implements IBookingRepository {
    async create(data: Partial<IBooking>): Promise<IBooking> {
        return Booking.create(data);
    }

    async findByUser(userId: string): Promise<IBooking[]> {
        return Booking.find({ user: userId })
            .populate('service', 'title category pricePerDay location images')
            .sort('-createdAt')
            .exec();
    }

    async findByIdAndUser(id: string, userId: string): Promise<IBooking | null> {
        return Booking.findOne({ _id: id, user: userId }).exec();
    }

    async findByServices(serviceIds: string[]): Promise<IBooking[]> {
        return Booking.find({ service: { $in: serviceIds } })
            .populate('user', 'name email')
            .populate('service', 'title category')
            .sort('-createdAt')
            .exec();
    }

    async deleteByService(serviceId: string): Promise<void> {
        await Booking.deleteMany({ service: serviceId }).exec();
    }
}

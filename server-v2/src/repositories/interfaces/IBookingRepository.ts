import { IBooking } from '../../models/Booking.js';

export interface IBookingRepository {
    create(data: Partial<IBooking>): Promise<IBooking>;
    findByUser(userId: string): Promise<IBooking[]>;
    findByIdAndUser(id: string, userId: string): Promise<IBooking | null>;
    findByServices(serviceIds: string[]): Promise<IBooking[]>;
    deleteByService(serviceId: string): Promise<void>;
}

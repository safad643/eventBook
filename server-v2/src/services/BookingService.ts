import { injectable, inject } from 'inversify';
import { TYPES } from '../di/types.js';
import { Messages } from '../constants/messages.js';
import { getDatesBetween, normalizeDates, checkAvailability, toDateString } from '../utils/bookingHelpers.js';
import { sendBookingEmail } from '../utils/sendEmail.js';
import type { IBookingRepository } from '../repositories/interfaces/IBookingRepository.js';
import type { IServiceRepository } from '../repositories/interfaces/IServiceRepository.js';

@injectable()
export class BookingService {
    constructor(
        @inject(TYPES.IBookingRepository) private bookingRepo: IBookingRepository,
        @inject(TYPES.IServiceRepository) private serviceRepo: IServiceRepository
    ) { }

    async create(userId: string, body: { serviceId: string; startDate: string; endDate: string }) {
        const { serviceId, startDate, endDate } = body;

        const service = await this.serviceRepo.findById(serviceId);
        if (!service) return { error: Messages.SERVICE_NOT_FOUND, status: 404 as const };

        const { start, end } = normalizeDates(startDate, endDate);

        if (end < start) {
            return { error: 'endDate must be >= startDate' };
        }

        const totalDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const totalPrice = totalDays * service.pricePerDay;
        const requestedDates = getDatesBetween(start, end);

        if (!checkAvailability(service.availabilityDates, requestedDates)) {
            return { error: 'Service not available for selected dates' };
        }

        // Remove dates from service availability
        const requestedDateStrings = requestedDates.map(toDateString);
        service.availabilityDates = service.availabilityDates.filter(
            (date) => !requestedDateStrings.includes(toDateString(date))
        );
        await service.save();

        const booking = await this.bookingRepo.create({
            user: userId as any,
            service: serviceId as any,
            startDate: start,
            endDate: end,
            totalDays,
            totalPrice,
            status: 'confirmed',
        });

        await booking.populate('service', 'title');

        // Fire-and-forget email
        sendBookingEmail(userId, booking, start, end, totalDays, totalPrice);

        return { booking };
    }

    async getMyBookings(userId: string) {
        const bookings = await this.bookingRepo.findByUser(userId);
        return { count: bookings.length, bookings };
    }

    async cancel(bookingId: string, userId: string) {
        const booking = await this.bookingRepo.findByIdAndUser(bookingId, userId);
        if (!booking) return { error: Messages.BOOKING_NOT_FOUND, status: 404 as const };

        if (booking.status === 'cancelled') {
            return { error: 'Booking already cancelled' };
        }

        booking.status = 'cancelled';

        // Add dates back to service availability
        const datesToRestore = getDatesBetween(booking.startDate, booking.endDate);
        const service = await this.serviceRepo.findById(booking.service.toString());
        if (service) {
            service.availabilityDates.push(...datesToRestore);
            await service.save();
        }

        await booking.save();
        return { booking };
    }
}

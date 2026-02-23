import { injectable, inject } from 'inversify';
import { TYPES } from '../di/types.js';
import { Messages } from '../constants/messages.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import type { IServiceRepository } from '../repositories/interfaces/IServiceRepository.js';
import type { IBookingRepository } from '../repositories/interfaces/IBookingRepository.js';

@injectable()
export class AdminService {
    constructor(
        @inject(TYPES.IServiceRepository) private serviceRepo: IServiceRepository,
        @inject(TYPES.IBookingRepository) private bookingRepo: IBookingRepository
    ) { }

    async createService(
        adminId: string,
        body: { title: string; category: string; pricePerDay: number; description: string; availabilityDates: string; contactDetails: string; location: string },
        files?: Express.Multer.File[]
    ) {
        const { title, category, pricePerDay, description, availabilityDates, contactDetails, location } = body;

        let parsedDates: Date[];
        try {
            parsedDates = JSON.parse(availabilityDates).map((d: string) => new Date(d));
        } catch {
            return { error: 'Invalid availabilityDates format' } as const;
        }

        let imageUrls: string[] = [];
        if (files && files.length > 0) {
            const uploadPromises = files.map((file) => uploadToCloudinary(file.buffer));
            const results = await Promise.all(uploadPromises);
            imageUrls = results.map((result: any) => result.secure_url);
        }

        const service = await this.serviceRepo.create({
            title,
            category: category as any,
            pricePerDay,
            description,
            availabilityDates: parsedDates,
            contactDetails,
            location,
            images: imageUrls,
            admin: adminId as any,
        });

        return { service };
    }

    async updateService(
        serviceId: string,
        adminId: string,
        body: { title?: string; category?: string; pricePerDay?: number; description?: string; availabilityDates?: string; contactDetails?: string; location?: string },
        files?: Express.Multer.File[]
    ) {
        const service = await this.serviceRepo.findByIdAndAdmin(serviceId, adminId);
        if (!service) return { error: Messages.SERVICE_NOT_FOUND, status: 404 } as const;

        const { title, category, pricePerDay, description, availabilityDates, contactDetails, location } = body;

        if (title) service.title = title;
        if (category) service.category = category as any;
        if (pricePerDay !== undefined) service.pricePerDay = pricePerDay;
        if (description) service.description = description;
        if (contactDetails) service.contactDetails = contactDetails;
        if (location) service.location = location;

        if (availabilityDates) {
            try {
                service.availabilityDates = JSON.parse(availabilityDates).map((d: string) => new Date(d));
            } catch {
                return { error: 'Invalid availabilityDates format' } as const;
            }
        }

        if (files && files.length > 0) {
            const uploadPromises = files.map((file) => uploadToCloudinary(file.buffer));
            const results = await Promise.all(uploadPromises);
            service.images = results.map((result: any) => result.secure_url);
        }

        await service.save();
        return { service };
    }

    async deleteService(serviceId: string, adminId: string) {
        const service = await this.serviceRepo.findByIdAndAdmin(serviceId, adminId);
        if (!service) return { error: Messages.SERVICE_NOT_FOUND, status: 404 } as const;

        await this.bookingRepo.deleteByService(String(service._id));
        await service.deleteOne();

        return { deleted: true } as const;
    }

    async getBookings(adminId: string) {
        const services = await this.serviceRepo.findByAdminSelect(adminId, '_id');
        const serviceIds = services.map((s) => String(s._id));

        const bookings = await this.bookingRepo.findByServices(serviceIds);
        return { count: bookings.length, bookings };
    }

    async getDashboard(adminId: string) {
        const services = await this.serviceRepo.findByAdmin(adminId);
        const serviceIds = services.map((s) => String(s._id));

        const bookings = await this.bookingRepo.findByServices(serviceIds);

        const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
        const cancelledBookings = bookings.filter((b) => b.status === 'cancelled');
        const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalPrice, 0);

        // Build chart data — last 6 months
        const now = new Date();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const chartData: { month: string; bookings: number; revenue: number }[] = [];

        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

            const monthBookings = bookings.filter((b) => {
                const created = new Date(b.createdAt);
                return created >= date && created < nextMonth;
            });

            const monthRevenue = monthBookings
                .filter((b) => b.status === 'confirmed')
                .reduce((sum, b) => sum + b.totalPrice, 0);

            chartData.push({
                month: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
                bookings: monthBookings.length,
                revenue: monthRevenue,
            });
        }

        return {
            stats: {
                totalServices: services.length,
                totalBookings: bookings.length,
                confirmedBookings: confirmedBookings.length,
                cancelledBookings: cancelledBookings.length,
                totalRevenue,
            },
            services,
            chartData,
        };
    }
}

export const TYPES = {
    // Repositories
    IUserRepository: Symbol.for('IUserRepository'),
    IServiceRepository: Symbol.for('IServiceRepository'),
    IBookingRepository: Symbol.for('IBookingRepository'),

    // Services
    AuthService: Symbol.for('AuthService'),
    ServiceService: Symbol.for('ServiceService'),
    BookingService: Symbol.for('BookingService'),
    AdminService: Symbol.for('AdminService'),

    // Controllers
    AuthController: Symbol.for('AuthController'),
    ServiceController: Symbol.for('ServiceController'),
    BookingController: Symbol.for('BookingController'),
    AdminController: Symbol.for('AdminController'),
};

import { Container } from 'inversify';
import { TYPES } from './types.js';

// Repositories
import type { IUserRepository } from '../repositories/interfaces/IUserRepository.js';
import type { IServiceRepository } from '../repositories/interfaces/IServiceRepository.js';
import type { IBookingRepository } from '../repositories/interfaces/IBookingRepository.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { ServiceRepository } from '../repositories/ServiceRepository.js';
import { BookingRepository } from '../repositories/BookingRepository.js';

// Services
import { AuthService } from '../services/AuthService.js';
import { ServiceService } from '../services/ServiceService.js';
import { BookingService } from '../services/BookingService.js';
import { AdminService } from '../services/AdminService.js';

// Controllers
import { AuthController } from '../controllers/AuthController.js';
import { ServiceController } from '../controllers/ServiceController.js';
import { BookingController } from '../controllers/BookingController.js';
import { AdminController } from '../controllers/AdminController.js';

const container = new Container();

// Bind repositories
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
container.bind<IServiceRepository>(TYPES.IServiceRepository).to(ServiceRepository);
container.bind<IBookingRepository>(TYPES.IBookingRepository).to(BookingRepository);

// Bind services
container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<ServiceService>(TYPES.ServiceService).to(ServiceService);
container.bind<BookingService>(TYPES.BookingService).to(BookingService);
container.bind<AdminService>(TYPES.AdminService).to(AdminService);

// Bind controllers
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<ServiceController>(TYPES.ServiceController).to(ServiceController);
container.bind<BookingController>(TYPES.BookingController).to(BookingController);
container.bind<AdminController>(TYPES.AdminController).to(AdminController);

export { container };

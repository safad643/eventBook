import { Router } from 'express';
import { container } from '../di/container.js';
import { TYPES } from '../di/types.js';
import { BookingController } from '../controllers/BookingController.js';
import { verifyToken } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createBookingSchema } from '../validators/bookingValidator.js';

const router = Router();
const controller = container.get<BookingController>(TYPES.BookingController);

router.post('/', verifyToken, validate(createBookingSchema), controller.createBooking);
router.get('/', verifyToken, controller.getMyBookings);
router.patch('/:id/cancel', verifyToken, controller.cancelBooking);

export default router;

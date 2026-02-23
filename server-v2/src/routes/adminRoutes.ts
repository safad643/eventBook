import { Router } from 'express';
import { container } from '../di/container.js';
import { TYPES } from '../di/types.js';
import { AdminController } from '../controllers/AdminController.js';
import { verifyToken } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { validate } from '../middleware/validate.js';
import { createServiceSchema, updateServiceSchema } from '../validators/serviceValidator.js';
import { upload } from '../config/cloudinary.js';

const router = Router();
const controller = container.get<AdminController>(TYPES.AdminController);

router.post(
    '/services',
    verifyToken,
    authorize('admin'),
    upload.array('images', 5),
    validate(createServiceSchema),
    controller.createService
);

router.put(
    '/services/:id',
    verifyToken,
    authorize('admin'),
    upload.array('images', 5),
    validate(updateServiceSchema),
    controller.updateService
);

router.delete('/services/:id', verifyToken, authorize('admin'), controller.deleteService);
router.get('/bookings', verifyToken, authorize('admin'), controller.getAdminBookings);
router.get('/dashboard', verifyToken, authorize('admin'), controller.getDashboard);

export default router;

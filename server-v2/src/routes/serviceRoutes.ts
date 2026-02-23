import { Router } from 'express';
import { container } from '../di/container.js';
import { TYPES } from '../di/types.js';
import { ServiceController } from '../controllers/ServiceController.js';

const router = Router();
const controller = container.get<ServiceController>(TYPES.ServiceController);

router.get('/', controller.getServices);
router.get('/:id', controller.getServiceById);

export default router;

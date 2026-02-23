import { Router } from 'express';
import { container } from '../di/container.js';
import { TYPES } from '../di/types.js';
import { AuthController } from '../controllers/AuthController.js';
import { verifyToken } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema, verifyOtpSchema, resendOtpSchema } from '../validators/authValidator.js';

const router = Router();
const controller = container.get<AuthController>(TYPES.AuthController);

router.post('/register', validate(registerSchema), controller.register);
router.post('/verify-otp', validate(verifyOtpSchema), controller.verifyOtp);
router.post('/resend-otp', validate(resendOtpSchema), controller.resendOtp);
router.post('/login', validate(loginSchema), controller.login);
router.get('/me', verifyToken, controller.getMe);
router.post('/logout', controller.logout);

export default router;

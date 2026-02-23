import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../di/types.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { BaseController } from './BaseController.js';
import { AuthService } from '../services/AuthService.js';

@injectable()
export class AuthController extends BaseController {
    constructor(@inject(TYPES.AuthService) private authService: AuthService) {
        super();
    }

    register = async (req: Request, res: Response): Promise<void> => {
        const result = await this.authService.register(req.body);

        if ('error' in result) {
            this.error(res, result.error!, HttpStatus.BAD_REQUEST);
            return;
        }

        if ('resent' in result) {
            this.success(res, { message: 'OTP sent to your email' });
            return;
        }

        this.success(res, { message: 'OTP sent to your email' }, HttpStatus.CREATED);
    };

    verifyOtp = async (req: Request, res: Response): Promise<void> => {
        const result = await this.authService.verifyOtp(req.body);

        if ('error' in result) {
            this.error(res, result.error!, HttpStatus.BAD_REQUEST);
            return;
        }

        res.status(HttpStatus.OK)
            .cookie('token', result.token, this.authService.cookieOptions)
            .json({ success: true, user: result.user });
    };

    resendOtp = async (req: Request, res: Response): Promise<void> => {
        const result = await this.authService.resendOtp(req.body);

        if ('error' in result) {
            this.error(res, result.error!, HttpStatus.BAD_REQUEST);
            return;
        }

        this.success(res, { message: 'OTP resent to your email' });
    };

    login = async (req: Request, res: Response): Promise<void> => {
        const result = await this.authService.login(req.body);

        if ('error' in result) {
            this.error(res, result.error!, result.status as HttpStatus);
            return;
        }

        res.status(HttpStatus.OK)
            .cookie('token', result.token, this.authService.cookieOptions)
            .json({ success: true, user: result.user });
    };

    getMe = async (req: Request, res: Response): Promise<void> => {
        const result = await this.authService.getMe((req as any).user.id);

        if ('error' in result) {
            this.error(res, result.error!, HttpStatus.NOT_FOUND);
            return;
        }

        this.success(res, result);
    };

    logout = (_req: Request, res: Response): void => {
        res.clearCookie('token').json({ success: true, message: 'Logged out' });
    };
}

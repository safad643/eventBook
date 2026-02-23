import { injectable, inject } from 'inversify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { TYPES } from '../di/types.js';
import { env } from '../config/env.js';
import { Messages } from '../constants/messages.js';
import { sendOtpToUser } from '../utils/sendEmail.js';
import type { IUserRepository } from '../repositories/interfaces/IUserRepository.js';
import type { IUser } from '../models/User.js';

@injectable()
export class AuthService {
    constructor(@inject(TYPES.IUserRepository) private repo: IUserRepository) { }

    generateToken(user: IUser): string {
        return jwt.sign({ id: user._id, role: user.role }, env.JWT_SECRET, {
            expiresIn: env.JWT_EXPIRE as string & jwt.SignOptions['expiresIn'],
        });
    }

    get cookieOptions() {
        return {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: (env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        };
    }

    async register(body: { name: string; email: string; password: string; role?: string }) {
        const { name, email, password, role } = body;

        const existingUser = await this.repo.findByEmail(email, '+otp +otpExpiry');

        if (existingUser && existingUser.isVerified) {
            return { error: 'Email already registered' } as const;
        }

        if (existingUser && !existingUser.isVerified) {
            await sendOtpToUser(existingUser);
            return { resent: true } as const;
        }

        const user = await this.repo.create({ name, email, password, role: role as IUser['role'] });
        await sendOtpToUser(user);

        return { created: true } as const;
    }

    async verifyOtp(body: { email: string; otp: string }) {
        const { email, otp } = body;

        const user = await this.repo.findByEmail(email, '+otp +otpExpiry');
        if (!user) return { error: Messages.USER_NOT_FOUND } as const;

        if (user.isVerified) return { error: 'Email is already verified' } as const;

        if (!user.otp || !user.otpExpiry || user.otpExpiry < new Date()) {
            return { error: 'OTP has expired, please request a new one' } as const;
        }

        const isMatch = await bcrypt.compare(otp, user.otp);
        if (!isMatch) return { error: 'Invalid OTP' } as const;

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save({ validateModifiedOnly: true });

        const token = this.generateToken(user);
        return {
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        };
    }

    async resendOtp(body: { email: string }) {
        const user = await this.repo.findByEmail(body.email, '+otp +otpExpiry');
        if (!user) return { error: Messages.USER_NOT_FOUND } as const;
        if (user.isVerified) return { error: 'Email is already verified' } as const;

        await sendOtpToUser(user);
        return { sent: true } as const;
    }

    async login(body: { email: string; password: string }) {
        const { email, password } = body;

        const user = await this.repo.findByEmail(email, '+password');
        if (!user) return { error: Messages.INVALID_CREDENTIALS, status: 401 } as const;

        if (!user.isVerified) return { error: 'Please verify your email first', status: 403 } as const;

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return { error: Messages.INVALID_CREDENTIALS, status: 401 } as const;

        const token = this.generateToken(user);
        return {
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        };
    }

    async getMe(userId: string) {
        const user = await this.repo.findById(userId);
        if (!user) return { error: Messages.USER_NOT_FOUND } as const;

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
            },
        };
    }
}

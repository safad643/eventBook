import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { User, type IUser } from '../models/User.js';

const sendEmail = async ({ to, subject, html }: { to: string; subject: string; html: string }): Promise<void> => {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'api-key': env.EMAIL_PASS,
        },
        body: JSON.stringify({
            sender: { email: env.EMAIL_USER },
            to: [{ email: to }],
            subject,
            htmlContent: html,
        }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Brevo email failed: ${response.status} ${response.statusText} - ${text}`);
    }
};

export const sendOtpToUser = async (user: IUser): Promise<void> => {
    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = await bcrypt.hash(otp, 10);
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save({ validateModifiedOnly: true });

    await sendEmail({
        to: user.email,
        subject: 'EventBook – Verify Your Email',
        html: `<p>Your verification code is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`,
    });
};

export const sendBookingEmail = async (
    userId: string,
    booking: any,
    start: Date,
    end: Date,
    totalDays: number,
    totalPrice: number
): Promise<void> => {
    try {
        const user = await User.findById(userId);
        if (!user) return;

        await sendEmail({
            to: user.email,
            subject: 'Booking Confirmation — Event Booking Platform',
            html: `
                <h2>Booking Confirmed!</h2>
                <p><strong>Service:</strong> ${booking.service.title}</p>
                <p><strong>Dates:</strong> ${start.toISOString().split('T')[0]} to ${end.toISOString().split('T')[0]}</p>
                <p><strong>Total Days:</strong> ${totalDays}</p>
                <p><strong>Total Price:</strong> ₹${totalPrice}</p>
                <p><strong>Status:</strong> Confirmed</p>
            `,
        });
    } catch (emailError: any) {
        console.error('Booking email failed:', emailError.message);
    }
};

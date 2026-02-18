const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const transporter = require('../config/nodemailer');
const User = require('../models/User');

const sendEmail = async ({ to, subject, html }) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
    });
};

const sendOtpToUser = async (user) => {
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

const sendBookingEmail = async (userId, booking, start, end, totalDays, totalPrice) => {
    try {
        const user = await User.findById(userId);
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
    } catch (emailError) {
        console.error('Booking email failed:', emailError.message);
    }
};

module.exports = sendEmail;
module.exports.sendOtpToUser = sendOtpToUser;
module.exports.sendBookingEmail = sendBookingEmail;

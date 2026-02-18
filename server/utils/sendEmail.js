const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const transporter = require('../config/nodemailer');

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

module.exports = sendEmail;
module.exports.sendOtpToUser = sendOtpToUser;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOtpToUser } = require('../utils/sendEmail');

const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

const register = async (req, res) => {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email }).select('+otp +otpExpiry');

    if (existingUser && existingUser.isVerified) {
        res.status(400).json({ success: false, error: 'Email already registered' });
        return;
    }

    // If unverified user exists, resend OTP instead of creating a duplicate
    if (existingUser && !existingUser.isVerified) {
        await sendOtpToUser(existingUser);
        res.status(200).json({ success: true, message: 'OTP sent to your email' });
        return;
    }

    const user = await User.create({ name, email, password, role });
    await sendOtpToUser(user);

    res.status(201).json({ success: true, message: 'OTP sent to your email' });
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select('+otp +otpExpiry');
    if (!user) {
        res.status(400).json({ success: false, error: 'User not found' });
        return;
    }

    if (user.isVerified) {
        res.status(400).json({ success: false, error: 'Email is already verified' });
        return;
    }

    if (!user.otp || !user.otpExpiry || user.otpExpiry < Date.now()) {
        res.status(400).json({ success: false, error: 'OTP has expired, please request a new one' });
        return;
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
        res.status(400).json({ success: false, error: 'Invalid OTP' });
        return;
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save({ validateModifiedOnly: true });

    const token = generateToken(user);

    res.status(200).cookie('token', token, cookieOptions).json({
        success: true,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
};

const resendOtp = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email }).select('+otp +otpExpiry');
    if (!user) {
        res.status(400).json({ success: false, error: 'User not found' });
        return;
    }

    if (user.isVerified) {
        res.status(400).json({ success: false, error: 'Email is already verified' });
        return;
    }

    await sendOtpToUser(user);

    res.status(200).json({ success: true, message: 'OTP resent to your email' });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
        return;
    }

    if (!user.isVerified) {
        res.status(403).json({ success: false, error: 'Please verify your email first' });
        return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
        return;
    }

    const token = generateToken(user);

    res.status(200).cookie('token', token, cookieOptions).json({
        success: true,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
};

const getMe = async (req, res) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        },
    });
};

const logout = (req, res) => {
    res.clearCookie('token').json({ success: true, message: 'Logged out' });
};

module.exports = { register, verifyOtp, resendOtp, login, getMe, logout };

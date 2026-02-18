import { useState, useRef, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks';
import Spinner from '@/components/common/Spinner';

const COOLDOWN = 60;

export default function VerifyOtpPage() {
    const { user, verifyOtp, resendOtp } = useAuth();
    const location = useLocation();
    const email = location.state?.email;

    const [otp, setOtp] = useState(Array(6).fill(''));
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(COOLDOWN);
    const inputsRef = useRef([]);

    // Cooldown timer for resend
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    // If no email in state, redirect to register
    if (!email) return <Navigate to="/register" replace />;
    if (user) return <Navigate to="/" replace />;

    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').trim();
        if (!/^\d{6}$/.test(pasted)) return;

        const digits = pasted.split('');
        setOtp(digits);
        inputsRef.current[5]?.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length !== 6) {
            toast.error('Please enter the full 6-digit code');
            return;
        }

        setLoading(true);
        try {
            await verifyOtp(email, code);
        } catch (error) {
            const msg = error.response?.data?.error || 'Verification failed';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            await resendOtp(email);
            setCooldown(COOLDOWN);
        } catch (error) {
            const msg = error.response?.data?.error || 'Failed to resend OTP';
            toast.error(msg);
        }
    };

    const inputClass =
        'h-12 w-12 rounded-lg border border-gray-300 text-center text-xl font-semibold focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none';

    return (
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md text-center">
                <h1 className="text-2xl font-bold text-gray-900">Verify Your Email</h1>
                <p className="mt-2 text-sm text-gray-600">
                    We sent a 6-digit code to <span className="font-medium text-gray-800">{email}</span>
                </p>

                <form onSubmit={handleSubmit} className="mt-8">
                    <div className="flex justify-center gap-3" onPaste={handlePaste}>
                        {otp.map((digit, i) => (
                            <input
                                key={i}
                                ref={(el) => (inputsRef.current[i] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(i, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                className={inputClass}
                                autoFocus={i === 0}
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-8 flex w-full items-center justify-center rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Spinner size="sm" /> : 'Verify Email'}
                    </button>
                </form>

                <p className="mt-6 text-sm text-gray-600">
                    Didn't receive the code?{' '}
                    {cooldown > 0 ? (
                        <span className="text-gray-400">Resend in {cooldown}s</span>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResend}
                            className="font-medium text-primary-600 hover:text-primary-700"
                        >
                            Resend OTP
                        </button>
                    )}
                </p>
            </div>
        </div>
    );
}

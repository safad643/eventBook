import { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '@/api/axios';

export const AuthContext = createContext(null);



export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    /** Check if the user has a valid session cookie on mount. */
    const checkAuth = useCallback(async () => {
        try {
            const { data } = await API.get('/auth/me');
            setUser(data.user);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (email, password) => {
        const { data } = await API.post('/auth/login', { email, password });
        const loggedInUser = data.user;
        setUser(loggedInUser);
        toast.success('Logged in successfully');

        const isAdmin = loggedInUser?.role === 'admin';
        if (isAdmin) {
            navigate('/admin', { replace: true });
        } else {
            const redirectTo = location.state?.from?.pathname || '/';
            navigate(redirectTo, { replace: true });
        }
    };

    const register = async (name, email, password, role) => {
        await API.post('/auth/register', { name, email, password, role });
        toast.success('OTP sent to your email');
        navigate('/verify-otp', { state: { email } });
    };

    const verifyOtp = async (email, otp) => {
        const { data } = await API.post('/auth/verify-otp', { email, otp });
        const verifiedUser = data.user;
        setUser(verifiedUser);
        toast.success('Email verified successfully');

        const isAdmin = verifiedUser?.role === 'admin';
        navigate(isAdmin ? '/admin' : '/', { replace: true });
    };

    const resendOtp = async (email) => {
        await API.post('/auth/resend-otp', { email });
        toast.success('OTP resent to your email');
    };

    const logout = async () => {
        await API.post('/auth/logout');
        setUser(null);
        toast.success('Logged out');
        navigate('/', { replace: true });
    };

    const value = { user, loading, login, register, verifyOtp, resendOtp, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

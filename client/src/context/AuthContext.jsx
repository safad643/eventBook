import { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '@/api/axios';

export const AuthContext = createContext(null);

/**
 * Extracts a user-friendly error message from an API error response.
 */
const getErrorMessage = (error) => {
    return (
        error.response?.data?.error ||
        error.response?.data?.errors?.join(', ') ||
        'Something went wrong'
    );
};

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
        setUser(data.user);
        toast.success('Logged in successfully');

        const redirectTo = location.state?.from?.pathname || '/';
        navigate(redirectTo, { replace: true });
    };

    const register = async (name, email, password, role) => {
        const { data } = await API.post('/auth/register', { name, email, password, role });
        setUser(data.user);
        toast.success('Account created successfully');

        const redirectTo = location.state?.from?.pathname || '/';
        navigate(redirectTo, { replace: true });
    };

    const logout = async () => {
        await API.post('/auth/logout');
        setUser(null);
        toast.success('Logged out');
        navigate('/', { replace: true });
    };

    const value = { user, loading, login, register, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

import axios from 'axios';

const apiRoot = import.meta.env.VITE_API_TARGET;
const API = axios.create({
    // In production, point directly at the deployed backend (VITE_API_TARGET),
    // which should be the backend root, e.g. https://your-backend.onrender.com
    // In development (when not set), fall back to the relative /api path.
    baseURL: apiRoot ? `${apiRoot}/api` : '/api',
    withCredentials: true,
});

/**
 * Response interceptor — handles 401 globally.
 * If the server responds with 401 and the user isn't on login/register,
 * we redirect to /login so they can re-authenticate.
 */
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const path = window.location.pathname;
            const isAuthPage = path === '/login' || path === '/register' || path === '/verify-otp';

            if (!isAuthPage) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default API;

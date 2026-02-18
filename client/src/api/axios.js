import axios from 'axios';

const API = axios.create({
    baseURL: '/api',
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
            const isAuthPage = path === '/login' || path === '/register';

            if (!isAuthPage) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default API;

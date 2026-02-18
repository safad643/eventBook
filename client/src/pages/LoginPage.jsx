import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks';
import Spinner from '../components/common/Spinner';

export default function LoginPage() {
    const { user, login } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    /* Already logged in → redirect */
    if (user) return <Navigate to="/" replace />;

    const validate = () => {
        const errs = {};
        if (!form.email.trim()) errs.email = 'Email is required';
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email format';
        if (!form.password) errs.password = 'Password is required';
        else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await login(form.email, form.password);
        } catch (error) {
            const msg = error.response?.data?.error || error.response?.data?.errors?.join(', ') || 'Login failed';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    };

    const inputClass =
        'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none';

    return (
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <h1 className="text-center text-2xl font-bold text-gray-900">Welcome Back</h1>
                <p className="mt-2 text-center text-sm text-gray-600">Sign in to your account</p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="you@example.com" />
                        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                        <input id="password" name="password" type="password" value={form.password} onChange={handleChange} className={inputClass} placeholder="••••••••" />
                        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Spinner size="sm" /> : 'Sign In'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">Register</Link>
                </p>
            </div>
        </div>
    );
}

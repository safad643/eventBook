import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks';
import Spinner from '../components/common/Spinner';

export default function RegisterPage() {
    const { user, register } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    if (user) return <Navigate to="/" replace />;

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = 'Name is required';
        else if (form.name.trim().length < 2) errs.name = 'Minimum 2 characters';
        if (!form.email.trim()) errs.email = 'Email is required';
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email format';
        if (!form.password) errs.password = 'Password is required';
        else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
        if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await register(form.name, form.email, form.password, form.role);
        } catch (error) {
            const msg = error.response?.data?.error || error.response?.data?.errors?.join(', ') || 'Registration failed';
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
                <h1 className="text-center text-2xl font-bold text-gray-900">Create an Account</h1>
                <p className="mt-2 text-center text-sm text-gray-600">Join EventBook today</p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                        <input id="name" name="name" type="text" value={form.name} onChange={handleChange} className={inputClass} placeholder="John Doe" />
                        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="you@example.com" />
                        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                        <input id="password" name="password" type="password" value={form.password} onChange={handleChange} className={inputClass} placeholder="••••••••" />
                        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} className={inputClass} placeholder="••••••••" />
                        {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
                    </div>

                    {/* Role */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Account Type</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 text-sm text-gray-700">
                                <input type="radio" name="role" value="user" checked={form.role === 'user'} onChange={handleChange} className="text-primary-600 focus:ring-primary-500" />
                                User
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-700">
                                <input type="radio" name="role" value="admin" checked={form.role === 'admin'} onChange={handleChange} className="text-primary-600 focus:ring-primary-500" />
                                Service Provider
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Spinner size="sm" /> : 'Create Account'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">Login</Link>
                </p>
            </div>
        </div>
    );
}

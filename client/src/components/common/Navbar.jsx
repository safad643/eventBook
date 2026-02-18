import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { HiOutlineBars3, HiOutlineXMark } from 'react-icons/hi2';
import { useAuth } from '@/hooks';

const linkBase = 'text-sm font-medium transition-colors';
const activeClass = 'text-primary-600';
const inactiveClass = 'text-gray-600 hover:text-gray-900';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const navLinks = [
        { to: '/services', label: 'Services' },
        ...(user ? [{ to: '/bookings', label: 'My Bookings' }] : []),
        ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin Dashboard' }] : []),
    ];

    const handleLogout = async () => {
        setMenuOpen(false);
        await logout();
    };

    return (
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Brand */}
                <Link to="/" className="text-xl font-bold text-primary-600">
                    EventBook
                </Link>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-6 md:flex">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) => `${linkBase} ${isActive ? activeClass : inactiveClass}`}
                        >
                            {link.label}
                        </NavLink>
                    ))}

                    {user ? (
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-700">{user.name}</span>
                            {user.role === 'admin' && (
                                <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
                                    Admin
                                </span>
                            )}
                            <button
                                onClick={handleLogout}
                                className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                to="/login"
                                className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </nav>

                {/* Mobile hamburger */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <HiOutlineXMark className="h-6 w-6" /> : <HiOutlineBars3 className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <nav className="border-t border-gray-200 bg-white px-4 pb-4 md:hidden">
                    <div className="flex flex-col gap-2 pt-2">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={() => setMenuOpen(false)}
                                className={({ isActive }) =>
                                    `rounded-lg px-3 py-2 ${linkBase} ${isActive ? activeClass : inactiveClass}`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}

                        {user ? (
                            <>
                                <div className="mt-2 flex items-center gap-2 border-t border-gray-100 px-3 pt-3">
                                    <span className="text-sm text-gray-700">{user.name}</span>
                                    {user.role === 'admin' && (
                                        <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
                                            Admin
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="mt-1 rounded-lg bg-gray-100 px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="mt-2 flex flex-col gap-2 border-t border-gray-100 pt-3">
                                <Link
                                    to="/login"
                                    onClick={() => setMenuOpen(false)}
                                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMenuOpen(false)}
                                    className="rounded-lg bg-primary-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-primary-700"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>
            )}
        </header>
    );
}

import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { HiOutlineBars3, HiOutlineXMark, HiArrowRightStartOnRectangle } from 'react-icons/hi2';
import { useAuth } from '@/hooks';

const linkBase = 'text-sm font-medium transition-colors';
const activeClass = 'text-primary-600';
const inactiveClass = 'text-gray-600 hover:text-gray-900';

function UserAvatar({ name }) {
    const initial = name?.charAt(0)?.toUpperCase() || '?';
    return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white shadow-sm">
            {initial}
        </div>
    );
}

export default function Navbar() {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const isAdmin = user?.role === 'admin';

    const navLinks = !isAdmin
        ? [
              { to: '/services', label: 'Services' },
              ...(user ? [{ to: '/bookings', label: 'My Bookings' }] : []),
          ]
        : [];

    const handleLogout = async () => {
        setMenuOpen(false);
        await logout();
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
            <div className="flex h-16 w-full items-center px-4 sm:px-6 lg:px-8">
                {/* Left: Brand */}
                <div className="flex flex-1 items-center">
                    <Link to="/" className="text-xl font-bold text-primary-600">
                        EventBook
                    </Link>
                </div>

                {/* Center: Desktop nav links */}
                <nav className="hidden flex-1 items-center justify-center gap-6 md:flex">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) => `${linkBase} ${isActive ? activeClass : inactiveClass}`}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Right: User / Auth actions */}
                <div className="hidden flex-1 items-center justify-end md:flex">
                    {user ? (
                        <div className="flex items-center gap-2.5 rounded-full border border-gray-200 py-1.5 pl-1.5 pr-3 shadow-sm">
                            <UserAvatar name={user.name} />
                            <span className="text-sm font-medium text-gray-800">{user.name}</span>
                            <div className="mx-0.5 h-4 w-px bg-gray-200" />
                            <button
                                onClick={handleLogout}
                                className="rounded-full p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                title="Logout"
                            >
                                <HiArrowRightStartOnRectangle className="h-4.5 w-4.5" />
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
                </div>

                {/* Mobile hamburger */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="ml-auto rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
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
                            <div className="mt-2 border-t border-gray-100 pt-3">
                                <div className="flex items-center justify-between px-3">
                                    <div className="flex items-center gap-2.5">
                                        <UserAvatar name={user.name} />
                                        <span className="text-sm font-medium text-gray-800">{user.name}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                        title="Logout"
                                    >
                                        <HiArrowRightStartOnRectangle className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
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

import { Outlet, NavLink } from 'react-router-dom';
import { HiOutlineSquares2X2, HiOutlineBriefcase, HiOutlineClipboardDocumentList } from 'react-icons/hi2';
import Navbar from '@/components/common/Navbar';

const sidebarLinks = [
    { to: '/admin', label: 'Dashboard', icon: HiOutlineSquares2X2, end: true },
    { to: '/admin/services', label: 'Services', icon: HiOutlineBriefcase },
    { to: '/admin/bookings', label: 'Bookings', icon: HiOutlineClipboardDocumentList },
];

const linkBase =
    'flex flex-col items-center justify-center gap-1 text-xs font-semibold transition-colors rounded-2xl px-4 py-2';
const activeClass = 'bg-primary-600 text-white shadow-lg shadow-primary-500/50';
const inactiveClass = 'text-gray-600 hover:text-gray-900';

export default function AdminLayout() {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />

            <div className="flex flex-1 flex-col bg-gray-50">
                {/* Content */}
                <div className="flex-1 overflow-auto p-4 pb-24 sm:p-6 sm:pb-28 lg:p-8 lg:pb-32">
                    <div className="mx-auto max-w-6xl">
                        <Outlet />
                    </div>
                </div>

                {/* Floating tab bar */}
                <nav className="pointer-events-none sticky bottom-5 z-30 flex justify-center">
                    <div className="pointer-events-auto inline-flex items-center gap-3 rounded-3xl border border-gray-200 bg-white/95 px-4 py-2.5 shadow-xl shadow-black/10 backdrop-blur-sm sm:px-5 sm:py-3">
                        {sidebarLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                className={({ isActive }) => `${linkBase} ${isActive ? activeClass : inactiveClass}`}
                            >
                                <link.icon className="h-6 w-6" />
                                <span className="leading-none">{link.label}</span>
                            </NavLink>
                        ))}
                    </div>
                </nav>
            </div>
        </div>
    );
}

import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
    HiOutlineSquares2X2,
    HiOutlinePlusCircle,
    HiOutlineClipboardDocumentList,
    HiOutlineArrowLeftOnRectangle,
    HiOutlineBars3,
} from 'react-icons/hi2';
import Navbar from '@/components/common/Navbar';

const sidebarLinks = [
    { to: '/admin', label: 'Dashboard', icon: HiOutlineSquares2X2, end: true },
    { to: '/admin/services/create', label: 'Create Service', icon: HiOutlinePlusCircle },
    { to: '/admin/bookings', label: 'Bookings', icon: HiOutlineClipboardDocumentList },
];

const linkBase = 'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors';
const activeClass = 'bg-primary-50 text-primary-700';
const inactiveClass = 'text-gray-600 hover:bg-gray-50 hover:text-gray-900';

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />

            <div className="flex flex-1">
                {/* Mobile sidebar toggle */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="fixed bottom-4 right-4 z-30 rounded-full bg-primary-600 p-3 text-white shadow-lg lg:hidden"
                    aria-label="Toggle sidebar"
                >
                    <HiOutlineBars3 className="h-6 w-6" />
                </button>

                {/* Sidebar backdrop (mobile) */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-20 bg-black/50 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-20 mt-16 w-64 transform border-r border-gray-200 bg-white transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                    <nav className="flex flex-col gap-1 p-4">
                        {sidebarLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) => `${linkBase} ${isActive ? activeClass : inactiveClass}`}
                            >
                                <link.icon className="h-5 w-5" />
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                </aside>

                {/* Content */}
                <div className="flex-1 overflow-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

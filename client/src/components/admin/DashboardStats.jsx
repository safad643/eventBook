import {
    HiOutlineBriefcase,
    HiOutlineCalendarDays,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineBanknotes,
} from 'react-icons/hi2';

const cards = [
    { key: 'totalServices', label: 'Total Services', icon: HiOutlineBriefcase, color: 'bg-blue-50 text-blue-600' },
    { key: 'totalBookings', label: 'Total Bookings', icon: HiOutlineCalendarDays, color: 'bg-purple-50 text-purple-600' },
    { key: 'confirmedBookings', label: 'Confirmed', icon: HiOutlineCheckCircle, color: 'bg-green-50 text-green-600' },
    { key: 'cancelledBookings', label: 'Cancelled', icon: HiOutlineXCircle, color: 'bg-red-50 text-red-600' },
    { key: 'totalRevenue', label: 'Revenue', icon: HiOutlineBanknotes, color: 'bg-amber-50 text-amber-600', isCurrency: true },
];

export default function DashboardStats({ stats }) {
    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {cards.map(({ key, label, icon: Icon, color, isCurrency }) => (
                <div key={key} className="rounded-lg bg-white p-4 shadow-md">
                    <div className={`inline-flex rounded-lg p-2 ${color}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-3 text-2xl font-bold text-gray-900">
                        {isCurrency ? `₹${(stats?.[key] || 0).toLocaleString('en-IN')}` : stats?.[key] ?? 0}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">{label}</p>
                </div>
            ))}
        </div>
    );
}

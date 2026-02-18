import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useAdminDashboard } from '../../hooks';
import DashboardStats from '../../components/admin/DashboardStats';
import AdminServiceCard from '../../components/admin/AdminServiceCard';
import Spinner from '../../components/common/Spinner';

const STATUS_STYLES = {
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

export default function AdminDashboardPage() {
    const { stats, services, recentBookings, loading, refetch } = useAdminDashboard();

    const handleDeleteService = () => {
        refetch();
    };

    if (loading) return <Spinner className="py-20" />;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-600">Overview of your services and bookings</p>
            </div>

            {/* Stats */}
            <DashboardStats stats={stats} />

            {/* Recent Bookings */}
            <div>
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
                    <Link to="/admin/bookings" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                        View All →
                    </Link>
                </div>

                {recentBookings.length === 0 ? (
                    <p className="mt-4 text-sm text-gray-500">No bookings yet.</p>
                ) : (
                    <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['Customer', 'Service', 'Dates', 'Amount', 'Status'].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {recentBookings.map((b) => (
                                    <tr key={b._id} className="hover:bg-gray-50">
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{b.user?.name || '—'}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{b.service?.title || '—'}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                            {format(new Date(b.startDate), 'MMM d')} — {format(new Date(b.endDate), 'MMM d')}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                                            ₹{b.totalPrice?.toLocaleString('en-IN')}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[b.status]}`}>
                                                {b.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* My Services */}
            <div>
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">My Services</h2>
                    <Link
                        to="/admin/services/create"
                        className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                    >
                        + Create Service
                    </Link>
                </div>

                {services.length === 0 ? (
                    <div className="mt-4 flex flex-col items-center rounded-lg border-2 border-dashed border-gray-300 py-12">
                        <p className="text-gray-500">You haven&apos;t created any services yet</p>
                        <Link
                            to="/admin/services/create"
                            className="mt-3 text-sm font-medium text-primary-600 hover:text-primary-700"
                        >
                            Create your first service →
                        </Link>
                    </div>
                ) : (
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((service) => (
                            <AdminServiceCard key={service._id} service={service} onDelete={handleDeleteService} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

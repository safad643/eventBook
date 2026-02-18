import { useAdminDashboard } from '@/hooks';
import DashboardStats from '@/components/admin/DashboardStats';
import RevenueChart from '@/components/admin/RevenueChart';
import Spinner from '@/components/common/Spinner';

export default function AdminDashboardPage() {
    const { stats, chartData, loading } = useAdminDashboard();

    if (loading) return <Spinner className="py-20" />;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-600">Overview of your services and bookings</p>
            </div>

            <DashboardStats stats={stats} />

            <RevenueChart data={chartData} />
        </div>
    );
}

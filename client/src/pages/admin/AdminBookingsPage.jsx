import { useAdminBookings } from '../../hooks';
import AdminBookingTable from '../../components/admin/AdminBookingTable';
import Spinner from '../../components/common/Spinner';

export default function AdminBookingsPage() {
    const { bookings, loading } = useAdminBookings();

    if (loading) return <Spinner className="py-20" />;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Bookings on My Services</h1>
            <p className="mt-1 text-sm text-gray-600">
                {bookings.length} booking{bookings.length !== 1 ? 's' : ''} total
            </p>

            <div className="mt-6">
                <AdminBookingTable bookings={bookings} />
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import API from '../../api/axios';
import AdminBookingTable from '../../components/admin/AdminBookingTable';
import Spinner from '../../components/common/Spinner';

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        const fetchBookings = async () => {
            try {
                const { data } = await API.get('/admin/bookings', { signal: controller.signal });
                setBookings(data.bookings);
            } catch (error) {
                if (error.name !== 'CanceledError') {
                    console.error('Failed to load bookings:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
        return () => controller.abort();
    }, []);

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

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBookings } from '../hooks';
import BookingCard from '../components/booking/BookingCard';
import Spinner from '../components/common/Spinner';

const TABS = ['all', 'confirmed', 'cancelled'];

export default function MyBookingsPage() {
    const { bookings, loading, refetch } = useBookings();
    const [activeTab, setActiveTab] = useState('all');

    const handleUpdate = (bookingId, newStatus) => {
        refetch();
    };

    const filtered = activeTab === 'all' ? bookings : bookings.filter((b) => b.status === activeTab);

    if (loading) return <Spinner className="py-20" />;

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>

            {bookings.length === 0 ? (
                <div className="mt-12 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-16">
                    <p className="text-lg font-medium text-gray-500">You haven&apos;t made any bookings yet</p>
                    <Link
                        to="/services"
                        className="mt-3 text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                        Browse Services →
                    </Link>
                </div>
            ) : (
                <>
                    {/* Tabs */}
                    <div className="mt-4 flex gap-1 rounded-lg bg-gray-100 p-1">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium capitalize transition-colors ${activeTab === tab
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Booking list */}
                    <div className="mt-6 space-y-4">
                        {filtered.length === 0 ? (
                            <p className="py-8 text-center text-gray-500">
                                No {activeTab} bookings found.
                            </p>
                        ) : (
                            filtered.map((booking) => (
                                <BookingCard key={booking._id} booking={booking} onUpdate={handleUpdate} />
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

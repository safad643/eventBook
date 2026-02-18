import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { HiOutlineMapPin } from 'react-icons/hi2';
import ConfirmModal from '../common/ConfirmModal';
import { useCancelBooking } from '../../hooks';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

const PLACEHOLDER_IMG = 'https://placehold.co/400x250/e0e7ff/4f46e5?text=No+Image';

export default function BookingCard({ booking, onUpdate }) {
    const [showConfirm, setShowConfirm] = useState(false);
    const { cancelBooking, loading: cancelling } = useCancelBooking();

    const { service, startDate, endDate, totalDays, totalPrice, status, createdAt } = booking;
    const image = service?.images?.[0] || PLACEHOLDER_IMG;

    const handleCancel = async () => {
        try {
            await cancelBooking(booking._id);
            toast.success('Booking cancelled');
            onUpdate(booking._id, 'cancelled');
        } catch (error) {
            const msg = error.response?.data?.error || 'Failed to cancel booking';
            toast.error(msg);
        } finally {
            setShowConfirm(false);
        }
    };

    return (
        <>
            <div className="overflow-hidden rounded-lg bg-white shadow-md">
                <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="h-48 w-full sm:h-auto sm:w-48 sm:shrink-0">
                        <img src={image} alt={service?.title} className="h-full w-full object-cover" />
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col p-4">
                        <div className="flex items-start justify-between">
                            <Link
                                to={`/services/${service?._id}`}
                                className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                            >
                                {service?.title || 'Service Removed'}
                            </Link>
                            <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[status]}`}>
                                {status}
                            </span>
                        </div>

                        {service?.category && (
                            <span className="mt-1 text-sm capitalize text-gray-500">{service.category}</span>
                        )}

                        {service?.location && (
                            <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                                <HiOutlineMapPin className="h-3.5 w-3.5" />
                                <span className="capitalize">{service.location}</span>
                            </div>
                        )}

                        <div className="mt-3 text-sm text-gray-600">
                            <p>
                                {format(new Date(startDate), 'MMM d, yyyy')} — {format(new Date(endDate), 'MMM d, yyyy')}
                            </p>
                            <p className="mt-1">
                                {totalDays} day{totalDays > 1 ? 's' : ''} · <span className="font-semibold text-gray-900">₹{totalPrice?.toLocaleString('en-IN')}</span>
                            </p>
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-3">
                            <span className="text-xs text-gray-400">
                                Booked on {format(new Date(createdAt), 'MMM d, yyyy')}
                            </span>

                            {status === 'confirmed' && (
                                <button
                                    onClick={() => setShowConfirm(true)}
                                    disabled={cancelling}
                                    className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                                >
                                    Cancel Booking
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={showConfirm}
                title="Cancel Booking"
                message="Are you sure you want to cancel this booking? This action cannot be undone."
                confirmText="Yes, Cancel"
                onConfirm={handleCancel}
                onCancel={() => setShowConfirm(false)}
            />
        </>
    );
}

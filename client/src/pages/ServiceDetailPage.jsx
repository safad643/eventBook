import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import toast from 'react-hot-toast';
import { HiOutlineMapPin, HiOutlinePhone } from 'react-icons/hi2';
import { useAuth, useService, useCreateBooking } from '../hooks';
import BookingDatePicker from '../components/booking/BookingDatePicker';
import Spinner from '../components/common/Spinner';
import 'react-datepicker/dist/react-datepicker.css';

const CATEGORY_COLORS = {
    venue: 'bg-purple-100 text-purple-700',
    hotel: 'bg-blue-100 text-blue-700',
    caterer: 'bg-orange-100 text-orange-700',
    cameraman: 'bg-cyan-100 text-cyan-700',
    dj: 'bg-pink-100 text-pink-700',
    decorator: 'bg-green-100 text-green-700',
    other: 'bg-gray-100 text-gray-700',
};

const PLACEHOLDER_IMG = 'https://placehold.co/600x400/e0e7ff/4f46e5?text=No+Image';

export default function ServiceDetailPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { service, loading, error } = useService(id);
    const { createBooking, loading: booking } = useCreateBooking();

    const [selectedImage, setSelectedImage] = useState(0);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    /* Parse availability dates for the calendar */
    const availableDates = useMemo(
        () => (service?.availabilityDates || []).map((d) => new Date(d)),
        [service]
    );

    /* Compute totals */
    const totalDays = startDate && endDate
        ? Math.round((endDate - startDate) / (24 * 60 * 60 * 1000)) + 1
        : 0;
    const totalPrice = totalDays * (service?.pricePerDay || 0);

    const handleBooking = async () => {
        if (!startDate || !endDate) return;
        try {
            await createBooking({
                serviceId: id,
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
            });
            toast.success('Booking confirmed!');
            navigate('/bookings');
        } catch (err) {
            const msg = err.response?.data?.error || err.response?.data?.errors?.join(', ') || 'Booking failed';
            toast.error(msg);
        }
    };

    if (loading) return <Spinner className="py-20" />;
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="text-lg text-gray-500">{error}</p>
                <Link to="/services" className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-700">
                    ← Back to Services
                </Link>
            </div>
        );
    }
    if (!service) return null;

    const images = service.images?.length ? service.images : [PLACEHOLDER_IMG];
    const colorClass = CATEGORY_COLORS[service.category] || CATEGORY_COLORS.other;

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Link to="/services" className="text-sm text-gray-500 hover:text-gray-700">← Back to Services</Link>

            <div className="mt-6 grid gap-8 lg:grid-cols-3">
                {/* Left / Main content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Image gallery */}
                    <div>
                        <img
                            src={images[selectedImage]}
                            alt={service.title}
                            className="h-80 w-full rounded-lg object-cover sm:h-96"
                        />
                        {images.length > 1 && (
                            <div className="mt-3 flex gap-2 overflow-x-auto">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${selectedImage === i ? 'border-primary-500' : 'border-transparent'
                                            }`}
                                    >
                                        <img src={img} alt={`Thumbnail ${i + 1}`} className="h-full w-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div>
                        <div className="flex items-start justify-between">
                            <div>
                                <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize ${colorClass}`}>
                                    {service.category}
                                </span>
                                <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">{service.title}</h1>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-primary-600">
                                    ₹{service.pricePerDay?.toLocaleString('en-IN')}
                                </p>
                                <p className="text-sm text-gray-500">per day</p>
                            </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1 capitalize">
                                <HiOutlineMapPin className="h-4 w-4" /> {service.location}
                            </span>
                            {service.admin?.name && <span>Listed by {service.admin.name}</span>}
                        </div>

                        {/* Description */}
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold text-gray-900">Description</h2>
                            <p className="mt-2 whitespace-pre-line text-gray-600">{service.description}</p>
                        </div>

                        {/* Contact */}
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
                            <p className="mt-2 flex items-center gap-1 text-gray-600">
                                <HiOutlinePhone className="h-4 w-4" /> {service.contactDetails}
                            </p>
                        </div>

                        {/* Availability calendar (read-only display) */}
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold text-gray-900">Availability</h2>
                            <div className="mt-2">
                                <DatePicker
                                    inline
                                    highlightDates={availableDates}
                                    readOnly
                                    monthsShown={2}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right / Booking panel */}
                <div className="lg:col-span-1">
                    <div className="sticky top-20 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
                        <h2 className="text-lg font-semibold text-gray-900">Book This Service</h2>

                        {!user ? (
                            <div className="mt-4">
                                <p className="text-sm text-gray-600">Please log in to make a booking.</p>
                                <Link
                                    to="/login"
                                    state={{ from: { pathname: `/services/${id}` } }}
                                    className="mt-3 block rounded-lg bg-primary-600 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-primary-700"
                                >
                                    Log In to Book
                                </Link>
                            </div>
                        ) : (
                            <div className="mt-4">
                                <BookingDatePicker
                                    availableDates={service.availabilityDates}
                                    startDate={startDate}
                                    endDate={endDate}
                                    onStartChange={setStartDate}
                                    onEndChange={setEndDate}
                                />

                                {totalDays > 0 && (
                                    <div className="mt-4 space-y-2 rounded-lg bg-gray-50 p-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Start Date</span>
                                            <span className="font-medium text-gray-900">{format(startDate, 'MMM d, yyyy')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">End Date</span>
                                            <span className="font-medium text-gray-900">{format(endDate, 'MMM d, yyyy')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Days</span>
                                            <span className="font-medium text-gray-900">{totalDays}</span>
                                        </div>
                                        <hr className="border-gray-200" />
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-gray-900">Total Price</span>
                                            <span className="font-bold text-primary-600">₹{totalPrice.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handleBooking}
                                    disabled={!startDate || !endDate || booking}
                                    className="mt-4 w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {booking ? 'Confirming…' : 'Confirm Booking'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

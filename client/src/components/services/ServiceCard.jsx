import { Link } from 'react-router-dom';
import { HiOutlineMapPin } from 'react-icons/hi2';

const CATEGORY_COLORS = {
    venue: 'bg-purple-100 text-purple-700',
    hotel: 'bg-blue-100 text-blue-700',
    caterer: 'bg-orange-100 text-orange-700',
    cameraman: 'bg-cyan-100 text-cyan-700',
    dj: 'bg-pink-100 text-pink-700',
    decorator: 'bg-green-100 text-green-700',
    other: 'bg-gray-100 text-gray-700',
};

const PLACEHOLDER_IMG = 'https://placehold.co/400x250/e0e7ff/4f46e5?text=No+Image';

export default function ServiceCard({ service }) {
    const firstImage = service.images?.[0] || PLACEHOLDER_IMG;
    const colorClass = CATEGORY_COLORS[service.category] || CATEGORY_COLORS.other;

    return (
        <div className="group overflow-hidden rounded-lg bg-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={firstImage}
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${colorClass}`}>
                    {service.category}
                </span>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="truncate text-lg font-semibold text-gray-900">{service.title}</h3>

                <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                    <HiOutlineMapPin className="h-4 w-4" />
                    <span className="capitalize">{service.location}</span>
                </div>

                <div className="mt-3 flex items-end justify-between">
                    <div>
                        <span className="text-lg font-bold text-primary-600">
                            ₹{service.pricePerDay?.toLocaleString('en-IN')}
                        </span>
                        <span className="text-sm text-gray-500">/day</span>
                    </div>
                    <span className="text-xs text-gray-400">
                        {service.availabilityDates?.length || 0} dates available
                    </span>
                </div>

                {service.admin?.name && (
                    <p className="mt-2 text-xs text-gray-400">by {service.admin.name}</p>
                )}

                <Link
                    to={`/services/${service._id}`}
                    className="mt-4 block rounded-lg bg-primary-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-primary-700"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}

import { format } from 'date-fns';

const STATUS_STYLES = {
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

export default function AdminBookingTable({ bookings }) {
    if (!bookings?.length) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-12">
                <p className="text-lg font-medium text-gray-500">No bookings yet</p>
                <p className="mt-1 text-sm text-gray-400">Bookings on your services will appear here.</p>
            </div>
        );
    }

    return (
        <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto rounded-lg border border-gray-200 md:block">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {['Service', 'Category', 'Customer', 'Email', 'Dates', 'Days', 'Price', 'Status', 'Booked On'].map(
                                (h) => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        {h}
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {bookings.map((b) => (
                            <tr key={b._id} className="hover:bg-gray-50">
                                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                                    {b.service?.title || '—'}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm capitalize text-gray-600">
                                    {b.service?.category || '—'}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{b.user?.name || '—'}</td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">{b.user?.email || '—'}</td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                    {format(new Date(b.startDate), 'MMM d')} — {format(new Date(b.endDate), 'MMM d, yyyy')}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{b.totalDays}</td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                                    ₹{b.totalPrice?.toLocaleString('en-IN')}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3">
                                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[b.status]}`}>
                                        {b.status}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                    {format(new Date(b.createdAt), 'MMM d, yyyy')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 md:hidden">
                {bookings.map((b) => (
                    <div key={b._id} className="rounded-lg bg-white p-4 shadow-md">
                        <div className="flex items-start justify-between">
                            <h4 className="font-medium text-gray-900">{b.service?.title || '—'}</h4>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[b.status]}`}>
                                {b.status}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{b.user?.name} · {b.user?.email}</p>
                        <p className="mt-2 text-sm text-gray-600">
                            {format(new Date(b.startDate), 'MMM d')} — {format(new Date(b.endDate), 'MMM d, yyyy')}
                        </p>
                        <div className="mt-2 flex justify-between text-sm">
                            <span className="text-gray-500">{b.totalDays} day{b.totalDays > 1 ? 's' : ''}</span>
                            <span className="font-semibold text-gray-900">₹{b.totalPrice?.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

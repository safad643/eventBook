import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { HiOutlinePencilSquare, HiOutlineTrash, HiOutlinePlusCircle, HiOutlineMapPin } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { useAdminServices, useDeleteService } from '@/hooks';
import ConfirmModal from '@/components/common/ConfirmModal';
import Spinner from '@/components/common/Spinner';

const PLACEHOLDER_IMG = 'https://placehold.co/80x56/e0e7ff/4f46e5?text=No+Image';

export default function AdminServicesPage() {
    const { services, loading, refetch } = useAdminServices();
    const { deleteService, loading: deleting } = useDeleteService();
    const [deleteTarget, setDeleteTarget] = useState(null);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteService(deleteTarget._id);
            toast.success('Service deleted');
            refetch();
        } catch (error) {
            const msg = error.response?.data?.error || 'Failed to delete service';
            toast.error(msg);
        } finally {
            setDeleteTarget(null);
        }
    };

    if (loading) return <Spinner className="py-20" />;

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Services</h1>
                    <p className="mt-1 text-sm text-gray-600">Manage your services</p>
                </div>
                <Link
                    to="/admin/services/create"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                >
                    <HiOutlinePlusCircle className="h-5 w-5" />
                    Add Service
                </Link>
            </div>

            {/* Table */}
            {services.length === 0 ? (
                <div className="mt-8 flex flex-col items-center rounded-lg border-2 border-dashed border-gray-300 py-16">
                    <p className="text-gray-500">You haven&apos;t created any services yet</p>
                    <Link
                        to="/admin/services/create"
                        className="mt-3 text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                        Create your first service →
                    </Link>
                </div>
            ) : (
                <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-md">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {['', 'Title', 'Category', 'Location', 'Price/Day', 'Created', 'Actions'].map((h) => (
                                    <th
                                        key={h}
                                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {services.map((service) => (
                                <tr key={service._id} className="hover:bg-gray-50 transition-colors">
                                    {/* Thumbnail */}
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <img
                                            src={service.images?.[0] || PLACEHOLDER_IMG}
                                            alt={service.title}
                                            className="h-10 w-16 rounded object-cover"
                                        />
                                    </td>

                                    {/* Title */}
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <p className="font-medium text-gray-900">{service.title}</p>
                                    </td>

                                    {/* Category */}
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <span className="inline-block rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium capitalize text-primary-700">
                                            {service.category}
                                        </span>
                                    </td>

                                    {/* Location */}
                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                        <span className="inline-flex items-center gap-1 capitalize">
                                            <HiOutlineMapPin className="h-3.5 w-3.5" />
                                            {service.location}
                                        </span>
                                    </td>

                                    {/* Price */}
                                    <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900">
                                        ₹{service.pricePerDay?.toLocaleString('en-IN')}
                                    </td>

                                    {/* Created */}
                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                        {format(new Date(service.createdAt), 'MMM d, yyyy')}
                                    </td>

                                    {/* Actions */}
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                to={`/admin/services/${service._id}/edit`}
                                                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                            >
                                                <HiOutlinePencilSquare className="h-4 w-4" />
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => setDeleteTarget(service)}
                                                disabled={deleting}
                                                className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                                            >
                                                <HiOutlineTrash className="h-4 w-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ConfirmModal
                isOpen={!!deleteTarget}
                title="Delete Service"
                message="Are you sure you want to delete this service? All associated bookings will also be deleted."
                confirmText="Delete"
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}

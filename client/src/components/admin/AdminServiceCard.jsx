import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { HiOutlineMapPin, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';
import ConfirmModal from '../common/ConfirmModal';
import { useDeleteService } from '../../hooks';
import toast from 'react-hot-toast';

const PLACEHOLDER_IMG = 'https://placehold.co/400x250/e0e7ff/4f46e5?text=No+Image';

export default function AdminServiceCard({ service, onDelete }) {
    const [showConfirm, setShowConfirm] = useState(false);
    const { deleteService, loading: deleting } = useDeleteService();

    const image = service.images?.[0] || PLACEHOLDER_IMG;

    const handleDelete = async () => {
        try {
            await deleteService(service._id);
            toast.success('Service deleted');
            onDelete(service._id);
        } catch (error) {
            const msg = error.response?.data?.error || 'Failed to delete service';
            toast.error(msg);
        } finally {
            setShowConfirm(false);
        }
    };

    return (
        <>
            <div className="overflow-hidden rounded-lg bg-white shadow-md">
                <img src={image} alt={service.title} className="h-40 w-full object-cover" />

                <div className="p-4">
                    <h3 className="truncate font-semibold text-gray-900">{service.title}</h3>

                    <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                        <HiOutlineMapPin className="h-3.5 w-3.5" />
                        <span className="capitalize">{service.location}</span>
                    </div>

                    <p className="mt-2 text-sm">
                        <span className="font-bold text-primary-600">₹{service.pricePerDay?.toLocaleString('en-IN')}</span>
                        <span className="text-gray-500">/day</span>
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                        {service.availabilityDates?.length || 0} dates · Created {format(new Date(service.createdAt), 'MMM d, yyyy')}
                    </p>

                    <div className="mt-4 flex gap-2">
                        <Link
                            to={`/admin/services/${service._id}/edit`}
                            className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                            <HiOutlinePencilSquare className="h-4 w-4" /> Edit
                        </Link>
                        <button
                            onClick={() => setShowConfirm(true)}
                            disabled={deleting}
                            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                        >
                            <HiOutlineTrash className="h-4 w-4" /> Delete
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={showConfirm}
                title="Delete Service"
                message="Are you sure you want to delete this service? All associated bookings will also be deleted."
                confirmText="Delete"
                onConfirm={handleDelete}
                onCancel={() => setShowConfirm(false)}
            />
        </>
    );
}

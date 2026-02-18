import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth, useService, useUpdateService } from '@/hooks';
import ServiceForm from '@/components/admin/ServiceForm';
import Spinner from '@/components/common/Spinner';

export default function AdminEditServicePage() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { service, loading } = useService(id);
    const { updateService, loading: submitting } = useUpdateService();

    useEffect(() => {
        if (!service || !user) return;
        if (service.admin?._id !== user?.id) {
            toast.error('Not authorized to edit this service');
            navigate('/admin', { replace: true });
        }
    }, [service, user, navigate]);

    useEffect(() => {
        if (!loading && id && !service && user) {
            toast.error('Service not found');
            navigate('/admin', { replace: true });
        }
    }, [loading, id, service, user, navigate]);

    const handleSubmit = async (formData) => {
        try {
            await updateService(id, formData);
            toast.success('Service updated successfully');
            navigate('/admin');
        } catch (error) {
            const msg = error.response?.data?.error || error.response?.data?.errors?.join(', ') || 'Failed to update service';
            toast.error(msg);
        }
    };

    if (loading) return <Spinner className="py-20" />;
    if (!service) return null;

    return (
        <div className="mx-auto max-w-2xl">
            <h1 className="text-2xl font-bold text-gray-900">Edit Service</h1>
            <p className="mt-1 text-sm text-gray-600">Update service details</p>

            <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
                <ServiceForm initialData={service} onSubmit={handleSubmit} loading={submitting} />
            </div>
        </div>
    );
}

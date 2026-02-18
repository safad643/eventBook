import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import ServiceForm from '../../components/admin/ServiceForm';

export default function AdminCreateServicePage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            await API.post('/admin/services', formData);
            toast.success('Service created successfully');
            navigate('/admin');
        } catch (error) {
            const msg = error.response?.data?.error || error.response?.data?.errors?.join(', ') || 'Failed to create service';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl">
            <h1 className="text-2xl font-bold text-gray-900">Create New Service</h1>
            <p className="mt-1 text-sm text-gray-600">Fill in the details to list a new service</p>

            <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
                <ServiceForm onSubmit={handleSubmit} loading={loading} />
            </div>
        </div>
    );
}

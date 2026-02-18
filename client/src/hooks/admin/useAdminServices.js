import { useState, useEffect, useCallback } from 'react';
import API from '@/api/axios';

/**
 * Fetches admin's own services list via the dashboard endpoint.
 * @returns {{ services: Array, loading: boolean, error: string|null, refetch: function }}
 */
export function useAdminServices() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchServices = useCallback(async (signal) => {
        try {
            const { data } = await API.get('/admin/dashboard', { signal });
            setServices(data.services ?? []);
        } catch (err) {
            if (err.name !== 'CanceledError') {
                setError(err.response?.data?.error || 'Failed to load services');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetchServices(controller.signal);
        return () => controller.abort();
    }, [fetchServices]);

    const refetch = useCallback(() => {
        setLoading(true);
        fetchServices(null);
    }, [fetchServices]);

    return { services, loading, error, refetch };
}

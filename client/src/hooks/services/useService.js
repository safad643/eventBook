import { useState, useEffect, useCallback } from 'react';
import API from '@/api/axios';

/**
 * Fetches a single service by id.
 * @param {string|null} id - Service id (skip fetch if null/undefined)
 * @returns {{ service: Object|null, loading: boolean, error: string|null, refetch: function }}
 */
export function useService(id) {
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(!!id);
    const [error, setError] = useState(null);

    const fetchService = useCallback(async (signal) => {
        if (!id) {
            setService(null);
            setError(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const { data } = await API.get(`/services/${id}`, { signal });
            setService(data.service);
        } catch (err) {
            if (err.name === 'CanceledError') return;
            setError(err.response?.data?.error || 'Service not found');
        }
        setLoading(false);
    }, [id]);

    useEffect(() => {
        const controller = new AbortController();
        fetchService(controller.signal);
        return () => controller.abort();
    }, [fetchService]);

    const refetch = useCallback(() => {
        fetchService(null);
    }, [fetchService]);

    return { service, loading, error, refetch };
}

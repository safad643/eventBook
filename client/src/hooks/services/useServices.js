import { useState, useEffect, useCallback } from 'react';
import API from '../../api/axios';

/**
 * Fetches a list of services with optional query params.
 * @param {Object} params - Query params (limit, sort, page, keyword, category, location, etc.)
 * @returns {{ services: Array, pages: number, loading: boolean, error: string|null, refetch: function }}
 */
export function useServices(params = {}) {
    const [services, setServices] = useState([]);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchServices = useCallback(async (signal) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await API.get('/services', { params, signal });
            setServices(data.services ?? []);
            setPages(data.pages ?? 1);
        } catch (err) {
            if (err.name !== 'CanceledError') {
                setError(err.response?.data?.error || 'Failed to fetch services');
            }
        } finally {
            setLoading(false);
        }
    }, [JSON.stringify(params)]);

    useEffect(() => {
        const controller = new AbortController();
        fetchServices(controller.signal);
        return () => controller.abort();
    }, [fetchServices]);

    const refetch = useCallback(() => {
        fetchServices(null);
    }, [fetchServices]);

    return { services, pages, loading, error, refetch };
}

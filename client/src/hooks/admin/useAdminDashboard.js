import { useState, useEffect, useCallback } from 'react';
import API from '@/api/axios';

/**
 * Fetches admin dashboard data (stats, services, recent bookings).
 * @returns {{ stats: Object|null, services: Array, recentBookings: Array, loading: boolean, error: string|null, refetch: function }}
 */
export function useAdminDashboard() {
    const [stats, setStats] = useState(null);
    const [services, setServices] = useState([]);
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboard = useCallback(async (signal) => {
        try {
            const { data } = await API.get('/admin/dashboard', { signal });
            setStats(data.stats ?? null);
            setServices(data.services ?? []);
            setRecentBookings(data.recentBookings ?? []);
        } catch (err) {
            if (err.name !== 'CanceledError') {
                setError(err.response?.data?.error || 'Failed to load dashboard');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetchDashboard(controller.signal);
        return () => controller.abort();
    }, [fetchDashboard]);

    const refetch = useCallback(() => {
        setLoading(true);
        fetchDashboard(null);
    }, [fetchDashboard]);

    return { stats, services, recentBookings, loading, error, refetch };
}

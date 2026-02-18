import { useState, useEffect, useCallback } from 'react';
import API from '@/api/axios';

/**
 * Fetches admin dashboard data (stats, chart data).
 * @returns {{ stats: Object|null, chartData: Array, loading: boolean, error: string|null, refetch: function }}
 */
export function useAdminDashboard() {
    const [stats, setStats] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboard = useCallback(async (signal) => {
        try {
            const { data } = await API.get('/admin/dashboard', { signal });
            setStats(data.stats ?? null);
            setChartData(data.chartData ?? []);
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

    return { stats, chartData, loading, error, refetch };
}


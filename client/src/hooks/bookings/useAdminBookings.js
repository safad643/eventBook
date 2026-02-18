import { useState, useEffect, useCallback } from 'react';
import API from '@/api/axios';

/**
 * Fetches admin bookings (bookings on current admin's services).
 * @returns {{ bookings: Array, loading: boolean, error: string|null, refetch: function }}
 */
export function useAdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBookings = useCallback(async (signal) => {
        try {
            const { data } = await API.get('/admin/bookings', { signal });
            setBookings(data.bookings ?? []);
        } catch (err) {
            if (err.name !== 'CanceledError') {
                setError(err.response?.data?.error || 'Failed to load bookings');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetchBookings(controller.signal);
        return () => controller.abort();
    }, [fetchBookings]);

    const refetch = useCallback(() => {
        setLoading(true);
        fetchBookings(null);
    }, [fetchBookings]);

    return { bookings, loading, error, refetch };
}

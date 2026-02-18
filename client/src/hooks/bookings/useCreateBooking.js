import { useCallback } from 'react';
import API from '../../api/axios';
import { useAsyncMutation } from '../helpers/useAsyncMutation';

/**
 * Create a booking. Payload: { serviceId, startDate, endDate }.
 * @returns {{ createBooking: function, loading: boolean, error: string|null }}
 */
export function useCreateBooking() {
    const { execute, loading, error } = useAsyncMutation();

    const createBooking = useCallback(
        (payload) => execute(() => API.post('/bookings', payload), 'Booking failed'),
        [execute]
    );

    return { createBooking, loading, error };
}

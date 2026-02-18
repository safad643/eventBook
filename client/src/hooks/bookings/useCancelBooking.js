import { useCallback } from 'react';
import API from '../../api/axios';
import { useAsyncMutation } from '../helpers/useAsyncMutation';

/**
 * Cancel a booking. Returns cancelBooking(bookingId) and loading state.
 * @returns {{ cancelBooking: function, loading: boolean, error: string|null }}
 */
export function useCancelBooking() {
    const { execute, loading, error } = useAsyncMutation();

    const cancelBooking = useCallback(
        (bookingId) => execute(() => API.patch(`/bookings/${bookingId}/cancel`), 'Failed to cancel booking'),
        [execute]
    );

    return { cancelBooking, loading, error };
}

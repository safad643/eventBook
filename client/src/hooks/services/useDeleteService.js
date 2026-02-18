import { useCallback } from 'react';
import API from '@/api/axios';
import { useAsyncMutation } from '@/hooks/helpers/useAsyncMutation';

/**
 * Delete a service (admin). Returns deleteService(serviceId) and loading state.
 * @returns {{ deleteService: function, loading: boolean, error: string|null }}
 */
export function useDeleteService() {
    const { execute, loading, error } = useAsyncMutation();

    const deleteService = useCallback(
        (serviceId) => execute(() => API.delete(`/admin/services/${serviceId}`), 'Failed to delete service'),
        [execute]
    );

    return { deleteService, loading, error };
}

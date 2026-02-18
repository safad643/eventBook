import { useCallback } from 'react';
import API from '../api/axios';
import { useAsyncMutation } from './useAsyncMutation';

/**
 * Update a service (admin). Returns updateService(id, formData) and loading state.
 * @returns {{ updateService: function, loading: boolean, error: string|null }}
 */
export function useUpdateService() {
    const { execute, loading, error } = useAsyncMutation();

    const updateService = useCallback(
        (id, formData) => execute(() => API.put(`/admin/services/${id}`, formData), 'Failed to update service'),
        [execute]
    );

    return { updateService, loading, error };
}

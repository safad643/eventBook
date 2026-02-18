import { useCallback } from 'react';
import API from '../api/axios';
import { useAsyncMutation } from './useAsyncMutation';

/**
 * Create a new service (admin). Returns createService(formData) and loading state.
 * @returns {{ createService: function, loading: boolean, error: string|null }}
 */
export function useCreateService() {
    const { execute, loading, error } = useAsyncMutation();

    const createService = useCallback(
        (formData) => execute(() => API.post('/admin/services', formData), 'Failed to create service'),
        [execute]
    );

    return { createService, loading, error };
}

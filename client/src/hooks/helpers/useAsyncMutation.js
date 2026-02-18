import { useState, useCallback } from 'react';

/**
 * Extracts a user-friendly error message from an API error.
 * @param {Error} err
 * @param {string} fallback
 * @returns {string}
 */
function getErrorMessage(err, fallback = 'Something went wrong') {
    const msg = err.response?.data?.error || err.response?.data?.errors?.join(', ');
    return msg || fallback;
}

/**
 * Reusable hook for async mutations: handles loading, error, try/catch/finally.
 * Use for any one-off async action (POST, PUT, PATCH, DELETE) where you want
 * loading state and error state without repeating the same boilerplate.
 *
 * @returns {{ execute: function, loading: boolean, error: string|null }}
 *
 * @example
 * const { execute, loading, error } = useAsyncMutation();
 * const createItem = useCallback((data) => execute(
 *   () => API.post('/items', data),
 *   'Failed to create item'
 * ), [execute]);
 */
export function useAsyncMutation() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(async (asyncFn, defaultErrorMessage = 'Something went wrong') => {
        setLoading(true);
        setError(null);
        try {
            await asyncFn();
        } catch (err) {
            const msg = getErrorMessage(err, defaultErrorMessage);
            setError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { execute, loading, error };
}

export { getErrorMessage };

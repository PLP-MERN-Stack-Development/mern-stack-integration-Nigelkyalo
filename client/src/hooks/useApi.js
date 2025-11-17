// useApi.js - Custom hook for API calls with loading and error states

import { useState, useCallback } from 'react';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiCall();
      return { data, error: null };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || 'An error occurred';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
};



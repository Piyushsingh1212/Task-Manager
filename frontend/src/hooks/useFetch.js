// ─────────────────────────────────────────────────────────────
// src/hooks/useFetch.js — Reusable data-fetching hook
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';

/**
 * @param {() => Promise<T>} fetchFn  – async function that returns data
 * @param {any[]}            deps     – dependency array (re-fetches when changed)
 * @returns {{ data: T|null, loading: boolean, error: string|null, refetch: () => void }}
 */
export default function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        setError(
          'Unable to connect to the server. Please make sure the backend is running.'
        );
      } else {
        setError(err.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch: fetchData };
}

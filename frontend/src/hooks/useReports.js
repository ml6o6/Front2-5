// frontend/src/hooks/useReports.js
import { useEffect, useState, useCallback } from 'react';

export function useReport(fetcher, args = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const key = JSON.stringify(args);

  const run = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetcher(...args);
      setData(r);
      setError(null);
    } catch (e) {
      setError(e?.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [key]);

  useEffect(() => {
    run();
  }, [run]);

  return { data, loading, error, reload: run };
}

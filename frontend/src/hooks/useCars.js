// frontend/src/hooks/useCars.js
import { useCallback, useEffect, useState } from 'react';
import { carsApi } from '../api/carsApi';

export function useCars(search) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await carsApi.getCars(search);
      setCars(data);
      setError(null);
    } catch (e) {
      setError(e?.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  return { cars, loading, error, reload: load };
}

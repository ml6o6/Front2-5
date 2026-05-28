// frontend/src/hooks/useDrivers.js
import { useCallback, useEffect, useState } from 'react';
import { driversApi } from '../api/driversApi';

export function useDrivers(search) {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await driversApi.getDrivers(search);
      setDrivers(data);
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

  return { drivers, loading, error, reload: load };
}

export function useDriver(id) {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    driversApi
      .getDriver(id)
      .then((d) => {
        setDriver(d);
        setError(null);
      })
      .catch((e) => setError(e?.response?.data?.detail || e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { driver, loading, error };
}

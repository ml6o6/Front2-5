// frontend/src/hooks/useAccidents.js
import { useCallback, useEffect, useState } from 'react';
import { accidentsApi } from '../api/accidentsApi';

export function useAccidents(filters = {}) {
  const [accidents, setAccidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const key = JSON.stringify(filters);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await accidentsApi.getAccidents(filters);
      setAccidents(data);
      setError(null);
    } catch (e) {
      setError(e?.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [key]);

  useEffect(() => {
    load();
  }, [load]);

  return { accidents, loading, error, reload: load };
}

export function useAccident(id) {
  const [accident, setAccident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    accidentsApi
      .getAccident(id)
      .then((d) => {
        setAccident(d);
        setError(null);
      })
      .catch((e) => setError(e?.response?.data?.detail || e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { accident, loading, error };
}

export function useMapPoints(filters) {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const key = JSON.stringify(filters || {});
  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await accidentsApi.getMapPoints(filters || {});
      setPoints(data);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [key]);
  useEffect(() => {
    reload();
  }, [reload]);
  return { points, loading, reload };
}

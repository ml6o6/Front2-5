// frontend/src/hooks/useStats.js
import { useEffect, useState } from 'react';
import { statsApi } from '../api/statsApi';

export function useStatsSummary() {
  const [summary, setSummary] = useState(null);
  useEffect(() => {
    statsApi.summary().then(setSummary);
  }, []);
  return summary;
}

export function useStatsByType() {
  const [data, setData] = useState([]);
  useEffect(() => {
    statsApi.byType().then(setData);
  }, []);
  return data;
}

export function useStatsByCause() {
  const [data, setData] = useState([]);
  useEffect(() => {
    statsApi.byCause().then(setData);
  }, []);
  return data;
}

export function useStatsByDay(year, month) {
  const [data, setData] = useState([]);
  useEffect(() => {
    statsApi.byDay(year, month).then(setData);
  }, [year, month]);
  return data;
}

export function useStatsByLocation(limit = 10) {
  const [data, setData] = useState([]);
  useEffect(() => {
    statsApi.byLocation(limit).then(setData);
  }, [limit]);
  return data;
}

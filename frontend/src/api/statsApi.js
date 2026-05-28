// frontend/src/api/statsApi.js
import http from './axios';

export const statsApi = {
  async byType() {
    const { data } = await http.get('/stats/by-type');
    return data;
  },
  async byCause() {
    const { data } = await http.get('/stats/by-cause');
    return data;
  },
  async byDay(year, month) {
    const { data } = await http.get('/stats/by-day', { params: { year, month } });
    return data;
  },
  async byLocation(limit = 10) {
    const { data } = await http.get('/stats/by-location', { params: { limit } });
    return data;
  },
  async summary() {
    const { data } = await http.get('/stats/summary');
    return data;
  },
};

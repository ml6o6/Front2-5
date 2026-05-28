// frontend/src/api/accidentsApi.js
import http from './axios';

function cleanParams(p = {}) {
  const out = {};
  Object.entries(p).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') out[k] = v;
  });
  return out;
}

export const accidentsApi = {
  async getAccidents(filters = {}) {
    const { data } = await http.get('/accidents', { params: cleanParams(filters) });
    return data;
  },
  async getAccident(id) {
    const { data } = await http.get(`/accidents/${id}`);
    return data;
  },
  async getMapPoints(filters = {}) {
    const { data } = await http.get('/accidents/map-points', { params: cleanParams(filters) });
    return data;
  },
  async createAccident(payload) {
    const { data } = await http.post('/accidents', payload);
    return data;
  },
  async updateAccident(id, payload) {
    const { data } = await http.put(`/accidents/${id}`, payload);
    return data;
  },
  async deleteAccident(id) {
    await http.delete(`/accidents/${id}`);
  },
};

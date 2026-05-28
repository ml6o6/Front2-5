// frontend/src/api/driversApi.js
import http from './axios';

export const driversApi = {
  async getDrivers(search) {
    const { data } = await http.get('/drivers', { params: search ? { search } : {} });
    return data;
  },
  async getDriver(id) {
    const { data } = await http.get(`/drivers/${id}`);
    return data;
  },
  async createDriver(payload) {
    const { data } = await http.post('/drivers', payload);
    return data;
  },
  async updateDriver(id, payload) {
    const { data } = await http.put(`/drivers/${id}`, payload);
    return data;
  },
  async deleteDriver(id) {
    await http.delete(`/drivers/${id}`);
  },
};

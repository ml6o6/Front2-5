// frontend/src/api/carsApi.js
import http from './axios';

export const carsApi = {
  async getCars(search) {
    const { data } = await http.get('/cars', { params: search ? { search } : {} });
    return data;
  },
  async getCar(id) {
    const { data } = await http.get(`/cars/${id}`);
    return data;
  },
  async createCar(payload) {
    const { data } = await http.post('/cars', payload);
    return data;
  },
  async updateCar(id, payload) {
    const { data } = await http.put(`/cars/${id}`, payload);
    return data;
  },
  async deleteCar(id) {
    await http.delete(`/cars/${id}`);
  },
};

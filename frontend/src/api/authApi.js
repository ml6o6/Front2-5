// frontend/src/api/authApi.js
import http from './axios';

export const authApi = {
  async login(username, password) {
    const { data } = await http.post('/auth/login', { username, password });
    return data;
  },
  async register(payload) {
    const { data } = await http.post('/auth/register', payload);
    return data;
  },
  async me() {
    const { data } = await http.get('/auth/me');
    return data;
  },
  async listUsers() {
    const { data } = await http.get('/users');
    return data;
  },
  async setRole(userId, role) {
    const { data } = await http.patch(`/users/${userId}/role`, { role });
    return data;
  },
};

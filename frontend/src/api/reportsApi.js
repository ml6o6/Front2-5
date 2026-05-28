// frontend/src/api/reportsApi.js
import http from './axios';

export const reportsApi = {
  async multiAccidentDrivers() {
    const { data } = await http.get('/reports/multi-accident-drivers');
    return data;
  },
  async driversByLocation(location) {
    const { data } = await http.get('/reports/drivers-by-location', { params: { location } });
    return data;
  },
  async driversByDate(date) {
    const { data } = await http.get('/reports/drivers-by-date', { params: { date } });
    return data;
  },
  async maxVictimsAccident() {
    const { data } = await http.get('/reports/max-victims-accident');
    return data;
  },
  async pedestrianDrivers() {
    const { data } = await http.get('/reports/pedestrian-drivers');
    return data;
  },
  async causesByFrequency() {
    const { data } = await http.get('/reports/causes-by-frequency');
    return data;
  },
};

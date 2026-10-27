import api from './api';

export const alertService = {
  async getAlerts(params = {}) {
    const response = await api.get('/alerts', { params });
    return response.data;
  },

  async getAlertById(id) {
    const response = await api.get(`/alerts/${id}`);
    return response.data;
  },

  async createAlert(alertData) {
    const response = await api.post('/alerts', alertData);
    return response.data;
  },

  async updateAlert(id, updateData) {
    const response = await api.put(`/alerts/${id}`, updateData);
    return response.data;
  },

  async deleteAlert(id) {
    const response = await api.delete(`/alerts/${id}`);
    return response.data;
  },
};

export default alertService;

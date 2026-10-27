import api from './api';

export const dashboardService = {
  async getDashboardStats() {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  async getAabhasStatus() {
    const response = await api.get('/dashboard/aabhas-status');
    return response.data;
  },
};

export default dashboardService;

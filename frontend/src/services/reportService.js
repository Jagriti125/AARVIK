import api from './api';

export const reportService = {
  async getReports(params = {}) {
    const response = await api.get('/reports', { params });
    return response.data;
  },

  async getReportById(id) {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  async createReport(reportData) {
    const response = await api.post('/reports', reportData);
    return response.data;
  },

  async updateReport(id, updateData) {
    const response = await api.put(`/reports/${id}`, updateData);
    return response.data;
  },

  async deleteReport(id) {
    const response = await api.delete(`/reports/${id}`);
    return response.data;
  },
};

export default reportService;

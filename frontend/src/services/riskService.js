import api from './api';

export const riskService = {
  async getRiskRecords(params = {}) {
    const response = await api.get('/risks', { params });
    return response.data;
  },

  async getRiskRecordById(id) {
    const response = await api.get(`/risks/${id}`);
    return response.data;
  },

  async createRiskRecord(recordData) {
    const response = await api.post('/risks', recordData);
    return response.data;
  },

  async updateRiskRecord(id, updateData) {
    const response = await api.put(`/risks/${id}`, updateData);
    return response.data;
  },

  async deleteRiskRecord(id) {
    const response = await api.delete(`/risks/${id}`);
    return response.data;
  },
};

export default riskService;

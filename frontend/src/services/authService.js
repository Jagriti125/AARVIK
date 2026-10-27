import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success && response.data.token) {
      localStorage.setItem('aarvik_admin_token', response.data.token);
      localStorage.setItem('aarvik_admin_user', JSON.stringify(response.data.admin));
    }
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout() {
    localStorage.removeItem('aarvik_admin_token');
    localStorage.removeItem('aarvik_admin_user');
  },

  getStoredUser() {
    const userStr = localStorage.getItem('aarvik_admin_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return Boolean(localStorage.getItem('aarvik_admin_token'));
  },
};

export default authService;

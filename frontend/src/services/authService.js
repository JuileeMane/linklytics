import api from './api';

export const authService = {
  async register(data) {
    const res = await api.post('/api/auth/register', data);
    return res.data;
  },

  async login(data) {
    const res = await api.post('/api/auth/login', data);
    return res.data;
  },

  async logout() {
    try {
      await api.post('/api/auth/logout');
    } catch (e) {
      // Ignore
    } finally {
      localStorage.removeItem('linklytics_token');
      localStorage.removeItem('linklytics_user');
    }
  },

  async getMe() {
    const res = await api.get('/api/auth/me');
    return res.data;
  },

  async updateProfile(data) {
    const res = await api.put('/api/auth/profile', data);
    return res.data;
  },

  async changePassword(data) {
    const res = await api.post('/api/auth/change-password', data);
    return res.data;
  },
};

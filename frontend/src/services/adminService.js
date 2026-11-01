import api from './api';

export const adminService = {
  async getDashboard() {
    const res = await api.get('/api/admin/dashboard');
    return res.data;
  },

  async getUsers() {
    const res = await api.get('/api/admin/users');
    return res.data;
  },

  async toggleUserStatus(id) {
    const res = await api.patch(`/api/admin/users/${id}/toggle-status`);
    return res.data;
  },

  async getSuspiciousLinks() {
    const res = await api.get('/api/admin/suspicious-links');
    return res.data;
  },

  async deleteLink(id) {
    const res = await api.delete(`/api/admin/links/${id}`);
    return res.data;
  },
};

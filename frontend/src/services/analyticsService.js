import api from './api';

export const analyticsService = {
  async getOverview() {
    const res = await api.get('/api/analytics/overview');
    return res.data;
  },

  async getLinkAnalytics(id) {
    const res = await api.get(`/api/analytics/link/${id}`);
    return res.data;
  },
};

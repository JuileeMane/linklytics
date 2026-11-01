import api from './api';

export const campaignService = {
  async getCampaigns() {
    const res = await api.get('/api/campaigns');
    return res.data;
  },

  async createCampaign(data) {
    const res = await api.post('/api/campaigns', data);
    return res.data;
  },

  async updateCampaign(id, data) {
    const res = await api.put(`/api/campaigns/${id}`, data);
    return res.data;
  },

  async deleteCampaign(id) {
    const res = await api.delete(`/api/campaigns/${id}`);
    return res.data;
  },
};

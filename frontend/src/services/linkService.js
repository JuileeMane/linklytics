import api from './api';

export const linkService = {
  async getLinks(params = {}) {
    const res = await api.get('/api/links', { params });
    return res.data;
  },

  async getLinkById(id) {
    const res = await api.get(`/api/links/${id}`);
    return res.data;
  },

  async createLink(data) {
    const res = await api.post('/api/links', data);
    return res.data;
  },

  async updateLink(id, data) {
    const res = await api.put(`/api/links/${id}`, data);
    return res.data;
  },

  async deleteLink(id) {
    const res = await api.delete(`/api/links/${id}`);
    return res.data;
  },

  async toggleActive(id) {
    const res = await api.patch(`/api/links/${id}/toggle-active`);
    return res.data;
  },

  async toggleArchive(id) {
    const res = await api.patch(`/api/links/${id}/archive`);
    return res.data;
  },

  async toggleFavorite(id) {
    const res = await api.patch(`/api/links/${id}/favorite`);
    return res.data;
  },

  async getQrCode(id, size = 300, format = 'base64') {
    const res = await api.get(`/api/links/${id}/qr`, {
      params: { size, format },
    });
    return res.data;
  },

  async downloadQrPng(id, shortCode, size = 400) {
    const res = await api.get(`/api/links/${id}/qr`, {
      params: { size, format: 'png' },
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `qr-${shortCode}.png`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  async exportCsv() {
    const res = await api.get('/api/links/export/csv', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'linklytics-links.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};

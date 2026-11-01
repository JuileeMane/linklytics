import api from './api';

export const folderService = {
  async getFolders() {
    const res = await api.get('/api/folders');
    return res.data;
  },

  async createFolder(data) {
    const res = await api.post('/api/folders', data);
    return res.data;
  },

  async updateFolder(id, data) {
    const res = await api.put(`/api/folders/${id}`, data);
    return res.data;
  },

  async deleteFolder(id) {
    const res = await api.delete(`/api/folders/${id}`);
    return res.data;
  },
};

export const tagService = {
  async getTags() {
    const res = await api.get('/api/tags');
    return res.data;
  },

  async createTag(data) {
    const res = await api.post('/api/tags', data);
    return res.data;
  },

  async deleteTag(id) {
    const res = await api.delete(`/api/tags/${id}`);
    return res.data;
  },
};

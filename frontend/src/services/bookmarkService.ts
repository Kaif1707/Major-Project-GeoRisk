import { api } from './api';

export const bookmarkService = {
  getBookmarks: async (itemType?: string) => {
    const response = await api.get('/bookmarks', { params: { item_type: itemType } });
    return response.data;
  },

  createBookmark: async (payload: { item_type: string; item_id: string; title: string; meta_json?: string }) => {
    const response = await api.post('/bookmarks', payload);
    return response.data;
  },

  deleteBookmark: async (bookmarkId: string) => {
    const response = await api.delete(`/bookmarks/${bookmarkId}`);
    return response.data;
  },
};

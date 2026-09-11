import { api } from './api';

export const newsService = {
  getArticles: async (params?: { country_code?: string; region?: string; category?: string; search?: string }) => {
    const response = await api.get('/news', { params });
    return response.data;
  },

  getTrending: async () => {
    const response = await api.get('/news/trending');
    return response.data;
  },

  getSentiment: async (countryCode: string) => {
    const response = await api.get(`/news/sentiment/${countryCode}`);
    return response.data;
  },

  syncLiveFeed: async () => {
    const response = await api.post('/news/sync');
    return response.data;
  },
};

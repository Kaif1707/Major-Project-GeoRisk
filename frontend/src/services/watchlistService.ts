import { api } from './api';

export const watchlistService = {
  getWatchlists: async () => {
    const response = await api.get('/watchlists');
    return response.data;
  },

  createWatchlist: async (payload: { name: string; description?: string; is_pinned?: boolean }) => {
    const response = await api.post('/watchlists', payload);
    return response.data;
  },

  addCountry: async (watchlistId: string, countryCode: string) => {
    const response = await api.post(`/watchlists/${watchlistId}/countries`, null, { params: { country_code: countryCode } });
    return response.data;
  },

  removeCountry: async (watchlistId: string, countryId: string) => {
    const response = await api.delete(`/watchlists/${watchlistId}/countries/${countryId}`);
    return response.data;
  },
};

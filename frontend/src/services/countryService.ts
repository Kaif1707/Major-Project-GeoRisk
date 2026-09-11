import { api } from './api';

export const countryService = {
  getCountries: async (params?: { region?: string; search?: string; skip?: number; limit?: number }) => {
    const response = await api.get('/countries', { params });
    return response.data;
  },

  getCountryDetail: async (idOrCode: string) => {
    const response = await api.get(`/countries/${idOrCode}`);
    return response.data;
  },

  getRegions: async () => {
    const response = await api.get('/countries/regions');
    return response.data;
  },
};

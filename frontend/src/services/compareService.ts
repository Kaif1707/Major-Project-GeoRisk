import { api } from './api';

export const compareService = {
  compareCountries: async (countryCodes: string[], year: number = 2024) => {
    const response = await api.post('/compare', { country_codes: countryCodes, year });
    return response.data;
  },

  compareCountriesByGet: async (codes: string, year: number = 2024) => {
    const response = await api.get('/compare', { params: { codes, year } });
    return response.data;
  },
};

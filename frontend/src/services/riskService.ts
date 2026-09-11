import { api } from './api';

export const riskService = {
  getRiskScores: async (params?: {
    region?: string;
    risk_category?: string;
    min_score?: number;
    max_score?: number;
    search?: string;
    sort_by?: string;
    year?: number;
    skip?: number;
    limit?: number;
  }) => {
    const response = await api.get('/risk', { params });
    return response.data;
  },

  getRankings: async (year: number = 2024) => {
    const response = await api.get('/risk/rankings', { params: { year } });
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/risk/categories');
    return response.data;
  },

  getCountryRiskScore: async (countryIdOrCode: string, year: number = 2024) => {
    const response = await api.get(`/risk/${countryIdOrCode}`, { params: { year } });
    return response.data;
  },

  getRiskBreakdown: async (countryIdOrCode: string, year: number = 2024) => {
    const response = await api.get(`/risk/breakdown/${countryIdOrCode}`, { params: { year } });
    return response.data;
  },

  getRiskHistory: async (countryIdOrCode: string) => {
    const response = await api.get(`/risk/history/${countryIdOrCode}`);
    return response.data;
  },

  recalculateAll: async () => {
    const response = await api.post('/risk/recalculate/all');
    return response.data;
  },
};

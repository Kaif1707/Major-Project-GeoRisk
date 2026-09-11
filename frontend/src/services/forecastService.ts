import { api } from './api';

export const forecastService = {
  getForecastHistory: async (countryCode: string) => {
    const response = await api.get(`/forecast/history/${countryCode}`);
    return response.data;
  },

  generateForecast: async (countryCode: string, horizonDays: number = 90) => {
    const response = await api.post(`/forecast/${countryCode}`, null, { params: { horizon_days: horizonDays } });
    return response.data;
  },

  runScenario: async (payload: {
    country_code: string;
    gdp_delta_pct?: number;
    inflation_delta_pct?: number;
    pol_instability_delta?: number;
    unemp_delta_pct?: number;
  }) => {
    const response = await api.post('/forecast/scenario', payload);
    return response.data;
  },
};

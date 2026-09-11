import { api } from './api';

export const reportService = {
  getReports: async () => {
    const response = await api.get('/reports');
    return response.data;
  },

  generateReport: async (payload: { report_type?: string; country_code?: string; format?: string }) => {
    const response = await api.post('/reports/generate', payload);
    return response.data;
  },
};

import { api } from './api';

export const adminService = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getUsers: async (search?: string) => {
    const response = await api.get('/admin/users', { params: { search } });
    return response.data;
  },

  createUser: async (payload: any) => {
    const response = await api.post('/admin/users', payload);
    return response.data;
  },

  updateUser: async (userId: string, payload: any) => {
    const response = await api.put(`/admin/users/${userId}`, payload);
    return response.data;
  },

  getWeights: async () => {
    const response = await api.get('/admin/weights');
    return response.data;
  },

  updateWeight: async (payload: { dimension_name: string; weight_pct: number }) => {
    const response = await api.put('/admin/weights', payload);
    return response.data;
  },

  runEtl: async () => {
    const response = await api.post('/admin/etl/run');
    return response.data;
  },

  getAuditLogs: async () => {
    const response = await api.get('/admin/audit');
    return response.data;
  },

  getSystemHealth: async () => {
    const response = await api.get('/admin/system');
    return response.data;
  },

  clearCache: async () => {
    const response = await api.post('/admin/cache/clear');
    return response.data;
  },
};

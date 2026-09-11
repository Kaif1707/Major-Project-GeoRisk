import { api } from './api';

export const alertService = {
  getRules: async () => {
    const response = await api.get('/alerts/rules');
    return response.data;
  },

  createRule: async (payload: { country_code?: string; metric_code?: string; condition?: string; threshold_value: number; alert_type?: string }) => {
    const response = await api.post('/alerts/rules', payload);
    return response.data;
  },

  getNotifications: async (unreadOnly: boolean = false) => {
    const response = await api.get('/alerts/notifications', { params: { unread_only: unreadOnly } });
    return response.data;
  },
};

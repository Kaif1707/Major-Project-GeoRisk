import { api } from './api';
import { LoginRequest, RegisterRequest } from '@/types';

export const authService = {
  login: async (credentials: LoginRequest) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore errors on logout
    }
  },

  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateProfile: async (data: { full_name?: string; theme_preference?: string; language_preference?: string }) => {
    const response = await api.patch('/users/me', data);
    return response.data;
  },
};

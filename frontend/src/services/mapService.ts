import { api } from './api';

export const mapService = {
  getMapData: async (params?: { year?: number; region?: string }) => {
    const response = await api.get('/map/countries', { params });
    return response.data;
  },
};

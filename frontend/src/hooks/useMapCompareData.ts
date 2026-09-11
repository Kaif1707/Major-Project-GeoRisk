import { useQuery } from '@tanstack/react-query';
import { mapService } from '@/services/mapService';
import { compareService } from '@/services/compareService';

export const useMapData = (params?: { year?: number; region?: string }) => {
  return useQuery({
    queryKey: ['mapData', params],
    queryFn: () => mapService.getMapData(params),
  });
};

export const useComparison = (countryCodes: string[], year: number = 2024) => {
  return useQuery({
    queryKey: ['comparison', countryCodes, year],
    queryFn: () => compareService.compareCountries(countryCodes, year),
    enabled: countryCodes.length >= 2,
  });
};

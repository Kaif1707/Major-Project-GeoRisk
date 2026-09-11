import { useQuery } from '@tanstack/react-query';
import { riskService } from '@/services/riskService';
import { countryService } from '@/services/countryService';

export const useRiskScores = (params?: {
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
  return useQuery({
    queryKey: ['riskScores', params],
    queryFn: () => riskService.getRiskScores(params),
  });
};

export const useRankings = (year: number = 2024) => {
  return useQuery({
    queryKey: ['rankings', year],
    queryFn: () => riskService.getRankings(year),
  });
};

export const useRiskCategories = () => {
  return useQuery({
    queryKey: ['riskCategories'],
    queryFn: () => riskService.getCategories(),
  });
};

export const useCountryRiskDetail = (countryIdOrCode: string, year: number = 2024) => {
  return useQuery({
    queryKey: ['countryRiskDetail', countryIdOrCode, year],
    queryFn: () => riskService.getCountryRiskScore(countryIdOrCode, year),
    enabled: !!countryIdOrCode,
  });
};

export const useRiskBreakdown = (countryIdOrCode: string, year: number = 2024) => {
  return useQuery({
    queryKey: ['riskBreakdown', countryIdOrCode, year],
    queryFn: () => riskService.getRiskBreakdown(countryIdOrCode, year),
    enabled: !!countryIdOrCode,
  });
};

export const useCountryDetail = (idOrCode: string) => {
  return useQuery({
    queryKey: ['countryDetail', idOrCode],
    queryFn: () => countryService.getCountryDetail(idOrCode),
    enabled: !!idOrCode,
  });
};

export const useRegions = () => {
  return useQuery({
    queryKey: ['regions'],
    queryFn: () => countryService.getRegions(),
  });
};

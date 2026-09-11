import { useQuery, useMutation } from '@tanstack/react-query';
import { newsService } from '@/services/newsService';
import { forecastService } from '@/services/forecastService';
import { aiService } from '@/services/aiService';

export const useNewsArticles = (params?: { country_code?: string; region?: string; category?: string; search?: string }) => {
  return useQuery({
    queryKey: ['newsArticles', params],
    queryFn: () => newsService.getArticles(params),
  });
};

export const useTrendingNews = () => {
  return useQuery({
    queryKey: ['trendingNews'],
    queryFn: () => newsService.getTrending(),
  });
};

export const useCountryForecasts = (countryCode: string) => {
  return useQuery({
    queryKey: ['countryForecasts', countryCode],
    queryFn: () => forecastService.getForecastHistory(countryCode),
    enabled: !!countryCode,
  });
};

export const useRunScenarioMutation = () => {
  return useMutation({
    mutationFn: (payload: {
      country_code: string;
      gdp_delta_pct?: number;
      inflation_delta_pct?: number;
      pol_instability_delta?: number;
      unemp_delta_pct?: number;
    }) => forecastService.runScenario(payload),
  });
};

export const useAiChatMutation = () => {
  return useMutation({
    mutationFn: (prompt: string) => aiService.chat(prompt),
  });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { watchlistService } from '@/services/watchlistService';
import { alertService } from '@/services/alertService';
import { reportService } from '@/services/reportService';
import { bookmarkService } from '@/services/bookmarkService';

export const useWatchlists = () => {
  return useQuery({
    queryKey: ['watchlists'],
    queryFn: () => watchlistService.getWatchlists(),
  });
};

export const useCreateWatchlistMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; description?: string; is_pinned?: boolean }) =>
      watchlistService.createWatchlist(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['watchlists'] }),
  });
};

export const useAlertRules = () => {
  return useQuery({
    queryKey: ['alertRules'],
    queryFn: () => alertService.getRules(),
  });
};

export const useAlertNotifications = () => {
  return useQuery({
    queryKey: ['alertNotifications'],
    queryFn: () => alertService.getNotifications(),
  });
};

export const useCreateAlertRuleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { country_code?: string; metric_code?: string; condition?: string; threshold_value: number; alert_type?: string }) =>
      alertService.createRule(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alertRules'] }),
  });
};

export const useUserReports = () => {
  return useQuery({
    queryKey: ['userReports'],
    queryFn: () => reportService.getReports(),
  });
};

export const useGenerateReportMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { report_type?: string; country_code?: string; format?: string }) =>
      reportService.generateReport(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userReports'] }),
  });
};

export const useBookmarks = (itemType?: string) => {
  return useQuery({
    queryKey: ['bookmarks', itemType],
    queryFn: () => bookmarkService.getBookmarks(itemType),
  });
};

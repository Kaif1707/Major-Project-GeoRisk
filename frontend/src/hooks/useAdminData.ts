import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['adminDashboard'],
    queryFn: () => adminService.getDashboard(),
  });
};

export const useAdminUsers = (search?: string) => {
  return useQuery({
    queryKey: ['adminUsers', search],
    queryFn: () => adminService.getUsers(search),
  });
};

export const useAdminWeights = () => {
  return useQuery({
    queryKey: ['adminWeights'],
    queryFn: () => adminService.getWeights(),
  });
};

export const useAuditLogs = () => {
  return useQuery({
    queryKey: ['auditLogs'],
    queryFn: () => adminService.getAuditLogs(),
  });
};

export const useAdminSystemHealth = () => {
  return useQuery({
    queryKey: ['adminSystemHealth'],
    queryFn: () => adminService.getSystemHealth(),
  });
};

export const useUpdateWeightMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { dimension_name: string; weight_pct: number }) => adminService.updateWeight(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminWeights'] }),
  });
};

export const useRunEtlMutation = () => {
  return useMutation({
    mutationFn: () => adminService.runEtl(),
  });
};

export const useClearCacheMutation = () => {
  return useMutation({
    mutationFn: () => adminService.clearCache(),
  });
};

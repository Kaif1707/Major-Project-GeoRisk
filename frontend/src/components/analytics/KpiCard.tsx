import React from 'react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

interface KpiCardProps {
  title: string;
  value?: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  icon: React.ReactNode;
  loading?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-between">
          <Skeleton className="w-24 h-3" />
          <Skeleton className="w-8 h-8 rounded-lg" />
        </div>
        <div className="mt-3 space-y-2">
          <Skeleton className="w-32 h-7" />
          <Skeleton className="w-20 h-3" />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400">{title}</span>
        <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-extrabold text-white tracking-tight">{value ?? 'N/A'}</div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs mt-1 font-medium ${trend.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend.value}
          </div>
        )}
        {subtitle && !trend && (
          <div className="text-xs text-gray-400 mt-1">{subtitle}</div>
        )}
      </div>
    </Card>
  );
};

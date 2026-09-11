import React from 'react';
import { RiskCategory } from '@/types';

interface BadgeProps {
  category?: RiskCategory;
  variant?: 'default' | 'outline' | 'risk';
  children?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ category, variant = 'default', children, className = '' }) => {
  if (category) {
    const riskStyles: Record<RiskCategory, string> = {
      'Very Low': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      'Low': 'bg-green-500/10 text-green-400 border-green-500/20',
      'Moderate': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      'Elevated': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      'High': 'bg-red-500/10 text-red-400 border-red-500/20',
      'Extreme': 'bg-rose-900/30 text-rose-300 border-rose-700/50 font-bold animate-pulse',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${riskStyles[category]} ${className}`}>
        {category} Risk
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-500/10 text-brand-400 border border-brand-500/20 ${className}`}>
      {children}
    </span>
  );
};

import React from 'react';
import { Award, ShieldCheck, TrendingUp, AlertTriangle, Scale } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface ComparisonSummaryCardProps {
  summary?: any;
}

export const ComparisonSummaryCard: React.FC<ComparisonSummaryCardProps> = ({ summary }) => {
  if (!summary) return null;

  return (
    <Card title="Comparative Analytical Takeaways" subtitle="Automated multi-country performance evaluation">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <ShieldCheck className="w-4 h-4" /> Safest Haven
          </div>
          <div className="text-sm font-bold text-white">{summary.best_performing || 'N/A'}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">Lowest overall GeoRisk index</div>
        </div>

        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="flex items-center gap-2 text-xs font-semibold text-red-400 mb-1">
            <AlertTriangle className="w-4 h-4" /> Highest Risk Vector
          </div>
          <div className="text-sm font-bold text-white">{summary.highest_risk || 'N/A'}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">Elevated risk exposure</div>
        </div>

        <div className="p-3.5 rounded-xl bg-brand-500/10 border border-brand-500/20">
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-400 mb-1">
            <Award className="w-4 h-4" /> Strongest Economy
          </div>
          <div className="text-sm font-bold text-white">{summary.strongest_economy || 'N/A'}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">Leading GDP & trade sub-score</div>
        </div>

        <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1">
            <Scale className="w-4 h-4" /> Best Political Stability
          </div>
          <div className="text-sm font-bold text-white">{summary.best_political_stability || 'N/A'}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">Governance & stability benchmark</div>
        </div>
      </div>
    </Card>
  );
};

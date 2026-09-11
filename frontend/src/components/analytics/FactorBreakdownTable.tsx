import React from 'react';
import { Card } from '@/components/ui/Card';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface FactorBreakdownTableProps {
  factors: any[];
}

export const FactorBreakdownTable: React.FC<FactorBreakdownTableProps> = ({ factors = [] }) => {
  return (
    <Card title="Risk Factor Contribution Matrix" subtitle="Granular metric score breakdown and impact direction">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="bg-surface-base text-gray-400 uppercase font-semibold border-b border-surface-border">
            <tr>
              <th className="px-4 py-3">Dimension</th>
              <th className="px-4 py-3">Metric Code</th>
              <th className="px-4 py-3">Raw Value</th>
              <th className="px-4 py-3">Normalized Risk</th>
              <th className="px-4 py-3">Weight</th>
              <th className="px-4 py-3">Weighted Score</th>
              <th className="px-4 py-3">Impact Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {factors.map((f, idx) => (
              <tr key={idx} className="hover:bg-surface-hover/50 transition-colors">
                <td className="px-4 py-3 font-semibold text-brand-400">{f.dimension_name}</td>
                <td className="px-4 py-3 font-mono text-gray-200">{f.metric_code}</td>
                <td className="px-4 py-3 font-mono text-gray-300">{f.raw_value !== null ? f.raw_value : 'N/A'}</td>
                <td className="px-4 py-3 font-bold text-white">{f.normalized_score.toFixed(1)} / 100</td>
                <td className="px-4 py-3 text-gray-400">{f.contribution_pct}%</td>
                <td className="px-4 py-3 font-semibold text-white">+{f.weighted_score.toFixed(2)}</td>
                <td className="px-4 py-3 font-medium">
                  {f.impact_type === 'positive' ? (
                    <span className="text-emerald-400 inline-flex items-center gap-1">
                      <ArrowDownRight className="w-3.5 h-3.5" /> Risk Reducer
                    </span>
                  ) : (
                    <span className="text-red-400 inline-flex items-center gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5" /> Risk Driver
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

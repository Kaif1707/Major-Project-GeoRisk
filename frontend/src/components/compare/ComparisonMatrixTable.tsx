import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface ComparisonMatrixTableProps {
  matrix?: any[];
}

export const ComparisonMatrixTable: React.FC<ComparisonMatrixTableProps> = ({ matrix = [] }) => {
  if (!matrix || matrix.length === 0) return null;

  return (
    <Card title="Side-by-Side Indicator Matrix" subtitle="Comparative breakdown across sovereign metrics">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="bg-surface-base text-gray-400 uppercase font-semibold border-b border-surface-border">
            <tr>
              <th className="px-4 py-3">Indicator Metric</th>
              {matrix.map((c) => (
                <th key={c.iso_code} className="px-4 py-3 font-bold text-white text-sm">
                  <span className="mr-1.5">{c.flag || '🌐'}</span> {c.country_name} ({c.iso_code})
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            <tr>
              <td className="px-4 py-3 font-semibold text-brand-400">GeoRisk Index</td>
              {matrix.map((c) => (
                <td key={c.iso_code} className="px-4 py-3 font-extrabold text-white text-sm">
                  {c.overall_score.toFixed(1)} / 100
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-gray-400">Risk Category</td>
              {matrix.map((c) => (
                <td key={c.iso_code} className="px-4 py-3">
                  <Badge category={c.category} />
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-gray-400">Economic Sub-Score</td>
              {matrix.map((c) => (
                <td key={c.iso_code} className="px-4 py-3 font-medium text-gray-200">
                  {c.economic_score.toFixed(1)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-gray-400">Political Sub-Score</td>
              {matrix.map((c) => (
                <td key={c.iso_code} className="px-4 py-3 font-medium text-gray-200">
                  {c.political_score.toFixed(1)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-gray-400">Business Sub-Score</td>
              {matrix.map((c) => (
                <td key={c.iso_code} className="px-4 py-3 font-medium text-gray-200">
                  {c.business_score.toFixed(1)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-gray-400">Real GDP Growth %</td>
              {matrix.map((c) => (
                <td key={c.iso_code} className="px-4 py-3 font-mono text-emerald-400 font-medium">
                  {c.gdp_growth_pct !== null ? `+${c.gdp_growth_pct}%` : 'N/A'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-gray-400">Inflation %</td>
              {matrix.map((c) => (
                <td key={c.iso_code} className="px-4 py-3 font-mono text-amber-400 font-medium">
                  {c.inflation_pct !== null ? `${c.inflation_pct}%` : 'N/A'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-gray-400">Political Stability Index</td>
              {matrix.map((c) => (
                <td key={c.iso_code} className="px-4 py-3 font-mono text-gray-200">
                  {c.political_stability !== null ? c.political_stability : 'N/A'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
};

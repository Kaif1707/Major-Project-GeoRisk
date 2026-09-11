import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card } from '@/components/ui/Card';

interface RiskDistributionChartProps {
  scores?: any[];
}

export const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({ scores = [] }) => {
  const categoryCounts: Record<string, number> = {
    'Very Low': 0,
    'Low': 0,
    'Moderate': 0,
    'Elevated': 0,
    'High': 0,
    'Extreme': 0,
  };

  scores.forEach((s) => {
    const name = s.category?.name || 'Moderate';
    categoryCounts[name] = (categoryCounts[name] || 0) + 1;
  });

  const data = [
    { name: 'Very Low Risk', value: categoryCounts['Very Low'], color: '#10B981' },
    { name: 'Low Risk', value: categoryCounts['Low'], color: '#34D399' },
    { name: 'Moderate Risk', value: categoryCounts['Moderate'], color: '#FBBF24' },
    { name: 'Elevated Risk', value: categoryCounts['Elevated'], color: '#F97316' },
    { name: 'High Risk', value: categoryCounts['High'], color: '#EF4444' },
    { name: 'Extreme Risk', value: categoryCounts['Extreme'], color: '#991B1B' },
  ].filter((d) => d.value > 0);

  return (
    <Card title="Risk Category Distribution" subtitle="Proportion of sovereign risk levels">
      <div className="h-72 w-full">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-gray-500">
            No risk distribution data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#111827" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', borderColor: '#1E293B', borderRadius: '8px', color: '#fff' }}
                formatter={(value: any) => [`${value} Countries`, 'Count']}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{ fontSize: '11px', color: '#9CA3AF' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

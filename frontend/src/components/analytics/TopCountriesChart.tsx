import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface TopCountriesChartProps {
  scores?: any[];
}

export const TopCountriesChart: React.FC<TopCountriesChartProps> = ({ scores = [] }) => {
  const [viewMode, setViewMode] = useState<'safest' | 'riskiest'>('safest');

  const sortedScores = [...scores].sort((a, b) => a.overall_score - b.overall_score);

  const rawData = viewMode === 'safest' ? sortedScores.slice(0, 8) : sortedScores.slice(-8).reverse();

  const data = rawData.map((s) => ({
    name: s.country?.name || s.country_id,
    score: s.overall_score,
    code: s.country?.iso_code,
    category: s.category?.name,
  }));

  return (
    <Card
      title="Sovereign Risk Index Comparison"
      subtitle={viewMode === 'safest' ? 'Top nations with lowest GeoRisk index' : 'Top nations with highest GeoRisk index'}
      action={
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'safest' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('safest')}
          >
            Safest
          </Button>
          <Button
            variant={viewMode === 'riskiest' ? 'danger' : 'outline'}
            size="sm"
            onClick={() => setViewMode('riskiest')}
          >
            Highest Risk
          </Button>
        </div>
      }
    >
      <div className="h-72 w-full">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-gray-500">
            No score data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} stroke="#64748B" fontSize={11} />
              <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={11} width={100} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', borderColor: '#1E293B', borderRadius: '8px', color: '#fff' }}
                formatter={(val: any) => [`${val} / 100`, 'GeoRisk Index']}
              />
              <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                {data.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={
                      entry.score < 20
                        ? '#10B981'
                        : entry.score < 35
                        ? '#34D399'
                        : entry.score < 50
                        ? '#FBBF24'
                        : entry.score < 65
                        ? '#F97316'
                        : '#EF4444'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

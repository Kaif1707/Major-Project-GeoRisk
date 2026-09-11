import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card } from '@/components/ui/Card';

interface ComparisonRadarChartProps {
  scores?: any[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export const ComparisonRadarChart: React.FC<ComparisonRadarChartProps> = ({ scores = [] }) => {
  if (!scores || scores.length < 2) return null;

  const dimensions = ['economic', 'political', 'business', 'social', 'trade', 'currency', 'external', 'conflict'];

  const data = dimensions.map((dim) => {
    const item: any = {
      subject: dim.charAt(0).toUpperCase() + dim.slice(1),
    };
    scores.forEach((s) => {
      const name = s.country?.name || s.country_id;
      item[name] = s[`${dim}_score`] ?? 0;
    });
    return item;
  });

  return (
    <Card title="Multi-Country Overlaid Radar" subtitle="Simultaneous 8-dimension vector comparison">
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#1E293B" />
            <PolarAngleAxis dataKey="subject" stroke="#94A3B8" fontSize={11} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={10} />
            
            {scores.map((s, idx) => {
              const name = s.country?.name || s.country_id;
              return (
                <Radar
                  key={s.id}
                  name={name}
                  dataKey={name}
                  stroke={COLORS[idx % COLORS.length]}
                  fill={COLORS[idx % COLORS.length]}
                  fillOpacity={0.2}
                />
              );
            })}
            
            <Tooltip
              contentStyle={{ backgroundColor: '#111827', borderColor: '#1E293B', borderRadius: '8px', color: '#fff' }}
            />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', color: '#9CA3AF' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

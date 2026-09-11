import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '@/components/ui/Card';

interface RiskRadarChartProps {
  scoreDetail?: any;
}

export const RiskRadarChart: React.FC<RiskRadarChartProps> = ({ scoreDetail }) => {
  const data = [
    { subject: 'Economic', score: scoreDetail?.economic_score ?? 0, fullMark: 100 },
    { subject: 'Political', score: scoreDetail?.political_score ?? 0, fullMark: 100 },
    { subject: 'Business', score: scoreDetail?.business_score ?? 0, fullMark: 100 },
    { subject: 'Social', score: scoreDetail?.social_score ?? 0, fullMark: 100 },
    { subject: 'Trade', score: scoreDetail?.trade_score ?? 0, fullMark: 100 },
    { subject: 'Currency', score: scoreDetail?.currency_score ?? 0, fullMark: 100 },
    { subject: 'External', score: scoreDetail?.external_score ?? 0, fullMark: 100 },
    { subject: 'Conflict', score: scoreDetail?.conflict_score ?? 0, fullMark: 100 },
  ];

  return (
    <Card title="8-Dimension Risk Vector Radar" subtitle="Multidimensional risk breakdown (0-100)">
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#1E293B" />
            <PolarAngleAxis dataKey="subject" stroke="#94A3B8" fontSize={11} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={10} />
            <Radar
              name="Risk Vector"
              dataKey="score"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.35}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#111827', borderColor: '#1E293B', borderRadius: '8px', color: '#fff' }}
              formatter={(val: any) => [`${val} / 100`, 'Dimension Risk']}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

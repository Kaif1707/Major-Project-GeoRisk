import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import { Card } from '@/components/ui/Card';

interface ForecastChartProps {
  forecasts?: any[];
  currentScore?: number;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ forecasts = [], currentScore = 25.0 }) => {
  const data = [
    { horizon: 'Current', score: currentScore, lower: currentScore, upper: currentScore },
    ...forecasts.map((f) => ({
      horizon: `${f.forecast_horizon_days} Days`,
      score: f.predicted_value,
      lower: f.lower_bound,
      upper: f.upper_bound,
    })),
  ];

  return (
    <Card title="Time-Series Risk Trajectory Forecast" subtitle="30-day to 365-day projections with 95% confidence corridor">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis dataKey="horizon" stroke="#94A3B8" fontSize={11} />
            <YAxis domain={[0, 100]} stroke="#64748B" fontSize={11} />
            <Tooltip
              contentStyle={{ backgroundColor: '#111827', borderColor: '#1E293B', borderRadius: '8px', color: '#fff' }}
              formatter={(val: any) => [`${val} / 100`, 'Score']}
            />
            <Area type="monotone" dataKey="upper" stroke="none" fill="#3B82F6" fillOpacity={0.15} />
            <Area type="monotone" dataKey="lower" stroke="none" fill="#3B82F6" fillOpacity={0.15} />
            <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={3} dot={{ r: 5, fill: '#3B82F6' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, ShieldAlert, Globe, Layers, ArrowUpRight, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';
import { useRiskScores, useRegions } from '@/hooks/useRiskData';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const AnalyticsPage: React.FC = () => {
  const { data: riskScoresResponse, isLoading } = useRiskScores();
  const { data: regionsResponse } = useRegions();

  const scores = riskScoresResponse?.data || [];
  const regions = regionsResponse?.data || [];

  // 1. Regional Risk Aggregates
  const regionalData = React.useMemo(() => {
    if (!scores.length) return [];
    const map: Record<string, { total: number; count: number }> = {};
    scores.forEach((s: any) => {
      const reg = s.country?.region || 'Global';
      if (!map[reg]) map[reg] = { total: 0, count: 0 };
      map[reg].total += s.overall_score;
      map[reg].count += 1;
    });
    return Object.keys(map).map((reg) => ({
      region: reg,
      averageScore: Number((map[reg].total / map[reg].count).toFixed(1)),
      count: map[reg].count,
    }));
  }, [scores]);

  // 2. Risk Category Counts
  const categoryData = React.useMemo(() => {
    if (!scores.length) return [];
    const map: Record<string, { count: number; color: string }> = {
      'Very Low': { count: 0, color: '#10B981' },
      'Low': { count: 0, color: '#34D399' },
      'Moderate': { count: 0, color: '#FBBF24' },
      'Elevated': { count: 0, color: '#F97316' },
      'High': { count: 0, color: '#EF4444' },
      'Extreme': { count: 0, color: '#991B1B' },
    };
    scores.forEach((s: any) => {
      const cat = s.category?.name || 'Moderate';
      if (map[cat]) map[cat].count += 1;
    });
    return Object.keys(map).map((cat) => ({
      name: cat,
      value: map[cat].count,
      color: map[cat].color,
    }));
  }, [scores]);

  // 3. Scatter Matrix (Political Score vs Economic Score)
  const scatterData = React.useMemo(() => {
    return scores.map((s: any) => ({
      name: s.country?.name || s.country_id,
      iso: s.country?.iso_code,
      x: Number((s.political_score || 40).toFixed(1)), // Political
      y: Number((s.economic_score || 40).toFixed(1)),  // Economic
      z: Number((s.overall_score || 40).toFixed(1)),
    }));
  }, [scores]);

  // 4. Weight Matrix Breakdown
  const weightData = [
    { dimension: 'Economic Risk', weight: 30, color: '#3B82F6' },
    { dimension: 'Political Stability', weight: 25, color: '#10B981' },
    { dimension: 'Business Environment', weight: 15, color: '#F59E0B' },
    { dimension: 'Social & HDI', weight: 10, color: '#8B5CF6' },
    { dimension: 'Geopolitical Conflict', weight: 10, color: '#EF4444' },
    { dimension: 'Trade & Tariffs', weight: 5, color: '#06B6D4' },
    { dimension: 'Currency Stability', weight: 3, color: '#EC4899' },
    { dimension: 'External Factors', weight: 2, color: '#64748B' },
  ];

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center text-xs text-gray-400">
        <Activity className="w-5 h-5 animate-spin mr-2 text-brand-400" /> Generating advanced macroeconomic analytics...
      </div>
    );
  }

  const globalAvgScore = scores.length ? (scores.reduce((a: number, b: any) => a + b.overall_score, 0) / scores.length).toFixed(1) : '38.4';
  const highRiskCount = scores.filter((s: any) => s.overall_score >= 65).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-100 tracking-tight">Advanced Macroeconomic & GeoRisk Analytics Studio</h1>
        <p className="text-xs text-gray-400 mt-1">Cross-country statistical correlation, dimension sensitivity models, and regional aggregate analysis.</p>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-surface-elevated border border-surface-border space-y-1">
          <div className="text-[11px] text-gray-400 font-semibold flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-brand-400" /> Nations Analyzed
          </div>
          <div className="text-2xl font-black text-white">{scores.length || 45} Nations</div>
          <div className="text-[10px] text-emerald-400 font-mono">100% Coverage across 6 Regions</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-elevated border border-surface-border space-y-1">
          <div className="text-[11px] text-gray-400 font-semibold flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-amber-400" /> Global Risk Index Mean
          </div>
          <div className="text-2xl font-black text-amber-400">{globalAvgScore} <span className="text-xs text-gray-400">/ 100</span></div>
          <div className="text-[10px] text-gray-400 font-mono">MinMax Normalized Aggregate</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-elevated border border-surface-border space-y-1">
          <div className="text-[11px] text-gray-400 font-semibold flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-red-400" /> High/Extreme Risk Nations
          </div>
          <div className="text-2xl font-black text-red-400">{highRiskCount} Countries</div>
          <div className="text-[10px] text-red-400 font-mono">Requires Enhanced Due Diligence</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-elevated border border-surface-border space-y-1">
          <div className="text-[11px] text-gray-400 font-semibold flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-400" /> Scoring Engine Rules
          </div>
          <div className="text-2xl font-black text-white">8 Dimensions</div>
          <div className="text-[10px] text-brand-400 font-mono">100% Weight Matrix Sensitivity</div>
        </div>
      </div>

      {/* Row 1: Regional Risk Aggregates Bar Chart & Category Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Regional Average Risk Index" subtitle="Continental sovereign risk mean comparison">
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="region" stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 10 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#60A5FA' }}
                />
                <Bar dataKey="averageScore" name="Avg GeoRisk Score" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Sovereign Risk Category Distribution" subtitle="Distribution of nations by risk tier">
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 2: Scatter Matrix (Political vs Economic Risk) & Weight Matrix Sensitivity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Governance Stability vs Economic Sub-score Matrix" subtitle="Sovereign risk quadrant mapping">
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                <XAxis dataKey="x" name="Political Score" stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 10 }} label={{ value: 'Political Stability Score', position: 'bottom', offset: 0, fill: '#6B7280', fontSize: 10 }} />
                <YAxis dataKey="y" name="Economic Score" stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 10 }} label={{ value: 'Economic Risk Score', angle: -90, position: 'insideLeft', fill: '#6B7280', fontSize: 10 }} />
                <ZAxis dataKey="name" name="Country" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }}
                />
                <Scatter name="Countries" data={scatterData} fill="#10B981" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="GeoRisk Dimension Weight Matrix" subtitle="Normalized weighting factors across 8 sub-indices">
          <div className="space-y-3 pt-2">
            {weightData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs text-gray-300 font-semibold">
                  <span>{item.dimension}</span>
                  <span className="font-mono text-brand-400">{item.weight}% Weight</span>
                </div>
                <div className="w-full bg-surface-base h-2 rounded-full overflow-hidden border border-surface-border">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${item.weight * 3.3}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

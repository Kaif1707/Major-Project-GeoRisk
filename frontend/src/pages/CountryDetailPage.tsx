import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Download, Globe, BarChart2 } from 'lucide-react';
import { useCountryRiskDetail, useRiskBreakdown, useCountryDetail } from '@/hooks/useRiskData';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { RiskRadarChart } from '@/components/analytics/RiskRadarChart';
import { FactorBreakdownTable } from '@/components/analytics/FactorBreakdownTable';

export const CountryDetailPage: React.FC = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'factors' | 'indicators'>('overview');

  const { data: scoreData, isLoading: scoreLoading } = useCountryRiskDetail(code || '');
  const { data: breakdownData, isLoading: breakdownLoading } = useRiskBreakdown(code || '');
  const { data: countryData, isLoading: countryLoading } = useCountryDetail(code || '');

  const scoreObj = scoreData?.data;
  const breakdown = breakdownData?.data;
  const country = countryData?.data?.country || scoreObj?.country;
  const rawIndicators = countryData?.data?.indicators;

  if (scoreLoading || countryLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="w-48 h-8 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="w-full h-48 rounded-xl" />
          <Skeleton className="w-full h-48 rounded-xl md:col-span-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Country Detail Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-2xl">{country?.flag_url || '🌐'}</span>
              <span>{country?.name || code}</span>
              <span className="text-brand-400 font-mono text-sm">[{country?.iso_code || code}]</span>
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Region: {country?.region || 'Global'} • Capital: {country?.capital || 'N/A'} • Population: {country?.population ? country.population.toLocaleString() : 'N/A'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge category={scoreObj?.category?.name || 'Moderate'} />
          <Button variant="primary" size="sm">
            <Download className="w-4 h-4 mr-2" /> Export Dossier
          </Button>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-surface-border space-x-6 text-sm font-medium text-gray-400">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'overview' ? 'text-brand-400 border-b-2 border-brand-500 font-semibold' : 'hover:text-gray-200'
          }`}
        >
          Overview & Vector Radar
        </button>
        <button
          onClick={() => setActiveTab('factors')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'factors' ? 'text-brand-400 border-b-2 border-brand-500 font-semibold' : 'hover:text-gray-200'
          }`}
        >
          Factor Contribution Breakdown
        </button>
        <button
          onClick={() => setActiveTab('indicators')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'indicators' ? 'text-brand-400 border-b-2 border-brand-500 font-semibold' : 'hover:text-gray-200'
          }`}
        >
          Raw Indicator Suite
        </button>
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Score Card */}
            <Card title="Overall GeoRisk Index" subtitle="Quantitative risk score (0-100)">
              <div className="h-64 border border-surface-border rounded-xl flex flex-col items-center justify-center p-6 text-center bg-surface-base relative overflow-hidden">
                <ShieldCheck className="w-12 h-12 text-brand-400 mb-2" />
                <div className="text-4xl font-black text-white tracking-tight">
                  {scoreObj?.overall_score ? scoreObj.overall_score.toFixed(1) : '24.5'}
                </div>
                <div className="text-xs text-gray-400 mt-1 font-medium">Global Rank: #{scoreObj?.global_rank || '-'}</div>
                <div className="mt-3">
                  <Badge category={scoreObj?.category?.name || 'Moderate'} />
                </div>
              </div>
            </Card>

            {/* Radar Chart */}
            <div className="lg:col-span-2">
              <RiskRadarChart scoreDetail={scoreObj} />
            </div>
          </div>

          {/* 8 Dimension Sub-Scores Grid */}
          <Card title="8-Dimension Risk Sub-Scores" subtitle="Decomposed risk index components">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 bg-surface-base border border-surface-border rounded-lg text-center">
                <div className="text-[11px] text-gray-400 font-medium">Economic</div>
                <div className="text-lg font-bold text-white mt-1">{scoreObj?.economic_score?.toFixed(1) || '0.0'}</div>
              </div>
              <div className="p-3 bg-surface-base border border-surface-border rounded-lg text-center">
                <div className="text-[11px] text-gray-400 font-medium">Political</div>
                <div className="text-lg font-bold text-white mt-1">{scoreObj?.political_score?.toFixed(1) || '0.0'}</div>
              </div>
              <div className="p-3 bg-surface-base border border-surface-border rounded-lg text-center">
                <div className="text-[11px] text-gray-400 font-medium">Business</div>
                <div className="text-lg font-bold text-white mt-1">{scoreObj?.business_score?.toFixed(1) || '0.0'}</div>
              </div>
              <div className="p-3 bg-surface-base border border-surface-border rounded-lg text-center">
                <div className="text-[11px] text-gray-400 font-medium">Social</div>
                <div className="text-lg font-bold text-white mt-1">{scoreObj?.social_score?.toFixed(1) || '0.0'}</div>
              </div>
              <div className="p-3 bg-surface-base border border-surface-border rounded-lg text-center">
                <div className="text-[11px] text-gray-400 font-medium">Trade</div>
                <div className="text-lg font-bold text-white mt-1">{scoreObj?.trade_score?.toFixed(1) || '0.0'}</div>
              </div>
              <div className="p-3 bg-surface-base border border-surface-border rounded-lg text-center">
                <div className="text-[11px] text-gray-400 font-medium">Currency</div>
                <div className="text-lg font-bold text-white mt-1">{scoreObj?.currency_score?.toFixed(1) || '0.0'}</div>
              </div>
              <div className="p-3 bg-surface-base border border-surface-border rounded-lg text-center">
                <div className="text-[11px] text-gray-400 font-medium">External</div>
                <div className="text-lg font-bold text-white mt-1">{scoreObj?.external_score?.toFixed(1) || '0.0'}</div>
              </div>
              <div className="p-3 bg-surface-base border border-surface-border rounded-lg text-center">
                <div className="text-[11px] text-gray-400 font-medium">Conflict</div>
                <div className="text-lg font-bold text-white mt-1">{scoreObj?.conflict_score?.toFixed(1) || '0.0'}</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Factors Tab Content */}
      {activeTab === 'factors' && (
        <FactorBreakdownTable factors={breakdown?.all_factors || []} />
      )}

      {/* Raw Indicators Tab Content */}
      {activeTab === 'indicators' && (
        <Card title="Raw Macroeconomic & Sovereign Indicators" subtitle="Imported World Bank & IMF data feed">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-brand-400">Economic Indicators Series</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-surface-base uppercase font-semibold text-gray-400">
                  <tr>
                    <th className="px-3 py-2">Year</th>
                    <th className="px-3 py-2">GDP (USD)</th>
                    <th className="px-3 py-2">GDP Growth %</th>
                    <th className="px-3 py-2">Inflation %</th>
                    <th className="px-3 py-2">Unemployment %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {rawIndicators?.economic?.map((e: any) => (
                    <tr key={e.id}>
                      <td className="px-3 py-2 font-mono font-bold text-white">{e.year}</td>
                      <td className="px-3 py-2 font-mono">{e.gdp_usd ? `$${(e.gdp_usd / 1e9).toFixed(1)}B` : 'N/A'}</td>
                      <td className="px-3 py-2 font-mono text-emerald-400">+{e.gdp_growth_pct}%</td>
                      <td className="px-3 py-2 font-mono text-amber-400">{e.inflation_pct}%</td>
                      <td className="px-3 py-2 font-mono text-gray-300">{e.unemployment_pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

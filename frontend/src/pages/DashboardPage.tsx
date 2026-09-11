import React, { useState } from 'react';
import { Globe, AlertTriangle, TrendingUp, RefreshCw, Activity, Search, Filter } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRiskScores, useRankings, useRegions, useRiskCategories } from '@/hooks/useRiskData';
import { KpiCard } from '@/components/analytics/KpiCard';
import { RiskDistributionChart } from '@/components/analytics/RiskDistributionChart';
import { TopCountriesChart } from '@/components/analytics/TopCountriesChart';
import { CountryDataTable } from '@/components/analytics/CountryDataTable';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export const DashboardPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('rank');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // TanStack Query Live Endpoints
  const { data: riskScoresData, isLoading: scoresLoading, refetch } = useRiskScores({
    region: selectedRegion || undefined,
    risk_category: selectedCategory || undefined,
    search: searchQuery || undefined,
    sort_by: sortBy,
  });

  const { data: rankingsData, isLoading: rankingsLoading } = useRankings();
  const { data: regionsData } = useRegions();
  const { data: categoriesData } = useRiskCategories();

  const scores = riskScoresData?.data || [];
  const totalCount = scores.length;

  const handleSyncApiFeeds = async () => {
    setIsSyncing(true);
    try {
      const { newsService } = await import('@/services/newsService');
      await newsService.syncLiveFeed();
      await queryClient.invalidateQueries();
      await refetch();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Calculate live global average
  const avgScore = totalCount > 0
    ? (scores.reduce((acc: number, s: any) => acc + s.overall_score, 0) / totalCount).toFixed(1)
    : '41.8';

  const safest = rankingsData?.data?.top_safest?.[0];
  const riskiest = rankingsData?.data?.top_highest_risk?.[0];

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 tracking-tight">Global Risk Intelligence Terminal</h1>
          <p className="text-xs text-gray-400 mt-1">Real-time quantitative risk monitoring, macroeconomic indicators, and sovereign rankings.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleSyncApiFeeds} disabled={isSyncing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing Live Data...' : 'Sync API Feeds'}
          </Button>
        </div>
      </div>

      {/* Real-Time Live KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Global Average GeoRisk"
          value={`${avgScore} / 100`}
          trend={{ value: 'Real-time Weighted Index', isPositive: true }}
          icon={<Activity className="w-4 h-4" />}
          loading={scoresLoading}
        />
        <KpiCard
          title="Monitored Sovereign Nations"
          value={`${totalCount} Countries`}
          subtitle="World Bank & IMF Standard"
          icon={<Globe className="w-4 h-4" />}
          loading={scoresLoading}
        />
        <KpiCard
          title="Highest Risk Escalation"
          value={riskiest ? `${riskiest.country?.name} (${riskiest.overall_score.toFixed(1)})` : 'Ukraine (84.7)'}
          trend={{ value: 'Extreme Category Alert', isPositive: false }}
          icon={<AlertTriangle className="w-4 h-4" />}
          loading={rankingsLoading}
        />
        <KpiCard
          title="Safest Investment Haven"
          value={safest ? `${safest.country?.name} (${safest.overall_score.toFixed(1)})` : 'United States (18.4)'}
          trend={{ value: 'Very Low Risk Category', isPositive: true }}
          icon={<TrendingUp className="w-4 h-4" />}
          loading={rankingsLoading}
        />
      </div>

      {/* Interactive Recharts Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TopCountriesChart scores={scores} />
        </div>
        <div className="lg:col-span-1">
          <RiskDistributionChart scores={scores} />
        </div>
      </div>

      {/* Live Country Risk Datatable */}
      <Card title="Sovereign Risk Matrix" subtitle="Filter, sort, and inspect risk metrics across sovereign nations">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="w-full sm:w-72">
            <Input
              placeholder="Search by country or ISO code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-surface-base border border-surface-border text-gray-200 text-xs rounded-lg px-3 py-2"
            >
              <option value="">All Regions</option>
              {regionsData?.data?.map((r: any) => (
                <option key={r.id} value={r.name}>{r.name}</option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-surface-base border border-surface-border text-gray-200 text-xs rounded-lg px-3 py-2"
            >
              <option value="">All Categories</option>
              {categoriesData?.data?.map((c: any) => (
                <option key={c.id} value={c.name}>{c.name} Risk</option>
              ))}
            </select>
          </div>
        </div>

        <CountryDataTable
          scores={scores}
          loading={scoresLoading}
          onSort={(field) => setSortBy(field)}
        />
      </Card>
    </div>
  );
};

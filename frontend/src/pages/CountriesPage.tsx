import React, { useState } from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { useRiskScores, useRegions, useRiskCategories } from '@/hooks/useRiskData';
import { CountryDataTable } from '@/components/analytics/CountryDataTable';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export const CountriesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('rank');

  const { data: scoresData, isLoading, refetch } = useRiskScores({
    search: search || undefined,
    region: selectedRegion || undefined,
    risk_category: selectedCategory || undefined,
    sort_by: sortBy,
  });

  const { data: regionsData } = useRegions();
  const { data: categoriesData } = useRiskCategories();

  const scores = scoresData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 tracking-tight">Sovereign Country Intelligence</h1>
          <p className="text-xs text-gray-400 mt-1">Explore, filter, and inspect quantitative risk metrics across sovereign nations.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4 mr-2" /> Sync Records
        </Button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search country by name or ISO code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
          loading={isLoading}
          onSort={(field) => setSortBy(field)}
        />
      </Card>
    </div>
  );
};

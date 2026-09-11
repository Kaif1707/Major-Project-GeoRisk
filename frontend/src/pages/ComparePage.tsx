import React, { useState } from 'react';
import { GitCompare, Plus, X, RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useComparison } from '@/hooks/useMapCompareData';
import { useRiskScores } from '@/hooks/useRiskData';
import { ComparisonSummaryCard } from '@/components/compare/ComparisonSummaryCard';
import { ComparisonRadarChart } from '@/components/compare/ComparisonRadarChart';
import { ComparisonMatrixTable } from '@/components/compare/ComparisonMatrixTable';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const ComparePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedCodes, setSelectedCodes] = useState<string[]>(['USA', 'DEU', 'IND', 'SGP']);
  const [candidateCode, setCandidateCode] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const { data: riskScoresData } = useRiskScores();
  const availableCountries = riskScoresData?.data || [];

  const { data: compareResponse, isLoading, refetch } = useComparison(selectedCodes);

  const compareData = compareResponse?.data;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const { newsService } = await import('@/services/newsService');
      await newsService.syncLiveFeed();
      await queryClient.invalidateQueries();
      await refetch();
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAddCountry = (code: string) => {
    if (!code) return;
    if (selectedCodes.includes(code)) return;
    if (selectedCodes.length >= 5) return;
    setSelectedCodes([...selectedCodes, code]);
    setCandidateCode('');
  };

  const handleRemoveCountry = (code: string) => {
    if (selectedCodes.length <= 2) return;
    setSelectedCodes(selectedCodes.filter((c) => c !== code));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 tracking-tight">Multi-Country Comparison Studio</h1>
          <p className="text-xs text-gray-400 mt-1">Benchmark 2 to 5 sovereign nations side-by-side across multidimensional risk vectors.</p>
        </div>
        <Button variant="primary" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} /> Sync & Refresh Matrix
        </Button>
      </div>

      {/* Country Selection Combobox & Active Badges */}
      <Card title="Selected Comparison Portfolio" subtitle="Select between 2 and 5 countries to analyze">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {selectedCodes.map((code) => {
              const item = availableCountries.find((c: any) => c.country?.iso_code === code);
              return (
                <span
                  key={code}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-base border border-surface-border text-xs font-semibold text-white shadow-sm"
                >
                  <span>{item?.country?.flag_url || '🌐'}</span>
                  <span>{item?.country?.name || code}</span>
                  <span className="text-[10px] text-brand-400 font-mono">[{code}]</span>
                  {selectedCodes.length > 2 && (
                    <button
                      onClick={() => handleRemoveCountry(code)}
                      className="text-gray-400 hover:text-red-400 transition-colors ml-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </span>
              );
            })}
          </div>

          {selectedCodes.length < 5 && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={candidateCode}
                onChange={(e) => handleAddCountry(e.target.value)}
                className="bg-surface-base border border-surface-border text-gray-200 text-xs rounded-lg px-3 py-2"
              >
                <option value="">+ Add Country to Portfolio...</option>
                {availableCountries
                  .filter((c: any) => !selectedCodes.includes(c.country?.iso_code))
                  .map((c: any) => (
                    <option key={c.id} value={c.country?.iso_code}>
                      {c.country?.name} ({c.country?.iso_code})
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>
      </Card>

      {/* Comparative Analytical Takeaways */}
      <ComparisonSummaryCard summary={compareData?.summary} />

      {/* Multi-Country Overlaid Radar Chart */}
      <ComparisonRadarChart scores={compareData?.scores} />

      {/* Side-by-Side Matrix Table */}
      <ComparisonMatrixTable matrix={compareData?.indicator_matrix} />
    </div>
  );
};

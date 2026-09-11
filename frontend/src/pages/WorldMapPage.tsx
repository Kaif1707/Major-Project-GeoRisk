import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useMapData } from '@/hooks/useMapCompareData';
import { useRegions, useRiskScores } from '@/hooks/useRiskData';
import { InteractiveWorldMap } from '@/components/map/InteractiveWorldMap';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const WorldMapPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedRegion, setSelectedRegion] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const { data: mapResponse, isLoading, refetch } = useMapData({ region: selectedRegion || undefined });
  const { data: riskScoresResponse } = useRiskScores();
  const { data: regionsResponse } = useRegions();

  let features = mapResponse?.data?.features || [];

  if (features.length === 0 && riskScoresResponse?.data) {
    features = riskScoresResponse.data.map((s: any) => ({
      country_id: s.country_id || s.id,
      name: s.country?.name || 'Sovereign Nation',
      iso_code: s.country?.iso_code || 'USA',
      latitude: s.country?.latitude || 20.0,
      longitude: s.country?.longitude || 0.0,
      overall_score: s.overall_score,
      category_name: s.category?.name || 'Moderate',
      color_code: s.category?.color_code || '#FBBF24',
      economic_score: s.economic_score,
      political_score: s.political_score,
      business_score: s.business_score,
    }));
  }

  const handleSyncGis = async () => {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 tracking-tight">Interactive Global GeoRisk Heatmap</h1>
          <p className="text-xs text-gray-400 mt-1">Spatial GIS risk visualization with hover tooltips and choropleth category coloring.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-surface-base border border-surface-border text-gray-200 text-xs rounded-lg px-3 py-2"
          >
            <option value="">All Regions</option>
            {regionsResponse?.data?.map((r: any) => (
              <option key={r.id} value={r.name}>{r.name}</option>
            ))}
          </select>
          <Button variant="primary" size="sm" onClick={handleSyncGis} disabled={isSyncing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing GIS Layer...' : 'Sync GIS Layer'}
          </Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <InteractiveWorldMap features={features} />
      </Card>
    </div>
  );
};

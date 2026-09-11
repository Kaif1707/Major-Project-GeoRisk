import React, { useState } from 'react';
import { TrendingUp, RefreshCw, Sliders, Calendar } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useCountryForecasts } from '@/hooks/useAiNewsForecastData';
import { useRiskScores } from '@/hooks/useRiskData';
import { ForecastChart } from '@/components/forecast/ForecastChart';
import { ScenarioSimulator } from '@/components/forecast/ScenarioSimulator';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const ForecastPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedCountryCode, setSelectedCountryCode] = useState('USA');
  const [isSyncing, setIsSyncing] = useState(false);

  const { data: riskScoresData } = useRiskScores();
  const countries = riskScoresData?.data || [];

  const { data: forecastResponse, isLoading, refetch } = useCountryForecasts(selectedCountryCode);

  const forecasts = forecastResponse?.data || [];
  const selectedCountryObj = countries.find((c: any) => c.country?.iso_code === selectedCountryCode);
  const currentScore = selectedCountryObj?.overall_score || 24.5;

  const handleRecalculateForecast = async () => {
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 tracking-tight">Time-Series Risk Forecasting & Scenario Studio</h1>
          <p className="text-xs text-gray-400 mt-1">Predictive machine learning risk trajectories and what-if stress event simulations.</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCountryCode}
            onChange={(e) => setSelectedCountryCode(e.target.value)}
            className="bg-surface-base border border-surface-border text-gray-200 text-xs rounded-lg px-3 py-2 font-semibold"
          >
            {countries.map((c: any) => (
              <option key={c.id} value={c.country?.iso_code}>
                {c.country?.name} ({c.country?.iso_code})
              </option>
            ))}
          </select>

          <Button variant="outline" size="sm" onClick={handleRecalculateForecast} disabled={isSyncing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Recalculating...' : 'Recalculate Forecast'}
          </Button>
        </div>
      </div>

      {/* Main Trajectory Chart */}
      {isLoading ? (
        <Card className="p-8 text-center text-xs text-gray-500">Loading forecast trajectory model...</Card>
      ) : (
        <ForecastChart forecasts={forecasts} currentScore={currentScore} />
      )}

      {/* Forecast Horizon Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {forecasts.map((f: any) => (
          <div key={f.id} className="p-4 rounded-xl bg-surface-elevated border border-surface-border space-y-1">
            <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-brand-400" /> {f.forecast_horizon_days} Days</span>
              <span className="font-mono text-emerald-400 font-bold">{f.trend_direction.toUpperCase()}</span>
            </div>
            <div className="text-2xl font-black text-white">{f.predicted_value.toFixed(1)}</div>
            <div className="text-[10px] text-gray-400">Range: {f.lower_bound.toFixed(1)} - {f.upper_bound.toFixed(1)}</div>
          </div>
        ))}
      </div>

      {/* What-If Scenario Simulator Studio */}
      <ScenarioSimulator countryCode={selectedCountryCode} />
    </div>
  );
};

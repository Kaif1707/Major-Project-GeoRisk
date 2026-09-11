import React, { useState } from 'react';
import { Sliders, RefreshCw, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRunScenarioMutation } from '@/hooks/useAiNewsForecastData';
import { Badge } from '@/components/ui/Badge';

interface ScenarioSimulatorProps {
  countryCode: string;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({ countryCode }) => {
  const [gdpDelta, setGdpDelta] = useState(0.0);
  const [inflationDelta, setInflationDelta] = useState(0.0);
  const [polDelta, setPolDelta] = useState(0.0);
  const [unempDelta, setUnempDelta] = useState(0.0);

  const scenarioMutation = useRunScenarioMutation();

  const handleSimulate = () => {
    scenarioMutation.mutate({
      country_code: countryCode,
      gdp_delta_pct: gdpDelta,
      inflation_delta_pct: inflationDelta,
      pol_instability_delta: polDelta,
      unemp_delta_pct: unempDelta,
    });
  };

  const simResult = scenarioMutation.data?.data;

  return (
    <Card title="What-If Scenario Simulation Studio" subtitle="Simulate synthetic macro stress events to predict instant score shifts">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sliders Input Panel */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-medium text-gray-300 mb-1">
              <span>GDP Growth Delta:</span>
              <span className="font-mono text-emerald-400">{gdpDelta > 0 ? `+${gdpDelta}%` : `${gdpDelta}%`}</span>
            </div>
            <input
              type="range"
              min="-5.0"
              max="5.0"
              step="0.5"
              value={gdpDelta}
              onChange={(e) => setGdpDelta(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-surface-border rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-300 mb-1">
              <span>Inflation Delta:</span>
              <span className="font-mono text-amber-400">{inflationDelta > 0 ? `+${inflationDelta}%` : `${inflationDelta}%`}</span>
            </div>
            <input
              type="range"
              min="-10.0"
              max="10.0"
              step="1.0"
              value={inflationDelta}
              onChange={(e) => setInflationDelta(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-surface-border rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-300 mb-1">
              <span>Political Instability Index Shift:</span>
              <span className="font-mono text-purple-400">{polDelta > 0 ? `+${polDelta}` : `${polDelta}`}</span>
            </div>
            <input
              type="range"
              min="-20.0"
              max="20.0"
              step="2.0"
              value={polDelta}
              onChange={(e) => setPolDelta(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-surface-border rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          <Button variant="primary" size="sm" onClick={handleSimulate} disabled={scenarioMutation.isPending}>
            <Zap className="w-4 h-4 mr-2" /> Calculate Stress Shift
          </Button>
        </div>

        {/* Prediction Results Display */}
        <div className="p-4 rounded-xl bg-surface-base border border-surface-border flex flex-col justify-between">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Simulation Results</div>

          {simResult ? (
            <div className="my-auto space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Original Baseline:</span>
                <span className="text-sm font-bold text-gray-200">{simResult.original_score.toFixed(1)} / 100</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Simulated Predicted Index:</span>
                <span className="text-2xl font-black text-white">{simResult.predicted_score.toFixed(1)} / 100</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Predicted Score Shift:</span>
                <span className={`text-sm font-extrabold flex items-center gap-1 ${simResult.score_delta > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {simResult.score_delta > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {simResult.score_delta > 0 ? `+${simResult.score_delta.toFixed(1)}` : simResult.score_delta.toFixed(1)}
                </span>
              </div>
              <div className="pt-2 border-t border-surface-border flex items-center justify-between">
                <span className="text-xs text-gray-400">Projected Category:</span>
                <Badge category={simResult.predicted_category} />
              </div>
            </div>
          ) : (
            <div className="my-auto text-center text-xs text-gray-500 py-6">
              Adjust sliders and click "Calculate Stress Shift" to run scenario simulation.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

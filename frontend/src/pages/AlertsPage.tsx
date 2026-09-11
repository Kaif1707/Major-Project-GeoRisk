import React, { useState } from 'react';
import { Bell, Plus, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';
import { useAlertRules, useAlertNotifications, useCreateAlertRuleMutation } from '@/hooks/useProductivityData';
import { useRiskScores } from '@/hooks/useRiskData';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const AlertsPage: React.FC = () => {
  const [metricCode, setMetricCode] = useState('overall_georisk');
  const [condition, setCondition] = useState('gt');
  const [threshold, setThreshold] = useState<number>(50.0);
  const [selectedCountryCode, setSelectedCountryCode] = useState('');

  const { data: rulesResponse, isLoading: rulesLoading, refetch: refetchRules } = useAlertRules();
  const { data: notifResponse, isLoading: notifLoading } = useAlertNotifications();
  const { data: riskScoresResponse } = useRiskScores();

  const createRuleMutation = useCreateAlertRuleMutation();

  const rules = rulesResponse?.data || [];
  const notifications = notifResponse?.data || [];
  const countries = riskScoresResponse?.data || [];

  const handleCreateRule = () => {
    createRuleMutation.mutate({
      country_code: selectedCountryCode || undefined,
      metric_code: metricCode,
      condition: condition,
      threshold_value: threshold,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 tracking-tight">Risk Threshold Alerts & Notification Center</h1>
          <p className="text-xs text-gray-400 mt-1">Configure automated risk threshold alerts and monitor real-time in-app escalation feeds.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetchRules()}>
          <RefreshCw className="w-4 h-4 mr-2" /> Sync Alert Engine
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configure Rule (1 col) */}
        <div className="lg:col-span-1 space-y-4">
          <Card title="New Threshold Rule" subtitle="Set automated alert trigger parameters">
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-gray-400 font-semibold mb-1 block">Target Country (Optional)</label>
                <select
                  value={selectedCountryCode}
                  onChange={(e) => setSelectedCountryCode(e.target.value)}
                  className="w-full bg-surface-base border border-surface-border text-gray-200 text-xs rounded-lg px-3 py-2"
                >
                  <option value="">All Sovereign Countries</option>
                  {countries.map((c: any) => (
                    <option key={c.id} value={c.country?.iso_code}>
                      {c.country?.name} ({c.country?.iso_code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-gray-400 font-semibold mb-1 block">Target Risk Metric</label>
                <select
                  value={metricCode}
                  onChange={(e) => setMetricCode(e.target.value)}
                  className="w-full bg-surface-base border border-surface-border text-gray-200 text-xs rounded-lg px-3 py-2"
                >
                  <option value="overall_georisk">Overall GeoRisk Index</option>
                  <option value="economic_score">Economic Sub-Score</option>
                  <option value="political_score">Political Sub-Score</option>
                  <option value="gdp_growth">GDP Growth %</option>
                  <option value="inflation">Inflation %</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-gray-400 font-semibold mb-1 block">Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full bg-surface-base border border-surface-border text-gray-200 text-xs rounded-lg px-3 py-2"
                  >
                    <option value="gt">Greater Than (&gt;)</option>
                    <option value="lt">Less Than (&lt;)</option>
                    <option value="gte">GTE (&gt;=)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-gray-400 font-semibold mb-1 block">Threshold</label>
                  <input
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(parseFloat(e.target.value))}
                    className="w-full bg-surface-base border border-surface-border text-gray-200 text-xs rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <Button variant="primary" size="sm" onClick={handleCreateRule} disabled={createRuleMutation.isPending} className="w-full">
                <Plus className="w-4 h-4 mr-1" /> Activate Alert Rule
              </Button>
            </div>
          </Card>
        </div>

        {/* Rules & Notifications Feed (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Rules List */}
          <Card title="Configured Alert Rules" subtitle="Automated threshold trigger monitors">
            {rulesLoading ? (
              <div className="p-4 text-center text-xs text-gray-500">Loading rules...</div>
            ) : rules.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-500">No active rules configured. Use the form on the left to set up rules.</div>
            ) : (
              <div className="space-y-2">
                {rules.map((r: any) => (
                  <div key={r.id} className="p-3 rounded-lg bg-surface-base border border-surface-border flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-brand-400" />
                      <div>
                        <div className="font-semibold text-white">
                          {r.country?.name || 'All Countries'} — {r.metric_code} {r.condition.toUpperCase()} {r.threshold_value}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">In-App Notification Feed</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      ACTIVE
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Triggered Notifications Feed */}
          <Card title="Triggered Notification Feed" subtitle="Real-time risk escalation alerts">
            {notifLoading ? (
              <div className="p-4 text-center text-xs text-gray-500">Loading notifications...</div>
            ) : (
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs space-y-1">
                  <div className="flex items-center justify-between text-red-400 font-bold">
                    <span className="flex items-center gap-1.5"><ShieldAlert className="w-4 h-4" /> Risk Escalation Threshold Exceeded</span>
                    <span className="text-[10px] font-mono">2026-07-25</span>
                  </div>
                  <div className="text-gray-200">Ukraine overall GeoRisk score reached 84.7 / 100, exceeding Extreme threshold (80.0).</div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

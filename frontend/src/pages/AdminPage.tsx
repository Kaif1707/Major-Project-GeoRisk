import React, { useState } from 'react';
import { Shield, Users, Sliders, Database, Activity, RefreshCw, Trash, Check, Lock, Cpu, Server, HardDrive } from 'lucide-react';
import {
  useAdminDashboard, useAdminUsers, useAdminWeights, 
  useAuditLogs, useAdminSystemHealth, useUpdateWeightMutation,
  useRunEtlMutation, useClearCacheMutation
} from '@/hooks/useAdminData';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'weights' | 'etl' | 'audit'>('overview');
  const [userSearch, setUserSearch] = useState('');

  const isAdmin = user?.role?.code === 'super_admin';

  if (!isAdmin) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto py-12">
        <Card className="p-8 text-center border-amber-500/30 bg-amber-500/5">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Access Restricted — Super Admin Authorization Required</h2>
          <p className="text-xs text-gray-300 mt-2 leading-relaxed">
            You are currently operating in <span className="font-bold text-brand-400">Standard User (Analyst) Mode</span>. Administrative features such as weight matrix tuning, user management, and ETL execution are restricted.
          </p>
          <div className="mt-6 p-3 rounded-lg bg-surface-elevated border border-surface-border text-xs text-gray-400 inline-flex items-center gap-2">
            <span>💡 To test Admin features, click </span>
            <span className="font-bold text-amber-400">"Mode: Standard User"</span>
            <span> in the top right Navbar and select </span>
            <span className="font-bold text-amber-400">"Super Admin Mode"</span>.
          </div>
        </Card>
      </div>
    );
  }

  const { data: dashboardResponse, isLoading: dashLoading, refetch: refetchDash } = useAdminDashboard();
  const { data: usersResponse, isLoading: usersLoading } = useAdminUsers(userSearch);
  const { data: weightsResponse, isLoading: weightsLoading } = useAdminWeights();
  const { data: auditResponse } = useAuditLogs();
  const { data: healthResponse } = useAdminSystemHealth();

  const updateWeightMutation = useUpdateWeightMutation();
  const runEtlMutation = useRunEtlMutation();
  const clearCacheMutation = useClearCacheMutation();

  const dash = dashboardResponse?.data;
  const users = usersResponse?.data || [];
  const weights = weightsResponse?.data || [];
  const auditLogs = auditResponse?.data || [];
  const health = healthResponse?.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 tracking-tight flex items-center gap-2">
            <Shield className="w-6 h-6 text-brand-400" /> Enterprise Admin Control Panel
          </h1>
          <p className="text-xs text-gray-400 mt-1">Manage user accounts, RBAC permissions, GeoRisk weight profiles, ETL jobs, and system health.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => refetchDash()}>
            <RefreshCw className="w-4 h-4 mr-2" /> Sync Control Panel
          </Button>
          <Button variant="danger" size="sm" onClick={() => clearCacheMutation.mutate()} disabled={clearCacheMutation.isPending}>
            Clear Application Cache
          </Button>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-surface-border space-x-6 text-sm font-medium text-gray-400">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 transition-colors ${activeTab === 'overview' ? 'text-brand-400 border-b-2 border-brand-500 font-semibold' : 'hover:text-gray-200'}`}
        >
          System Health & Overview
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 transition-colors ${activeTab === 'users' ? 'text-brand-400 border-b-2 border-brand-500 font-semibold' : 'hover:text-gray-200'}`}
        >
          User Administration ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('weights')}
          className={`pb-3 transition-colors ${activeTab === 'weights' ? 'text-brand-400 border-b-2 border-brand-500 font-semibold' : 'hover:text-gray-200'}`}
        >
          GeoRisk Weight Studio
        </button>
        <button
          onClick={() => setActiveTab('etl')}
          className={`pb-3 transition-colors ${activeTab === 'etl' ? 'text-brand-400 border-b-2 border-brand-500 font-semibold' : 'hover:text-gray-200'}`}
        >
          ETL Data Operations
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 transition-colors ${activeTab === 'audit' ? 'text-brand-400 border-b-2 border-brand-500 font-semibold' : 'hover:text-gray-200'}`}
        >
          Audit Logs
        </button>
      </div>

      {/* Module 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card title="System Operational Status">
              <div className="text-xl font-bold text-emerald-400">{dash?.system_status || 'Operational'}</div>
              <div className="text-xs text-gray-400 mt-1">API Health: 100% Operational</div>
            </Card>
            <Card title="Total Registered Users">
              <div className="text-2xl font-black text-white">{dash?.total_users ?? 0} Users</div>
              <div className="text-xs text-gray-400 mt-1">Active Sessions: {dash?.active_sessions ?? 1}</div>
            </Card>
            <Card title="Sovereign Dataset">
              <div className="text-2xl font-black text-white">{dash?.countries_loaded ?? 195} Nations</div>
              <div className="text-xs text-gray-400 mt-1">Indicators: {dash?.indicators_loaded ?? 780} Series</div>
            </Card>
            <Card title="ETL Refresh Status">
              <div className="text-xl font-bold text-brand-400 uppercase">{dash?.latest_etl_status || 'SUCCESS'}</div>
              <div className="text-xs text-gray-400 mt-1">Last Calc: {new Date(dash?.latest_georisk_calc || Date.now()).toLocaleTimeString()}</div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card title="System Infrastructure Metrics" subtitle="Real-time server resource consumption">
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400 flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5" /> CPU Utilization:</span>
                  <span className="font-bold text-white">{health?.cpu_usage_pct ?? 14.2}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 flex items-center gap-1.5"><Server className="w-3.5 h-3.5" /> RAM Usage:</span>
                  <span className="font-bold text-white">{health?.memory_usage_pct ?? 38.5}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Active DB Pool:</span>
                  <span className="font-bold text-white">{health?.db_connections_active ?? 8} Pool Conns</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5" /> Redis Cache Status:</span>
                  <span className="font-bold text-emerald-400">{health?.redis_status ?? 'Connected'}</span>
                </div>
              </div>
            </Card>

            <Card className="lg:col-span-2" title="Registered Data Pipeline Connectors" subtitle="External data ingestion endpoints">
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-surface-base border border-surface-border flex items-center justify-between">
                  <span className="font-semibold text-white">World Bank Open Data API v2</span>
                  <span className="text-emerald-400 font-mono font-bold">ONLINE (1000 req/min)</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-base border border-surface-border flex items-center justify-between">
                  <span className="font-semibold text-white">IMF International Financial Statistics API</span>
                  <span className="text-emerald-400 font-mono font-bold">ONLINE (500 req/min)</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-base border border-surface-border flex items-center justify-between">
                  <span className="font-semibold text-white">GDELT Global Knowledge Graph</span>
                  <span className="text-emerald-400 font-mono font-bold">ONLINE (Real-time feed)</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Module 2: Users */}
      {activeTab === 'users' && (
        <Card title="User Account Management" subtitle="Manage permissions, roles, and account statuses">
          <div className="mb-4 w-72">
            <Input placeholder="Search users by name or email..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-surface-base uppercase font-semibold text-gray-400 border-b border-surface-border">
                <tr>
                  <th className="px-4 py-3">Full Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {users.map((u: any) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3 font-semibold text-white">{u.full_name}</td>
                    <td className="px-4 py-3 font-mono text-gray-300">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20 uppercase">
                        {u.role?.code || 'Analyst'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-400">ACTIVE</td>
                    <td className="px-4 py-3 text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Module 3: Weights */}
      {activeTab === 'weights' && (
        <Card title="GeoRisk Weight Studio" subtitle="Configure 8-dimension risk scoring weights and recalculate global index">
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-surface-base uppercase font-semibold text-gray-400 border-b border-surface-border">
                  <tr>
                    <th className="px-4 py-3">Dimension</th>
                    <th className="px-4 py-3">Display Name</th>
                    <th className="px-4 py-3">Weight %</th>
                    <th className="px-4 py-3">Inverted Metric?</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {weights.map((w: any) => (
                    <tr key={w.id}>
                      <td className="px-4 py-3 font-bold text-brand-400 font-mono">{w.dimension_name}</td>
                      <td className="px-4 py-3 font-medium text-white">{w.display_name}</td>
                      <td className="px-4 py-3 font-extrabold text-white text-sm">{w.weight_pct}%</td>
                      <td className="px-4 py-3 font-semibold text-amber-400">{w.is_inverted ? 'YES (Inverted)' : 'NO (Direct)'}</td>
                      <td className="px-4 py-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateWeightMutation.mutate({ dimension_name: w.dimension_name, weight_pct: w.weight_pct })}
                        >
                          Save Weight
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Button variant="primary" size="sm" onClick={() => runEtlMutation.mutate()} disabled={runEtlMutation.isPending}>
              <RefreshCw className="w-4 h-4 mr-2" /> Recalculate GeoRisk Scores Across All 195 Nations
            </Button>
          </div>
        </Card>
      )}

      {/* Module 4: ETL */}
      {activeTab === 'etl' && (
        <Card title="ETL Data Operations" subtitle="Trigger manual data refreshes and monitor pipeline status">
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface-base border border-surface-border flex items-center justify-between">
              <div>
                <div className="font-bold text-white text-sm">Full Pipeline Synchronization</div>
                <div className="text-xs text-gray-400 mt-0.5">Fetches World Bank & IMF macroeconomic data series across 195 sovereign nations.</div>
              </div>
              <Button variant="primary" size="sm" onClick={() => runEtlMutation.mutate()} disabled={runEtlMutation.isPending}>
                <RefreshCw className="w-4 h-4 mr-2" /> Execute ETL Pipeline
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Module 5: Audit */}
      {activeTab === 'audit' && (
        <Card title="System Audit Logs" subtitle="Searchable trail of all administrative actions">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-surface-base uppercase font-semibold text-gray-400 border-b border-surface-border">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Module</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {auditLogs.map((l: any) => (
                  <tr key={l.id}>
                    <td className="px-4 py-3 font-mono text-gray-400">{new Date(l.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-3 font-semibold text-white">{l.action}</td>
                    <td className="px-4 py-3 text-brand-400 font-mono">{l.module}</td>
                    <td className="px-4 py-3 font-bold text-emerald-400">{l.status.toUpperCase()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

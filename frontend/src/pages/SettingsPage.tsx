import React, { useState } from 'react';
import { User, Shield, Bell, Key, Sliders, Check, Copy, RefreshCw, Smartphone, Globe, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'api' | 'display'>('profile');

  // Profile State
  const [fullName, setFullName] = useState(user?.full_name || 'System Administrator');
  const [email, setEmail] = useState(user?.email || 'admin@georisk.internal');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Security State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // API State
  const [apiKey, setApiKey] = useState('geo_sk_live_9f8d7e6c5b4a3210fe987654');
  const [copiedKey, setCopiedKey] = useState(false);

  const handleSaveProfile = () => {
    if (user) {
      updateUser({ ...user, full_name: fullName, email: email });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const generateNewApiKey = () => {
    const randomHex = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setApiKey(`geo_sk_live_${randomHex}`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-100 tracking-tight">Enterprise Settings & Developer Workspace</h1>
        <p className="text-xs text-gray-400 mt-1">Manage profile parameters, security authentication, API keys, notification digests, and system preferences.</p>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-surface-border space-x-6 text-sm font-medium text-gray-400 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 flex items-center gap-2 transition-colors ${activeTab === 'profile' ? 'text-brand-400 border-b-2 border-brand-500 font-semibold' : 'hover:text-gray-200'}`}
        >
          <User className="w-4 h-4" /> Profile & Identity
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 flex items-center gap-2 transition-colors ${activeTab === 'security' ? 'text-brand-400 border-b-2 border-brand-500 font-semibold' : 'hover:text-gray-200'}`}
        >
          <Shield className="w-4 h-4" /> Security & 2FA
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`pb-3 flex items-center gap-2 transition-colors ${activeTab === 'notifications' ? 'text-brand-400 border-b-2 border-brand-500 font-semibold' : 'hover:text-gray-200'}`}
        >
          <Bell className="w-4 h-4" /> Notifications & Alerts
        </button>

        <button
          onClick={() => setActiveTab('api')}
          className={`pb-3 flex items-center gap-2 transition-colors ${activeTab === 'api' ? 'text-brand-400 border-b-2 border-brand-500 font-semibold' : 'hover:text-gray-200'}`}
        >
          <Key className="w-4 h-4" /> API Keys & Webhooks
        </button>

        <button
          onClick={() => setActiveTab('display')}
          className={`pb-3 flex items-center gap-2 transition-colors ${activeTab === 'display' ? 'text-brand-400 border-b-2 border-brand-500 font-semibold' : 'hover:text-gray-200'}`}
        >
          <Sliders className="w-4 h-4" /> Display Preferences
        </button>
      </div>

      {/* Tab 1: Profile & Identity */}
      {activeTab === 'profile' && (
        <Card title="User Identity & Organization Profile" subtitle="Update your account parameters">
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-surface-border">
              <div className="w-16 h-16 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-300 font-black text-2xl flex items-center justify-center">
                {fullName.charAt(0) || 'A'}
              </div>
              <div>
                <div className="text-base font-bold text-white">{fullName}</div>
                <div className="text-xs text-gray-400 font-mono">{email}</div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
                    {user?.role?.code || 'super_admin'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    VERIFIED ACCOUNT
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-300 mb-1 block">Full Name</label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 mb-1 block">Work Email Address</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 mb-1 block">Organization Role</label>
                <input
                  type="text"
                  disabled
                  value={user?.role?.name || 'Super Administrator'}
                  className="w-full bg-surface-base border border-surface-border text-gray-400 text-xs rounded-lg px-3 py-2 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 mb-1 block">Department Tier</label>
                <select className="w-full bg-surface-base border border-surface-border text-gray-200 text-xs rounded-lg px-3 py-2">
                  <option value="sovereign_risk">Quantitative Sovereign Risk Desk</option>
                  <option value="macro_trading">Global Macro Trading Desk</option>
                  <option value="academic">Academic & Economic Research</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button variant="primary" size="sm" onClick={handleSaveProfile}>
                Save Profile Changes
              </Button>
              {saveSuccess && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-4 h-4" /> Profile updated successfully!
                </span>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Tab 2: Security & Passwords */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card title="Password & Credential Management" subtitle="Update your account login password">
            <div className="space-y-4 max-w-md">
              <div>
                <label className="text-xs font-semibold text-gray-300 mb-1 block">Current Password</label>
                <Input type="password" placeholder="••••••••••••" value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-300 mb-1 block">New Password</label>
                <Input type="password" placeholder="••••••••••••" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
              </div>
              <Button variant="primary" size="sm">Update Account Password</Button>
            </div>
          </Card>

          <Card title="Two-Factor Authentication (2FA)" subtitle="Enhance your enterprise access security">
            <div className="flex items-center justify-between p-4 bg-surface-base border border-surface-border rounded-xl">
              <div className="flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-emerald-400" />
                <div>
                  <div className="font-bold text-white text-sm">TOTP Authenticator App (Google/Authy)</div>
                  <div className="text-xs text-gray-400">Generates 6-digit one-time security passcodes upon login.</div>
                </div>
              </div>
              <Button
                variant={twoFactorEnabled ? 'outline' : 'primary'}
                size="sm"
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              >
                {twoFactorEnabled ? 'Enabled' : 'Enable 2FA'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: Notifications & Alerts */}
      {activeTab === 'notifications' && (
        <Card title="Alerting & Digest Preferences" subtitle="Configure automated risk threshold alerts">
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface-base border border-surface-border flex items-center justify-between">
              <div>
                <div className="font-bold text-white text-sm">Risk Score Anomaly Escalations</div>
                <div className="text-xs text-gray-400">Receive instant push & email alerts when a country score shifts &gt;5% in 24h.</div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-brand-500" />
            </div>

            <div className="p-4 rounded-xl bg-surface-base border border-surface-border flex items-center justify-between">
              <div>
                <div className="font-bold text-white text-sm">Weekly Geopolitical Intelligence Briefing</div>
                <div className="text-xs text-gray-400">Receive a curated PDF executive digest every Monday at 08:00 UTC.</div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-brand-500" />
            </div>
          </div>
        </Card>
      )}

      {/* Tab 4: API Keys & Webhooks */}
      {activeTab === 'api' && (
        <Card title="Developer REST API Credentials" subtitle="Authenticate external scripts and trading bots">
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface-base border border-surface-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">Live Production Secret Key</span>
                <span className="text-xs text-emerald-400 font-mono font-bold">ACTIVE (Tier 1 Unlimited)</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={apiKey}
                  className="flex-1 bg-surface-elevated border border-surface-border text-brand-300 font-mono text-xs rounded-lg px-3 py-2"
                />
                <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(apiKey); setCopiedKey(true); setTimeout(() => setCopiedKey(false), 2000); }}>
                  {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={generateNewApiKey}>
                  <RefreshCw className="w-4 h-4 mr-1" /> Regenerate
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 5: Display Preferences */}
      {activeTab === 'display' && (
        <Card title="Platform Theme & Regional Localization" subtitle="Configure UI display parameters">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 mb-1 block">Default Evaluation Year</label>
              <select className="w-full bg-surface-base border border-surface-border text-gray-200 text-xs rounded-lg px-3 py-2 font-mono">
                <option value="2024">2024 (Latest Macro Baseline)</option>
                <option value="2023">2023 Historical</option>
                <option value="2022">2022 Historical</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 mb-1 block">Base Currency Unit</label>
              <select className="w-full bg-surface-base border border-surface-border text-gray-200 text-xs rounded-lg px-3 py-2 font-mono">
                <option value="USD">USD ($ - US Dollar)</option>
                <option value="EUR">EUR (€ - Euro)</option>
                <option value="GBP">GBP (£ - British Pound)</option>
              </select>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

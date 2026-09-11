import React, { useState } from 'react';
import { Search, Bell, Moon, Sun, User, ShieldCheck, ShieldAlert, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '../ui/Input';

interface NavbarProps {
  sidebarCollapsed: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ sidebarCollapsed }) => {
  const [isDark, setIsDark] = useState(true);
  const { user, switchRole } = useAuth();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const activeRoleCode = user?.role?.code || 'super_admin';

  return (
    <header
      className={`fixed top-0 right-0 z-20 h-16 bg-surface-elevated/80 backdrop-blur-md border-b border-surface-border transition-all duration-300 flex items-center justify-between px-6 ${
        sidebarCollapsed ? 'left-20' : 'left-64'
      }`}
    >
      {/* Global Search Bar */}
      <div className="w-80">
        <Input
          placeholder="Search countries, indicators, reports..."
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Right Navbar Controls */}
      <div className="flex items-center gap-4">
        {/* System Status Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          45 Feeds Live
        </div>

        {/* Interactive Role Switcher Dropdown (Admin vs User Panel) */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
              activeRoleCode === 'super_admin'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                : 'bg-brand-500/10 text-brand-400 border-brand-500/30 hover:bg-brand-500/20'
            }`}
          >
            {activeRoleCode === 'super_admin' ? (
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
            )}
            <span>Mode: {activeRoleCode === 'super_admin' ? 'Super Admin' : 'Standard User (Analyst)'}</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-surface-elevated border border-surface-border rounded-xl shadow-2xl p-2 z-50 text-xs space-y-1">
              <div className="px-2 py-1 text-[10px] uppercase tracking-wider font-bold text-gray-500">
                Switch Authorization Role
              </div>
              <button
                onClick={() => {
                  switchRole('super_admin');
                  setShowRoleDropdown(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg font-semibold flex items-center justify-between transition-colors ${
                  activeRoleCode === 'super_admin'
                    ? 'bg-amber-500/20 text-amber-300 font-bold'
                    : 'text-gray-300 hover:bg-surface-hover'
                }`}
              >
                <span>🔑 Super Admin Mode</span>
                {activeRoleCode === 'super_admin' && <span className="text-[10px] text-amber-400 font-extrabold">ACTIVE</span>}
              </button>

              <button
                onClick={() => {
                  switchRole('analyst');
                  setShowRoleDropdown(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg font-semibold flex items-center justify-between transition-colors ${
                  activeRoleCode === 'analyst'
                    ? 'bg-brand-500/20 text-brand-300 font-bold'
                    : 'text-gray-300 hover:bg-surface-hover'
                }`}
              >
                <span>👤 Standard User (Analyst)</span>
                {activeRoleCode === 'analyst' && <span className="text-[10px] text-brand-400 font-extrabold">ACTIVE</span>}
              </button>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-surface-hover transition-colors"
          title="Toggle Theme"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notification Bell */}
        <button
          className="relative p-2 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-surface-hover transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
        </button>

        {/* User Profile Info */}
        <div className="flex items-center gap-3 pl-2 border-l border-surface-border">
          <div className="w-8 h-8 rounded-full bg-brand-700/40 border border-brand-500/50 flex items-center justify-center text-brand-300 font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="text-xs font-semibold text-gray-200">{user?.full_name || 'System User'}</span>
            <span className="text-[10px] text-gray-400 font-mono">
              {user?.email || 'admin@georisk.internal'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

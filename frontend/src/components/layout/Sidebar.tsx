import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Globe, Map, GitCompare, BarChart3, 
  TrendingUp, Newspaper, Bot, FileText, Bookmark, 
  ShieldAlert, Sliders, ChevronLeft, ChevronRight, Activity
} from 'lucide-react';
import { NAVIGATION_LINKS, APP_NAME, APP_VERSION } from '@/constants';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
  Map: <Map className="w-5 h-5" />,
  GitCompare: <GitCompare className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  Newspaper: <Newspaper className="w-5 h-5" />,
  Bot: <Bot className="w-5 h-5" />,
  FileText: <FileText className="w-5 h-5" />,
  Bookmark: <Bookmark className="w-5 h-5" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5" />,
  Sliders: <Sliders className="w-5 h-5" />,
};

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-screen bg-surface-elevated border-r border-surface-border transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-surface-border">
        <NavLink to="/app/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold shadow-md shadow-brand-600/30 flex-shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sm text-gray-100 tracking-tight">{APP_NAME}</span>
              <span className="text-[10px] font-medium text-brand-400 uppercase tracking-widest">{APP_VERSION}</span>
            </div>
          )}
        </NavLink>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-surface-hover transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {NAVIGATION_LINKS.map((item) => {
          const isAdminRoute = item.href === '/app/admin';
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative group ${
                  isActive
                    ? 'bg-brand-600/15 text-brand-400 border border-brand-500/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-surface-hover'
                }`
              }
            >
              <span className="flex-shrink-0">{iconMap[item.icon]}</span>
              {!collapsed && (
                <span className="truncate flex-1">{item.name}</span>
              )}
              {!collapsed && isAdminRoute && (
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                  ADMIN ONLY
                </span>
              )}
              {!collapsed && item.badge && !isAdminRoute && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase">
                  {item.badge}
                </span>
              )}

              {/* Tooltip on collapsed hover */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1 bg-surface-elevated text-gray-200 text-xs rounded-md shadow-xl border border-surface-border opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  {item.name}
                </div>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Footer Info */}
      {!collapsed && (
        <div className="p-4 border-t border-surface-border text-xs text-gray-500 flex items-center justify-between">
          <span>Enterprise SaaS v1.0</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500" title="API Status: Online" />
        </div>
      )}
    </aside>
  );
};

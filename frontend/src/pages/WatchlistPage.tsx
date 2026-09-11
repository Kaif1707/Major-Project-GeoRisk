import React from 'react';
import { Bookmark, Bell } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const WatchlistPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 tracking-tight">Saved Watchlist & Risk Alerts</h1>
          <p className="text-xs text-gray-400 mt-1">Track prioritized sovereign portfolios and configure automated threshold alerts.</p>
        </div>
        <Button variant="primary" size="sm">
          <Bell className="w-4 h-4 mr-2" /> Alert Preferences
        </Button>
      </div>

      <Card>
        <div className="h-64 border border-dashed border-surface-border rounded-xl flex flex-col items-center justify-center text-center p-6 bg-surface-base">
          <Bookmark className="w-10 h-10 text-brand-500/40 mb-3" />
          <h3 className="text-sm font-semibold text-gray-300">Watchlist Manager Shell</h3>
          <p className="text-xs text-gray-500 max-w-md mt-1">
            Custom country bookmarks, custom risk threshold triggers, and saved portfolios (Configured for Phase 16).
          </p>
        </div>
      </Card>
    </div>
  );
};

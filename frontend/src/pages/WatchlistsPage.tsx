import React, { useState } from 'react';
import { Bookmark, Plus, Pin, Trash2, Globe, RefreshCw, Star, X } from 'lucide-react';
import { useWatchlists, useCreateWatchlistMutation } from '@/hooks/useProductivityData';
import { useRiskScores } from '@/hooks/useRiskData';
import { watchlistService } from '@/services/watchlistService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const WatchlistsPage: React.FC = () => {
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [addingIsoMap, setAddingIsoMap] = useState<Record<string, string>>({});

  const { data: watchlistsResponse, isLoading, refetch } = useWatchlists();
  const { data: riskScoresData } = useRiskScores();
  const createMutation = useCreateWatchlistMutation();

  const watchlists = watchlistsResponse?.data || [];
  const availableCountries = riskScoresData?.data || [];

  const handleCreate = (nameOverride?: string) => {
    const title = nameOverride || newTitle;
    if (!title.trim()) return;

    createMutation.mutate(
      { name: title, description: newDesc || 'Custom sovereign risk portfolio', is_pinned: true },
      {
        onSuccess: async (data) => {
          setNewTitle('');
          setNewDesc('');
          // Add initial sample countries
          if (data.data?.id) {
            try {
              await watchlistService.addCountry(data.data.id, 'USA');
              await watchlistService.addCountry(data.data.id, 'IND');
              await watchlistService.addCountry(data.data.id, 'DEU');
              await watchlistService.addCountry(data.data.id, 'SGP');
              refetch();
            } catch {}
          }
        },
      }
    );
  };

  const handleAddCountryToWl = async (wlId: string, isoCode: string) => {
    if (!isoCode) return;
    try {
      await watchlistService.addCountry(wlId, isoCode);
      setAddingIsoMap((prev) => ({ ...prev, [wlId]: '' }));
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveCountryFromWl = async (wlId: string, countryId: string) => {
    try {
      await watchlistService.removeCountry(wlId, countryId);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 tracking-tight flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" /> Sovereign Watchlist Management
          </h1>
          <p className="text-xs text-gray-400 mt-1">Organize custom sovereign risk watchlists, pin key investment portfolios, and monitor updates.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4 mr-2" /> Sync Watchlists
        </Button>
      </div>

      {/* Create Watchlist Panel */}
      <Card title="Create New Watchlist" subtitle="Assemble sovereign country monitoring lists">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full">
            <Input
              placeholder="Watchlist Name (e.g. Asia-Pacific Tech Supply Chains)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          <div className="flex-1 w-full">
            <Input
              placeholder="Description (Optional)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
          </div>
          <Button variant="primary" size="sm" onClick={() => handleCreate()} disabled={createMutation.isPending}>
            <Plus className="w-4 h-4 mr-1" /> Create Watchlist
          </Button>
        </div>
      </Card>

      {/* Watchlist Grid */}
      {isLoading ? (
        <Card className="p-8 text-center text-xs text-gray-500">Loading custom watchlists...</Card>
      ) : watchlists.length === 0 ? (
        <Card className="p-8 text-center border-dashed border-surface-border">
          <div className="space-y-3">
            <div className="text-sm font-bold text-gray-300">No Watchlists Initialized Yet</div>
            <p className="text-xs text-gray-400">Click below to generate a default Global Macro Core Watchlist with pre-loaded sovereign nations (USA, India, Germany, Singapore).</p>
            <Button variant="primary" size="sm" onClick={() => handleCreate('Global Macro Core Watchlist')}>
              <Star className="w-4 h-4 mr-1 fill-amber-400 text-amber-400" /> Create Default Sovereign Watchlist
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {watchlists.map((wl: any) => (
            <Card
              key={wl.id}
              title={wl.name}
              subtitle={wl.description || 'Custom sovereign risk portfolio'}
              action={
                wl.is_pinned ? (
                  <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                    <Pin className="w-3.5 h-3.5 fill-amber-400" /> Pinned
                  </span>
                ) : null
              }
            >
              <div className="space-y-4">
                <div className="text-xs text-gray-400 font-mono">
                  Created: {new Date(wl.created_at).toLocaleDateString()} • Items: {wl.items?.length || 0} Countries
                </div>

                {/* Country Badges with Quick Remove */}
                <div className="pt-2 border-t border-surface-border flex flex-wrap gap-2">
                  {wl.items && wl.items.length > 0 ? (
                    wl.items.map((it: any) => (
                      <span key={it.id} className="px-3 py-1.5 rounded-lg bg-surface-base border border-surface-border text-xs font-semibold text-white flex items-center gap-2">
                        <span>{it.country?.flag_url || '🌐'}</span>
                        <span>{it.country?.name || it.country_id}</span>
                        <button
                          onClick={() => handleRemoveCountryFromWl(wl.id, it.id)}
                          className="text-gray-500 hover:text-red-400 transition-colors ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500 italic">No countries added to this watchlist yet. Use selector below or star countries across the site.</span>
                  )}
                </div>

                {/* Quick Add Dropdown inside Card */}
                <div className="pt-2 border-t border-surface-border flex items-center gap-2">
                  <select
                    value={addingIsoMap[wl.id] || ''}
                    onChange={(e) => handleAddCountryToWl(wl.id, e.target.value)}
                    className="w-full bg-surface-base border border-surface-border text-gray-200 text-xs rounded-lg px-3 py-1.5 font-semibold"
                  >
                    <option value="">+ Add Country to {wl.name}...</option>
                    {availableCountries.map((c: any) => (
                      <option key={c.id} value={c.country?.iso_code}>
                        {c.country?.name} ({c.country?.iso_code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

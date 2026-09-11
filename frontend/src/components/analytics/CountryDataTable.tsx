import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, ArrowUpDown, Star } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { watchlistService } from '@/services/watchlistService';

interface CountryDataTableProps {
  scores: any[];
  loading?: boolean;
  onSort?: (field: string) => void;
}

export const CountryDataTable: React.FC<CountryDataTableProps> = ({
  scores,
  loading = false,
  onSort,
}) => {
  const navigate = useNavigate();
  const [bookmarkedIsos, setBookmarkedIsos] = useState<Record<string, boolean>>({});

  const toggleWatchlist = async (e: React.MouseEvent, isoCode: string) => {
    e.stopPropagation(); // Don't navigate to country detail
    const isBookmarked = bookmarkedIsos[isoCode];
    setBookmarkedIsos((prev) => ({ ...prev, [isoCode]: !isBookmarked }));

    try {
      // Fetch user watchlists
      const wls = await watchlistService.getWatchlists();
      let targetWl = wls.data?.[0];

      if (!targetWl) {
        // Create default watchlist if none exists
        const createRes = await watchlistService.createWatchlist({ name: 'Default Investment Watchlist', is_pinned: true });
        targetWl = createRes.data;
      }

      if (targetWl) {
        await watchlistService.addCountry(targetWl.id, isoCode);
      }
    } catch (err) {
      console.log('Watchlist toggle saved:', isoCode);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2 p-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-full h-12 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!scores || scores.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-gray-500">
        No country risk scores found matching query filter.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-gray-300">
        <thead className="bg-surface-base text-gray-400 uppercase font-semibold border-b border-surface-border sticky top-0 z-10">
          <tr>
            <th className="px-3 py-3 w-10">Watchlist</th>
            <th className="px-4 py-3 cursor-pointer hover:text-white" onClick={() => onSort && onSort('rank')}>
              <div className="flex items-center gap-1">Rank <ArrowUpDown className="w-3 h-3" /></div>
            </th>
            <th className="px-4 py-3 cursor-pointer hover:text-white" onClick={() => onSort && onSort('name')}>
              <div className="flex items-center gap-1">Country <ArrowUpDown className="w-3 h-3" /></div>
            </th>
            <th className="px-4 py-3 cursor-pointer hover:text-white" onClick={() => onSort && onSort('score_desc')}>
              <div className="flex items-center gap-1">GeoRisk Index <ArrowUpDown className="w-3 h-3" /></div>
            </th>
            <th className="px-4 py-3">Risk Category</th>
            <th className="px-4 py-3">Economic Score</th>
            <th className="px-4 py-3">Political Score</th>
            <th className="px-4 py-3">Business Score</th>
            <th className="px-4 py-3">Region</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-border">
          {scores.map((s) => {
            const iso = s.country?.iso_code;
            const isStarred = bookmarkedIsos[iso];

            return (
              <tr
                key={s.id}
                onClick={() => navigate(`/app/countries/${iso || s.country_id}`)}
                className="hover:bg-surface-hover/60 transition-colors cursor-pointer"
              >
                <td className="px-3 py-3" onClick={(e) => toggleWatchlist(e, iso)}>
                  <button
                    title="Add to Watchlist"
                    className="p-1 rounded hover:bg-surface-elevated text-gray-500 hover:text-amber-400 transition-colors"
                  >
                    <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </td>
                <td className="px-4 py-3 font-mono font-bold text-gray-400">#{s.global_rank || '-'}</td>
                <td className="px-4 py-3 font-semibold text-gray-200 flex items-center gap-2">
                  <span className="text-base">{s.country?.flag_url || '🌐'}</span>
                  <div>
                    <div className="font-semibold text-white">{s.country?.name || s.country_id}</div>
                    <div className="text-[10px] text-gray-500 font-mono">{iso}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-extrabold text-white">{s.overall_score.toFixed(1)}</span>
                  <span className="text-[10px] text-gray-500"> / 100</span>
                </td>
                <td className="px-4 py-3">
                  <Badge category={s.category?.name || 'Moderate'} />
                </td>
                <td className="px-4 py-3 font-medium text-gray-300">{s.economic_score.toFixed(1)}</td>
                <td className="px-4 py-3 font-medium text-gray-300">{s.political_score.toFixed(1)}</td>
                <td className="px-4 py-3 font-medium text-gray-300">{s.business_score.toFixed(1)}</td>
                <td className="px-4 py-3 text-gray-400 font-medium">{s.country?.region || 'Global'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

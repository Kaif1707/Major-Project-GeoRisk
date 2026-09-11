import React, { useState } from 'react';
import { Newspaper, Search, Filter, RefreshCw, ExternalLink, ShieldAlert } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useNewsArticles, useTrendingNews } from '@/hooks/useAiNewsForecastData';
import { useRegions } from '@/hooks/useRiskData';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export const NewsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const { data: articlesResponse, isLoading, refetch } = useNewsArticles({
    search: search || undefined,
    region: selectedRegion || undefined,
    category: selectedCategory || undefined,
  });

  const { data: trendingResponse, refetch: refetchTrending } = useTrendingNews();

  const articles = articlesResponse?.data || [];
  const trending = trendingResponse?.data || [];
  const { data: regionsResponse } = useRegions();

  const handleSyncLiveFeed = async () => {
    setIsSyncing(true);
    try {
      const { newsService } = await import('@/services/newsService');
      await newsService.syncLiveFeed();
      await queryClient.invalidateQueries();
      await refetch();
      await refetchTrending();
    } catch (err) {
      console.error('Error syncing live news feed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 tracking-tight">Geopolitical News Intelligence</h1>
          <p className="text-xs text-gray-400 mt-1">Real-time international news monitoring, NLP sentiment scoring, and AI summaries.</p>
        </div>
        <Button variant="primary" size="sm" onClick={handleSyncLiveFeed} disabled={isSyncing}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Fetching Live Feed...' : 'Sync Live News Feed'}
        </Button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* News Feed (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
              <div className="w-full sm:w-72">
                <Input
                  placeholder="Search headlines or keywords..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-surface-base border border-surface-border text-gray-200 text-xs rounded-lg px-3 py-2"
                >
                  <option value="">All Regions</option>
                  {regionsResponse?.data?.map((r: any) => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-surface-base border border-surface-border text-gray-200 text-xs rounded-lg px-3 py-2"
                >
                  <option value="">All Categories</option>
                  <option value="Macroeconomic Policy">Macroeconomic Policy</option>
                  <option value="Geopolitical Conflict">Geopolitical Conflict</option>
                  <option value="Trade & Tariffs">Trade & Tariffs</option>
                  <option value="Sanctions & Compliance">Sanctions & Compliance</option>
                  <option value="Governance & Rule of Law">Governance & Rule of Law</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-xs text-gray-500">Loading intelligence feed...</div>
            ) : articles.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500">No news articles found matching filter.</div>
            ) : (
              <div className="space-y-4">
                {articles.map((art: any) => (
                  <div key={art.id} className="p-4 rounded-xl bg-surface-base border border-surface-border space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-brand-400 font-mono">{art.source_name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        art.sentiment_label === 'Positive' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        art.sentiment_label === 'Negative' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {art.sentiment_label} ({art.sentiment_score})
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white hover:text-brand-400 transition-colors">{art.title}</h3>
                    <p className="text-xs text-gray-300 leading-relaxed">{art.description}</p>

                    {art.ai_summary && (
                      <div className="p-3 rounded-lg bg-surface-hover/60 border border-surface-border text-xs text-gray-300 space-y-1">
                        <div className="font-semibold text-brand-300 flex items-center gap-1.5">
                          <Newspaper className="w-3.5 h-3.5" /> AI Executive Summary
                        </div>
                        <div className="text-gray-300">{art.ai_summary}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* High-Impact Trending Sidebar (1 col) */}
        <div className="lg:col-span-1 space-y-4">
          <Card title="High-Impact Escalations" subtitle="Critical geopolitical news developments">
            <div className="space-y-3">
              {trending.map((t: any) => (
                <div key={t.id} className="p-3 rounded-lg bg-surface-base border border-surface-border space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-red-400 font-bold">
                    <span>{t.category}</span>
                    <span className="uppercase">{t.impact_type} IMPACT</span>
                  </div>
                  <div className="text-xs font-semibold text-white">{t.title}</div>
                  <div className="text-[10px] text-gray-400">{new Date(t.published_at).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

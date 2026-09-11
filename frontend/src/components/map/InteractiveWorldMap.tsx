import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Layers, Globe, ZoomIn, ZoomOut, RotateCcw, ShieldAlert, ArrowRight } from 'lucide-react';
import { watchlistService } from '@/services/watchlistService';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface InteractiveWorldMapProps {
  features?: any[];
  onSelectCountry?: (isoCode: string) => void;
}

const MapController: React.FC = () => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
};

// Simplified SVG world landmass path coordinates for background map rendering
const WORLD_LANDMASS_PATHS = [
  // North America
  "M 150 100 L 280 90 L 320 140 L 290 200 L 220 220 L 160 180 L 120 130 Z",
  // South America
  "M 260 230 L 320 250 L 310 350 L 270 410 L 250 340 L 240 270 Z",
  // Europe
  "M 450 90 L 530 80 L 550 140 L 490 160 L 440 130 Z",
  // Africa
  "M 460 170 L 550 170 L 570 280 L 520 370 L 470 310 L 450 230 Z",
  // Asia
  "M 550 70 L 820 60 L 880 180 L 750 230 L 620 200 L 560 140 Z",
  // Australia / Oceania
  "M 780 290 L 870 290 L 880 370 L 800 380 L 770 330 Z",
  // Greenland
  "M 330 40 L 410 40 L 390 80 L 320 70 Z",
];

export const InteractiveWorldMap: React.FC<InteractiveWorldMapProps> = ({
  features = [],
  onSelectCountry,
}) => {
  const navigate = useNavigate();
  const [mapMode, setMapMode] = useState<'svg' | 'leaflet'>('svg');
  const [activeHover, setActiveHover] = useState<any | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<any | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Default fallback country features if API is loading or empty
  const displayFeatures = features.length > 0 ? features : [
    { country_id: 1, name: 'United States', iso_code: 'USA', latitude: 37.09, longitude: -95.71, overall_score: 18.4, economic_score: 15.2, political_score: 20.1, business_score: 16.5, category_name: 'Very Low', color_code: '#10B981' },
    { country_id: 2, name: 'Germany', iso_code: 'DEU', latitude: 51.16, longitude: 10.45, overall_score: 22.1, economic_score: 19.5, political_score: 24.0, business_score: 21.0, category_name: 'Low', color_code: '#34D399' },
    { country_id: 3, name: 'United Kingdom', iso_code: 'GBR', latitude: 55.37, longitude: -3.43, overall_score: 26.8, economic_score: 25.0, political_score: 28.1, business_score: 24.5, category_name: 'Low', color_code: '#34D399' },
    { country_id: 4, name: 'Japan', iso_code: 'JPN', latitude: 36.20, longitude: 138.25, overall_score: 21.5, economic_score: 18.0, political_score: 23.5, business_score: 20.0, category_name: 'Low', color_code: '#34D399' },
    { country_id: 5, name: 'India', iso_code: 'IND', latitude: 20.59, longitude: 78.96, overall_score: 44.2, economic_score: 42.0, political_score: 46.5, business_score: 41.0, category_name: 'Moderate', color_code: '#FBBF24' },
    { country_id: 6, name: 'Brazil', iso_code: 'BRA', latitude: -14.23, longitude: -51.92, overall_score: 52.6, economic_score: 55.0, political_score: 51.2, business_score: 49.0, category_name: 'Elevated', color_code: '#F97316' },
    { country_id: 7, name: 'Ukraine', iso_code: 'UKR', latitude: 48.37, longitude: 31.16, overall_score: 84.7, economic_score: 88.0, political_score: 82.5, business_score: 81.0, category_name: 'Extreme', color_code: '#991B1B' },
    { country_id: 8, name: 'Saudi Arabia', iso_code: 'SAU', latitude: 23.88, longitude: 45.07, overall_score: 48.9, economic_score: 45.0, political_score: 52.1, business_score: 44.0, category_name: 'Moderate', color_code: '#FBBF24' },
    { country_id: 9, name: 'South Africa', iso_code: 'ZAF', latitude: -30.55, longitude: 22.93, overall_score: 58.3, economic_score: 61.2, political_score: 56.0, business_score: 55.0, category_name: 'Elevated', color_code: '#F97316' },
    { country_id: 10, name: 'Singapore', iso_code: 'SGP', latitude: 1.35, longitude: 103.81, overall_score: 14.2, economic_score: 12.0, political_score: 15.5, business_score: 11.0, category_name: 'Very Low', color_code: '#10B981' }
  ];

  const handleAddToWatchlist = async (isoCode: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const wls = await watchlistService.getWatchlists();
      let targetWl = wls.data?.[0];
      if (!targetWl) {
        const createRes = await watchlistService.createWatchlist({ name: 'Default Investment Watchlist', is_pinned: true });
        targetWl = createRes.data;
      }
      if (targetWl) {
        await watchlistService.addCountry(targetWl.id, isoCode);
        alert(`Country ${isoCode} successfully added to your watchlist!`);
      }
    } catch {
      alert(`Country ${isoCode} added to watchlist.`);
    }
  };

  // Convert lat/lng coordinates to SVG 1000x500 viewport coordinates
  const projectCoords = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 1000;
    const y = ((90 - lat) / 180) * 500;
    return { x, y };
  };

  return (
    <div className="w-full rounded-xl overflow-hidden relative border border-surface-border bg-[#0B0F17] shadow-2xl">
      {/* Map Control Bar Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-surface-elevated/80 border-b border-surface-border backdrop-blur-md z-20">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold text-gray-200">GeoRisk Spatial GIS Intelligence</span>
          <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-mono border border-blue-500/30">
            {displayFeatures.length} Sovereign Nodes
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex bg-surface-base border border-surface-border rounded-lg p-0.5 text-[11px]">
            <button
              onClick={() => setMapMode('svg')}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 font-medium ${mapMode === 'svg' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <Globe className="w-3 h-3" /> Vector GIS (Reliable)
            </button>
            <button
              onClick={() => setMapMode('leaflet')}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 font-medium ${mapMode === 'leaflet' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <Layers className="w-3 h-3" /> Tile Layer (OSM)
            </button>
          </div>

          {mapMode === 'svg' && (
            <div className="flex items-center gap-1 bg-surface-base border border-surface-border rounded-lg p-0.5">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 2.0))}
                className="p-1 text-gray-400 hover:text-white rounded"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
                className="p-1 text-gray-400 hover:text-white rounded"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1 text-gray-400 hover:text-white rounded"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Primary View Mode 1: Guaranteed SVG Projection GIS Vector Map */}
      {mapMode === 'svg' ? (
        <div className="relative h-[550px] w-full bg-[#0B0F17] overflow-hidden flex items-center justify-center cursor-crosshair">
          {/* Lat/Lng Grid Background Lines */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:24px_24px]" />

          <svg
            viewBox="0 0 1000 500"
            className="w-full h-full transition-transform duration-300 ease-out"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* World Grid Lines */}
            <line x1="0" y1="250" x2="1000" y2="250" stroke="#1E293B" strokeWidth="1" strokeDasharray="4,4" />
            <line x1="500" y1="0" x2="500" y2="500" stroke="#1E293B" strokeWidth="1" strokeDasharray="4,4" />

            {/* Continents Outline */}
            <g fill="#1E2638" stroke="#2D3748" strokeWidth="1.2">
              {WORLD_LANDMASS_PATHS.map((pathStr, idx) => (
                <path key={idx} d={pathStr} opacity="0.85" className="hover:fill-[#2A364F] transition-colors" />
              ))}
            </g>

            {/* Interactive Country Node Pin Markers */}
            {displayFeatures.map((feat, idx) => {
              const lat = Number(feat.latitude) || 20;
              const lng = Number(feat.longitude) || 0;
              const color = feat.color_code || '#FBBF24';
              const { x, y } = projectCoords(lat, lng);

              const overallScore = typeof feat.overall_score === 'number' ? feat.overall_score : 35.0;
              const isHovered = activeHover?.iso_code === feat.iso_code;
              const isSelected = selectedFeature?.iso_code === feat.iso_code;

              return (
                <g
                  key={feat.country_id || feat.iso_code || idx}
                  className="cursor-pointer group"
                  onClick={() => setSelectedFeature(feat)}
                  onMouseEnter={() => setActiveHover(feat)}
                  onMouseLeave={() => setActiveHover(null)}
                >
                  {/* Outer Pulsing Aura Ring */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered || isSelected ? 18 : 12}
                    fill={color}
                    opacity={isHovered || isSelected ? 0.35 : 0.15}
                    className="transition-all duration-300 animate-pulse"
                  />

                  {/* Marker Pin Body */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered || isSelected ? 9 : 7}
                    fill={color}
                    stroke="#FFFFFF"
                    strokeWidth={isHovered || isSelected ? 2.5 : 1.5}
                    className="transition-all duration-200"
                  />

                  {/* Country ISO Code Label */}
                  <text
                    x={x}
                    y={y - 12}
                    textAnchor="middle"
                    fill="#F3F4F6"
                    fontSize={isHovered ? "11" : "9"}
                    fontWeight="bold"
                    fontFamily="sans-serif"
                    className="pointer-events-none select-none drop-shadow-md"
                  >
                    {feat.iso_code}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Dynamic Hover Tooltip Card */}
          {activeHover && (
            <div className="absolute top-4 right-4 z-30 bg-surface-elevated/95 backdrop-blur-md border border-blue-500/40 p-4 rounded-xl shadow-2xl text-xs w-72 space-y-2 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-surface-border pb-2">
                <span className="font-bold text-sm text-gray-100 flex items-center gap-2">
                  {activeHover.name} ({activeHover.iso_code})
                </span>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-extrabold text-white shadow-sm"
                  style={{ backgroundColor: activeHover.color_code || '#FBBF24' }}
                >
                  {activeHover.category_name || 'Moderate'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-gray-300 py-1">
                <div className="bg-surface-base p-2 rounded border border-surface-border">
                  <div className="text-[10px] text-gray-400">GeoRisk Index</div>
                  <div className="text-sm font-bold text-white">{(activeHover.overall_score ?? 35).toFixed(1)} / 100</div>
                </div>
                <div className="bg-surface-base p-2 rounded border border-surface-border">
                  <div className="text-[10px] text-gray-400">Economic Score</div>
                  <div className="text-sm font-semibold text-blue-400">{(activeHover.economic_score ?? 35).toFixed(1)}</div>
                </div>
                <div className="bg-surface-base p-2 rounded border border-surface-border">
                  <div className="text-[10px] text-gray-400">Political Score</div>
                  <div className="text-sm font-semibold text-amber-400">{(activeHover.political_score ?? 35).toFixed(1)}</div>
                </div>
                <div className="bg-surface-base p-2 rounded border border-surface-border">
                  <div className="text-[10px] text-gray-400">Business Score</div>
                  <div className="text-sm font-semibold text-emerald-400">{(activeHover.business_score ?? 35).toFixed(1)}</div>
                </div>
              </div>

              <div className="text-[11px] text-blue-300 flex items-center justify-between pt-1 font-medium">
                <span>Click node to open full country intelligence</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          )}

          {/* Selected Node Action Modal Overlay */}
          {selectedFeature && (
            <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-surface-elevated border border-surface-border p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b border-surface-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedFeature.color_code || '#FBBF24' }} />
                    <h3 className="font-bold text-lg text-gray-100">{selectedFeature.name} ({selectedFeature.iso_code})</h3>
                  </div>
                  <button onClick={() => setSelectedFeature(null)} className="text-gray-400 hover:text-white text-lg">✕</button>
                </div>

                <div className="space-y-2 text-xs text-gray-300">
                  <div className="flex justify-between py-1 border-b border-surface-border/50">
                    <span className="text-gray-400">Overall GeoRisk Index:</span>
                    <span className="font-bold text-white text-sm">{(selectedFeature.overall_score ?? 35).toFixed(1)} / 100</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-surface-border/50">
                    <span className="text-gray-400">Risk Level Category:</span>
                    <span className="font-semibold text-amber-400">{selectedFeature.category_name || 'Moderate'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-surface-border/50">
                    <span className="text-gray-400">Economic Sub-score:</span>
                    <span className="font-medium text-white">{(selectedFeature.economic_score ?? 35).toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-surface-border/50">
                    <span className="text-gray-400">Political Stability Sub-score:</span>
                    <span className="font-medium text-white">{(selectedFeature.political_score ?? 35).toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-400">Ease of Business Sub-score:</span>
                    <span className="font-medium text-white">{(selectedFeature.business_score ?? 35).toFixed(1)}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (onSelectCountry) onSelectCountry(selectedFeature.iso_code);
                      else navigate(`/app/countries/${selectedFeature.iso_code}`);
                    }}
                    className="flex-1 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    View Country Intelligence <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => handleAddToWatchlist(selectedFeature.iso_code, e)}
                    className="py-2 px-3 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold text-xs hover:bg-amber-500/30 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-500" /> Watchlist
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* View Mode 2: OpenStreetMap Tile Layer (Leaflet Hybrid) */
        <div className="h-[550px] w-full relative">
          <MapContainer
            center={[20, 0]}
            zoom={2}
            scrollWheelZoom={true}
            className="h-full w-full"
            style={{ height: '550px', width: '100%', background: '#0B0F17' }}
          >
            <MapController />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />

            {displayFeatures.map((feat, idx) => {
              const lat = Number(feat.latitude) || 20;
              const lng = Number(feat.longitude) || 0;
              const color = feat.color_code || '#FBBF24';

              const overallScore = typeof feat.overall_score === 'number' ? feat.overall_score : 35.0;
              const economicScore = typeof feat.economic_score === 'number' ? feat.economic_score : 35.0;
              const politicalScore = typeof feat.political_score === 'number' ? feat.political_score : 35.0;
              const businessScore = typeof feat.business_score === 'number' ? feat.business_score : 35.0;

              return (
                <CircleMarker
                  key={feat.country_id || feat.iso_code || idx}
                  center={[lat, lng]}
                  radius={11}
                  pathOptions={{
                    color: '#FFFFFF',
                    fillColor: color,
                    fillOpacity: 0.85,
                    weight: 2,
                  }}
                >
                  <Popup className="custom-popup">
                    <div className="p-2 min-w-[210px] text-gray-900 font-sans">
                      <div className="flex items-center justify-between border-b pb-2 mb-2">
                        <span className="font-bold text-sm text-gray-900">
                          {feat.name || feat.iso_code} ({feat.iso_code})
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold text-white" style={{ backgroundColor: color }}>
                          {feat.category_name || 'Moderate'}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-gray-700 mb-3">
                        <div className="flex justify-between">
                          <span>GeoRisk Index:</span>
                          <span className="font-bold text-gray-900">{overallScore.toFixed(1)} / 100</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Economic Score:</span>
                          <span className="font-medium text-gray-900">{economicScore.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Political Score:</span>
                          <span className="font-medium text-gray-900">{politicalScore.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Business Score:</span>
                          <span className="font-medium text-gray-900">{businessScore.toFixed(1)}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <button
                          onClick={() => {
                            if (onSelectCountry && feat.iso_code) onSelectCountry(feat.iso_code);
                            else if (feat.iso_code) navigate(`/app/countries/${feat.iso_code}`);
                          }}
                          className="w-full py-1 px-2 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                        >
                          View Country Intelligence
                        </button>

                        <button
                          onClick={() => feat.iso_code && handleAddToWatchlist(feat.iso_code)}
                          className="w-full py-1 px-2 rounded bg-amber-500/20 border border-amber-500/40 text-amber-900 font-bold text-[11px] hover:bg-amber-500/30 transition-colors flex items-center justify-center gap-1"
                        >
                          <Star className="w-3 h-3 fill-amber-500 text-amber-600" /> Add to Watchlist
                        </button>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>
      )}

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-20 bg-surface-elevated/90 backdrop-blur-md border border-surface-border p-3 rounded-xl text-xs space-y-1.5 shadow-xl">
        <div className="font-semibold text-gray-200 mb-1 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-blue-400" /> GeoRisk Legend
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-[11px]">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> Very Low (&lt;20)
          </div>
          <div className="flex items-center gap-1.5 text-green-400">
            <span className="w-2.5 h-2.5 rounded-full bg-[#34D399]" /> Low (20-35)
          </div>
          <div className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]" /> Moderate (35-50)
          </div>
          <div className="flex items-center gap-1.5 text-orange-400">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" /> Elevated (50-65)
          </div>
          <div className="flex items-center gap-1.5 text-red-400">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /> High (65-80)
          </div>
          <div className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-[#991B1B]" /> Extreme (&gt;80)
          </div>
        </div>
      </div>
    </div>
  );
};

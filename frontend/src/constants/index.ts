export const APP_NAME = 'GeoRisk Analytics';
export const APP_VERSION = 'v1.0.0 Enterprise';

export const NAVIGATION_LINKS = [
  { name: 'Dashboard', href: '/app/dashboard', icon: 'LayoutDashboard' },
  { name: 'Countries', href: '/app/countries', icon: 'Globe' },
  { name: 'World Map', href: '/app/map', icon: 'Map' },
  { name: 'Compare', href: '/app/compare', icon: 'GitCompare' },
  { name: 'Analytics', href: '/app/analytics', icon: 'BarChart3' },
  { name: 'Forecasting', href: '/app/forecast', icon: 'TrendingUp' },
  { name: 'News Intelligence', href: '/app/news', icon: 'Newspaper' },
  { name: 'AI Assistant', href: '/app/ai-assistant', icon: 'Bot', badge: 'AI' },
  { name: 'Reports', href: '/app/reports', icon: 'FileText' },
  { name: 'Watchlist', href: '/app/watchlist', icon: 'Bookmark' },
  { name: 'Admin Panel', href: '/app/admin', icon: 'ShieldAlert' },
  { name: 'Settings', href: '/app/settings', icon: 'Sliders' },
];

export const MOCK_FEATURED_COUNTRIES = [
  { id: '1', code: 'USA', name: 'United States', flag: '🇺🇸', region: 'North America', geoRiskScore: 18.4, riskCategory: 'Very Low' as const, gdpGrowth: 2.5, inflation: 3.1, politicalStability: 82, trend: 'stable' as const },
  { id: '2', code: 'DEU', name: 'Germany', flag: '🇩🇪', region: 'Europe', geoRiskScore: 21.2, riskCategory: 'Low' as const, gdpGrowth: 0.3, inflation: 2.8, politicalStability: 88, trend: 'stable' as const },
  { id: '3', code: 'IND', name: 'India', flag: '🇮🇳', region: 'Asia Pacific', geoRiskScore: 38.5, riskCategory: 'Moderate' as const, gdpGrowth: 6.8, inflation: 5.1, politicalStability: 64, trend: 'up' as const },
  { id: '4', code: 'BRA', name: 'Brazil', flag: '🇧🇷', region: 'Latin America', geoRiskScore: 45.1, riskCategory: 'Elevated' as const, gdpGrowth: 2.9, inflation: 4.6, politicalStability: 55, trend: 'down' as const },
  { id: '5', code: 'UKR', name: 'Ukraine', flag: '🇺🇦', region: 'Europe', geoRiskScore: 84.7, riskCategory: 'Extreme' as const, gdpGrowth: -4.8, inflation: 12.4, politicalStability: 15, trend: 'down' as const },
];

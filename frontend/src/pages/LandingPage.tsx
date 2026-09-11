import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, Globe, BarChart3, TrendingUp, Cpu, 
  ArrowRight, CheckCircle2, Server, Database, Layers
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface-base text-gray-100 font-sans selection:bg-brand-500 selection:text-white">
      {/* Navigation Header */}
      <header className="border-b border-surface-border/60 bg-surface-base/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold shadow-lg shadow-brand-600/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">GeoRisk Analytics</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#overview" className="hover:text-white transition-colors">Overview</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#tech-stack" className="hover:text-white transition-colors">Tech Stack</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/app/dashboard">
              <Button variant="primary" size="md">
                Launch Platform <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="overview" className="relative py-24 px-6 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/15 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <Cpu className="w-3.5 h-3.5 text-brand-400" /> Enterprise Risk & Investment Intelligence
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Global Investment Intelligence & <br />
            <span className="bg-gradient-to-r from-brand-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Geopolitical Risk Assessment
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-10">
            GeoRisk Analytics automates multi-source economic, political, governance, and conflict data aggregation to compute real-time, transparent investment risk scores across 195 countries.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/app/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto px-8">
                Enter Enterprise Terminal <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <a href="#features" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">
                Explore Architecture
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 px-6 border-t border-surface-border bg-surface-elevated/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Institutional-Grade Intelligence Modules</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm">
              Designed for financial analysts, multinational corporate strategists, and government policy researchers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface-elevated border border-surface-border p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mb-5">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">GeoRisk Score Engine</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Normalized risk indexing aggregating GDP growth, inflation, political stability, governance, sanctions, and armed conflict metrics.
              </p>
            </div>

            <div className="bg-surface-elevated border border-surface-border p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Predictive Forecasting</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Time-series forecasting models (Prophet, ARIMA, LightGBM) to project country risk trajectory across 1 to 5 year horizons.
              </p>
            </div>

            <div className="bg-surface-elevated border border-surface-border p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-5">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Multi-Country Comparison</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Side-by-side radar and correlation analytics evaluating up to 5 countries concurrently across macroeconomic indicators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Specs */}
      <section id="tech-stack" className="py-20 px-6 border-t border-surface-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Enterprise Technology Architecture</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm">
              Built on a modern micro-layered monorepo architecture engineered for high throughput and modular scalability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-surface-elevated border border-surface-border">
              <div className="flex items-center gap-3 mb-4 text-brand-400 font-semibold">
                <Layers className="w-5 h-5" /> Frontend Stack
              </div>
              <ul className="space-y-2.5 text-sm text-gray-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> React 19 & TypeScript</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Vite Build System</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Tailwind CSS Dark Design System</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> TanStack Query & Lucide Icons</li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-surface-elevated border border-surface-border">
              <div className="flex items-center gap-3 mb-4 text-emerald-400 font-semibold">
                <Server className="w-5 h-5" /> Backend Engine
              </div>
              <ul className="space-y-2.5 text-sm text-gray-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> FastAPI High-Performance Framework</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Python 3.12 & Pydantic v2</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> SQLAlchemy 2.0 ORM & Alembic</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> JWT Auth Architecture</li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-surface-elevated border border-surface-border">
              <div className="flex items-center gap-3 mb-4 text-amber-400 font-semibold">
                <Database className="w-5 h-5" /> Data & Infrastructure
              </div>
              <ul className="space-y-2.5 text-sm text-gray-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> PostgreSQL Relational Storage</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Redis In-Memory Cache</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Docker & Docker Compose Orchestration</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Scalable ETL Pipeline Framework</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-border py-12 px-6 bg-surface-base">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-brand-500" />
            <span className="font-bold text-gray-200">GeoRisk Analytics</span>
            <span>— Enterprise Risk & Investment Intelligence Platform</span>
          </div>
          <div>© {new Date().getFullYear()} GeoRisk Analytics. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

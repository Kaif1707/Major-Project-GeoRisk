import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { ProtectedRoute } from './ProtectedRoutes';

import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import { UnauthorizedPage } from '../pages/auth/UnauthorizedPage';
import { ForbiddenPage } from '../pages/auth/ForbiddenPage';

import { AppLayout } from '../layouts/AppLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { CountriesPage } from '../pages/CountriesPage';
import { CountryDetailPage } from '../pages/CountryDetailPage';
import { ComparePage } from '../pages/ComparePage';
import { WorldMapPage } from '../pages/WorldMapPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { ForecastPage } from '../pages/ForecastPage';
import { NewsPage } from '../pages/NewsPage';
import { AIAssistantPage } from '../pages/AIAssistantPage';
import { ReportsPage } from '../pages/ReportsPage';
import { WatchlistPage } from '../pages/WatchlistPage';
import { AdminPage } from '../pages/AdminPage';
import { SettingsPage } from '../pages/SettingsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />

        {/* Protected Application Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="countries" element={<CountriesPage />} />
            <Route path="countries/:code" element={<CountryDetailPage />} />
            <Route path="map" element={<WorldMapPage />} />
            <Route path="compare" element={<ComparePage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="forecast" element={<ForecastPage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="ai-assistant" element={<AIAssistantPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="watchlist" element={<WatchlistPage />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
};

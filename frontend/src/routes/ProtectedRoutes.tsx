import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/Skeleton';

interface ProtectedRouteProps {
  requiredPermission?: string;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredPermission,
  requiredRole,
}) => {
  const { isAuthenticated, isLoading, hasPermission, hasRole } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-base flex flex-col items-center justify-center p-6 space-y-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <Skeleton className="w-48 h-4 rounded" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
};

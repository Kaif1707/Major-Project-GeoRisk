import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const ForbiddenPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface-base flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
        <Lock className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-white mb-2">403 — Permission Denied</h1>
      <p className="text-sm text-gray-400 max-w-md mb-8">
        Your role tier does not possess the granular RBAC permissions required to access this system module.
      </p>
      <Link to="/app/dashboard">
        <Button variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};

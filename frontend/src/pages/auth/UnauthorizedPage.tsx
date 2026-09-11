import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface-base flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-white mb-2">401 — Authentication Required</h1>
      <p className="text-sm text-gray-400 max-w-md mb-8">
        Your active session has expired or requires valid enterprise authentication credentials to access this terminal module.
      </p>
      <Link to="/login">
        <Button variant="primary">
          <ArrowLeft className="w-4 h-4 mr-2" /> Sign In to Terminal
        </Button>
      </Link>
    </div>
  );
};

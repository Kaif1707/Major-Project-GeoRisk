import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something Went Wrong',
  message = 'An error occurred while loading this section. Please try again later.',
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border border-red-500/20 bg-red-500/5 rounded-xl">
      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 mb-3">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-semibold text-red-200">{title}</h4>
      <p className="text-xs text-gray-400 max-w-sm mt-1 mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

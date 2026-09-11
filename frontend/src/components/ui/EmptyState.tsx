import React from 'react';
import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Found',
  description = 'There is currently no information available for this view.',
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-surface-border rounded-xl bg-surface-elevated/40">
      <div className="w-12 h-12 rounded-full bg-surface-hover flex items-center justify-center text-gray-400 mb-3">
        <FolderOpen className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-gray-200">{title}</h4>
      <p className="text-xs text-gray-400 max-w-sm mt-1 mb-4">{description}</p>
      {action}
    </div>
  );
};

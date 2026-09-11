import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-6 border-t border-surface-border text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4 px-6">
      <div>
        © {new Date().getFullYear()} GeoRisk Analytics Platform. All rights reserved. Enterprise Risk Intelligence.
      </div>
      <div className="flex items-center gap-6 text-gray-400">
        <a href="#" className="hover:text-gray-200 transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-gray-200 transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-gray-200 transition-colors">API Docs</a>
        <a href="#" className="hover:text-gray-200 transition-colors">Support</a>
      </div>
    </footer>
  );
};

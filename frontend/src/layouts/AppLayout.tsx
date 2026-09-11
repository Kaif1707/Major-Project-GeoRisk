import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const AppLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-surface-base text-gray-100 flex">
      {/* Collapsible Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Wrapper */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {/* Top Navbar */}
        <Navbar sidebarCollapsed={sidebarCollapsed} />

        {/* Dynamic Page Content */}
        <main className="flex-1 pt-20 px-6 pb-6 overflow-x-hidden">
          <Outlet />
        </main>

        {/* Application Footer */}
        <Footer />
      </div>
    </div>
  );
};

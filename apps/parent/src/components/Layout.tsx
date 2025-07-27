'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      
      {/* Main Content */}
      <main 
        className={`flex-1 transition-all duration-300 ${
          isSidebarCollapsed ? 'mr-20' : 'mr-70'
        } md:mr-0`}
      >
        <div className="h-full overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
} 
'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar isSidebarOpen={isSidebarOpen} onToggle={() => setSidebarOpen(v => !v)} />
      
      {/* Main Content */}
      <motion.main
        animate={{ 
          marginRight: isSidebarOpen ? 256 : 64,
          marginLeft: 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="pt-16 min-h-screen"
      >
        <div className="p-6">
          {children}
        </div>
      </motion.main>
    </div>
  );
} 
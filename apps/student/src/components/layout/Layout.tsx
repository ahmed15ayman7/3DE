'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar isSidebarOpen={isSidebarOpen} onToggle={() => setSidebarOpen(v => !v)} isMobile={isMobile} />
      
      {/* Main Content */}
      <motion.main
        animate={{ 
          marginRight: isSidebarOpen && !isMobile ? 256 :isSidebarOpen && isMobile?64 : isMobile ? 0 : 64,
          marginLeft: 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="pt-24 min-h-screen"
      >
        <div className="p-6">
          {children}
        </div>
      </motion.main>
    </div>
  );
} 
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@3de/ui';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsControllerProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const TabsController: React.FC<TabsControllerProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = ''
}) => {
  return (
    <div className={`flex space-x-1 space-x-reverse bg-gray-100 p-1 rounded-lg ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}; 
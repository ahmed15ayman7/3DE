"use client";
import React, { useState } from 'react';
export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultActiveTab?: string;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  onTabChange?: (tabId: string) => void;
}

const getVariantClasses = (variant: TabsProps['variant']) => {
  switch (variant) {
    case 'pills':
      return {
        container: 'bg-gray-100 p-1 rounded-lg',
        tab: 'px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
        active: 'bg-white text-gray-900 shadow-sm',
        inactive: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      };
    case 'underline':
      return {
        container: 'border-b border-gray-200',
        tab: 'px-4 py-2 text-sm font-medium border-b-2 transition-all duration-200',
        active: 'border-blue-500 text-blue-600',
        inactive: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      };
    default:
      return {
        container: '',
        tab: 'px-4 py-2 text-sm font-medium transition-all duration-200',
        active: 'text-blue-600 border-b-2 border-blue-600',
        inactive: 'text-gray-500 hover:text-gray-700'
      };
  }
};

const getSizeClasses = (size: TabsProps['size']) => {
  switch (size) {
    case 'sm':
      return 'text-xs';
    case 'lg':
      return 'text-base';
    default:
      return 'text-sm';
  }
};

export const Tabs: React.FC<TabsProps> = ({
  items,
  defaultActiveTab,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className = '',
  onTabChange
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || items[0]?.id || '');

  const handleTabClick = (tabId: string) => {
    const tab = items.find(item => item.id === tabId);
    if (tab && !tab.disabled) {
      setActiveTab(tabId);
      onTabChange?.(tabId);
    }
  };

  const variantClasses = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);
  const widthClass = fullWidth ? 'w-full' : '';

  const activeTabContent = items.find(item => item.id === activeTab)?.content;

  return (
    <div className={`${widthClass} ${className}`}>
      <div className={`flex ${fullWidth ? 'w-full' : ''} ${variantClasses.container}`}>
        {items.map((item) => {
          const isActive = item.id === activeTab;
          const isDisabled = item.disabled;
          
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              disabled={isDisabled}
              className={`
                ${variantClasses.tab}
                ${sizeClasses}
                ${fullWidth ? 'flex-1' : ''}
                ${isActive ? variantClasses.active : variantClasses.inactive}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                flex items-center justify-center space-x-2
              `}
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
      
      <div className="mt-4">
        {activeTabContent}
      </div>
    </div>
  );
};

export interface TabPanelProps {
  children: React.ReactNode;
  className?: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
};

export interface TabListProps {
  children: React.ReactNode;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

export const TabList: React.FC<TabListProps> = ({
  children,
  variant = 'default',
  className = ''
}) => {
  const variantClasses = getVariantClasses(variant);
  
  return (
    <div className={`flex ${variantClasses.container} ${className}`}>
      {children}
    </div>
  );
};

export interface TabTriggerProps {
  children: React.ReactNode;
  isActive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

export const TabTrigger: React.FC<TabTriggerProps> = ({
  children,
  isActive = false,
  disabled = false,
  onClick,
  className = '',
  icon
}) => {
  const variantClasses = getVariantClasses('default');
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantClasses.tab}
        ${isActive ? variantClasses.active : variantClasses.inactive}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        flex items-center space-x-2
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}; 
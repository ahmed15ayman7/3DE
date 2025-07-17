'use client';
import React, { useState } from 'react';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
  variant?: 'default' | 'bordered' | 'separated';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onItemToggle?: (itemId: string, isOpen: boolean) => void;
}

const getVariantClasses = (variant: AccordionProps['variant']) => {
  switch (variant) {
    case 'bordered':
      return {
        container: 'border border-gray-200 rounded-lg divide-y divide-gray-200',
        item: '',
        header: 'px-4 py-3',
        content: 'px-4 pb-3'
      };
    case 'separated':
      return {
        container: 'space-y-2',
        item: 'border border-gray-200 rounded-lg',
        header: 'px-4 py-3',
        content: 'px-4 pb-3'
      };
    default:
      return {
        container: 'border border-gray-200 rounded-lg divide-y divide-gray-200',
        item: '',
        header: 'px-4 py-3',
        content: 'px-4 pb-3'
      };
  }
};

const getSizeClasses = (size: AccordionProps['size']) => {
  switch (size) {
    case 'sm':
      return 'text-sm';
    case 'lg':
      return 'text-lg';
    default:
      return 'text-base';
  }
};

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpen = [],
  variant = 'default',
  size = 'md',
  className = '',
  onItemToggle
}) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const handleItemToggle = (itemId: string) => {
    const isCurrentlyOpen = openItems.includes(itemId);
    let newOpenItems: string[];

    if (allowMultiple) {
      if (isCurrentlyOpen) {
        newOpenItems = openItems.filter(id => id !== itemId);
      } else {
        newOpenItems = [...openItems, itemId];
      }
    } else {
      newOpenItems = isCurrentlyOpen ? [] : [itemId];
    }

    setOpenItems(newOpenItems);
    onItemToggle?.(itemId, !isCurrentlyOpen);
  };

  const variantClasses = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);

  return (
    <div className={`${variantClasses.container} ${className}`}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);
        const isDisabled = item.disabled;

        return (
          <div key={item.id} className={variantClasses.item}>
            <button
              onClick={() => !isDisabled && handleItemToggle(item.id)}
              disabled={isDisabled}
              className={`
                w-full flex items-center justify-between
                ${variantClasses.header}
                ${sizeClasses}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}
                transition-colors duration-200
              `}
            >
              <div className="flex items-center gap-2">
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                <span className="font-medium text-left">{item.title}</span>
              </div>
              
              <svg
                className={`
                  w-5 h-5 flex-shrink-0 transition-transform duration-200
                  ${isOpen ? 'rotate-180' : ''}
                `}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            
            {isOpen && (
              <div
                className={`
                  ${variantClasses.content}
                  animate-in slide-in-from-top-2
                  duration-200
                `}
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export interface AccordionItemProps {
  children: React.ReactNode;
  className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`border-b border-gray-200 last:border-b-0 ${className}`}>
      {children}
    </div>
  );
};

export interface AccordionTriggerProps {
  children: React.ReactNode;
  isOpen?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
  children,
  isOpen = false,
  disabled = false,
  onClick,
  className = '',
  icon
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center justify-between px-4 py-3
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}
        transition-colors duration-200
        ${className}
      `}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className="font-medium text-left">{children}</span>
      </div>
      
      <svg
        className={`
          w-5 h-5 flex-shrink-0 transition-transform duration-200
          ${isOpen ? 'rotate-180' : ''}
        `}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  );
};

export interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

export const AccordionContent: React.FC<AccordionContentProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`px-4 pb-3 ${className}`}>
      {children}
    </div>
  );
}; 
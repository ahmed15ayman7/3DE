"use client";
import React, { useState, useRef, useEffect } from 'react';
export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
  disabled?: boolean;
  maxWidth?: number;
}

const getPositionClasses = (position: TooltipProps['position']) => {
  switch (position) {
    case 'top':
      return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    case 'bottom':
      return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
    case 'left':
      return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
    case 'right':
      return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
    default:
      return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
  }
};

const getArrowClasses = (position: TooltipProps['position']) => {
  switch (position) {
    case 'top':
      return 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-900';
    case 'bottom':
      return 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-900';
    case 'left':
      return 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-900';
    case 'right':
      return 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-900';
    default:
      return 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-900';
  }
};

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  delay = 200,
  className = '',
  disabled = false,
  maxWidth = 200
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (disabled) return;
    
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const positionClasses = getPositionClasses(position);
  const arrowClasses = getArrowClasses(position);

  return (
    <div
      ref={triggerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`
            absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg
            ${positionClasses}
            max-w-xs
            animate-in fade-in-0 zoom-in-95
            duration-200
          `}
          style={{ maxWidth: `${maxWidth}px` }}
          role="tooltip"
        >
          <div className="relative">
            {content}
            <div
              className={`
                absolute w-0 h-0 border-4 border-transparent
                ${arrowClasses}
              `}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export interface TooltipProviderProps {
  children: React.ReactNode;
  className?: string;
}

export const TooltipProvider: React.FC<TooltipProviderProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      {children}
    </div>
  );
}; 
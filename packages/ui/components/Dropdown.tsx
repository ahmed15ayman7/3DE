"use client";
import React, { useState, useRef, useEffect } from 'react';
export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  divider?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  className?: string;
  disabled?: boolean;
  maxHeight?: number;
}

const getPositionClasses = (position: DropdownProps['position']) => {
  switch (position) {
    case 'bottom-left':
      return 'top-full left-0 mt-1';
    case 'bottom-right':
      return 'top-full right-0 mt-1';
    case 'top-left':
      return 'bottom-full left-0 mb-1';
    case 'top-right':
      return 'bottom-full right-0 mb-1';
    default:
      return 'top-full left-0 mt-1';
  }
};

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  position = 'bottom-left',
  className = '',
  disabled = false,
  maxHeight = 300
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleTriggerClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled && item.onClick) {
      item.onClick();
      setIsOpen(false);
    }
  };

  const positionClasses = getPositionClasses(position);

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        ref={triggerRef}
        onClick={handleTriggerClick}
        className={`${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className={`
            absolute z-50 min-w-48 bg-white border border-gray-200 rounded-lg shadow-lg
            ${positionClasses}
            animate-in fade-in-0 zoom-in-95
            duration-200
          `}
          style={{ maxHeight: `${maxHeight}px` }}
        >
          <div className="py-1 overflow-y-auto">
            {items.map((item, index) => (
              <React.Fragment key={item.id}>
                {item.divider ? (
                  <div className="border-t border-gray-100 my-1" />
                ) : (
                  <button
                    onClick={() => handleItemClick(item)}
                    disabled={item.disabled}
                    className={`
                      w-full px-4 py-2 text-left text-sm
                      flex items-center space-x-2
                      transition-colors duration-150
                      ${item.disabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                      }
                    `}
                  >
                    {item.icon && (
                      <span className="flex-shrink-0 w-4 h-4">
                        {item.icon}
                      </span>
                    )}
                    <span className="flex-1">{item.label}</span>
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export interface DropdownMenuProps {
  children: React.ReactNode;
  className?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`py-1 ${className}`}>
      {children}
    </div>
  );
};

export interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  onClick,
  disabled = false,
  icon,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full px-4 py-2 text-left text-sm
        flex items-center space-x-2
        transition-colors duration-150
        ${disabled
          ? 'text-gray-400 cursor-not-allowed'
          : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
        }
        ${className}
      `}
    >
      {icon && (
        <span className="flex-shrink-0 w-4 h-4">
          {icon}
        </span>
      )}
      <span className="flex-1">{children}</span>
    </button>
  );
};

export interface DropdownDividerProps {
  className?: string;
}

export const DropdownDivider: React.FC<DropdownDividerProps> = ({
  className = ''
}) => {
  return (
    <div className={`border-t border-gray-100 my-1 ${className}`} />
  );
}; 
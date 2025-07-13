import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  shadow?: 'sm' | 'md' | 'lg' | 'none';
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'md',
  shadow = 'md',
  hover = false,
  onClick,
}) => {
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    none: '',
  };

  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-custom',
    lg: 'shadow-lg',
    none: '',
  };

  const classes = clsx(
    'bg-white rounded-lg border border-gray-200',
    paddingClasses[padding],
    shadowClasses[shadow],
    hover && 'transition-all duration-200 hover:shadow-lg hover:-translate-y-1',
    onClick && 'cursor-pointer',
    className
  );

  return (
    <div
      className={classes}
      onClick={onClick}
    >
      {children}
    </div>
  );
}; 
import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div
      className={`transition-all duration-300 ease-in-out ${className}`}
    >
      {children}
    </div>
  );
}; 
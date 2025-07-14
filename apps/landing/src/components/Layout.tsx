'use client';

import { ReactNode } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import Breadcrumb from './Breadcrumb';

interface LayoutProps {
  children: ReactNode;
  showBreadcrumb?: boolean;
  breadcrumbItems?: Array<{
    label: string;
    href?: string;
    icon?: ReactNode;
    current?: boolean;
  }>;
  className?: string;
}

export default function Layout({
  children,
  showBreadcrumb = false,
  breadcrumbItems,
  className = '',
}: LayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      <Navigation />
      
      <main className="flex-1 pt-20">
        {showBreadcrumb && (
          <Breadcrumb items={breadcrumbItems} />
        )}
        {children}
      </main>
      
      <Footer />
    </div>
  );
} 
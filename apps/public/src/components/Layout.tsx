'use client';
import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@3de/auth';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import { RouteLoader } from '@3de/ui';

interface LayoutProps {
  children: ReactNode;
  className?: string;
  requireAuth?: boolean;
}

export default function Layout({ children, className, requireAuth = true }: LayoutProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  useEffect(() => {
    if (!isLoading && requireAuth && !user) {
      router.push('/auth/signin');
    }
  }, [user, isLoading, requireAuth, router]);

  useEffect(() => {
    // Handle page loading states
    const handleRouteChange = () => {
      setIsPageLoading(true);
      setTimeout(() => setIsPageLoading(false), 500);
    };

    // Listen for browser navigation
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Show loading if authenticating or if user is required but not available
  if (isLoading || (requireAuth && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-main mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Don't show sidebar for auth pages
  const isAuthPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/auth');

  if (isAuthPage || !requireAuth) {
    return (
      <div className={className}>
        {isPageLoading && <RouteLoader />}
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isPageLoading && <RouteLoader />}
      
      <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      
      {/* Main Content */}
      <main className={`md:mr-20  transition-all duration-300 min-h-screen ${isExpanded ? 'lg:mr-72' : 'lg:mr-20'}`}>
        <div className="p-4 md:p-6 lg:p-8">
          <div className={className}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
} 
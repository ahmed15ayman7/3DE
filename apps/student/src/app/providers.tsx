'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '@3de/auth';
import { RouteLoader } from '@3de/ui';
import { Suspense, useEffect, useState } from 'react';
import usePersistScreenshotBlackout from '../hooks/usePersistScreenshotBlackout';

export default function Providers({ children }: { children: React.ReactNode }) {
  usePersistScreenshotBlackout();
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
      },
    },
  }));



  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // e.preventDefault();
      console.log('Right-click blocked');
    };
  
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('Pressed key:', e.key);
  
      const isWindowsScreenshot = e.key === 'PrintScreen';
  
      const isMacScreenshot =
        e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5');
  
      const isBlockedShortcut =
        (e.ctrlKey && ['u', 's', 'c'].includes(e.key.toLowerCase())) ||
        isWindowsScreenshot ||
        isMacScreenshot;
  
      if (isBlockedShortcut) {
        e.preventDefault();
        console.log('Blocked key or shortcut:', e.key);
      }
    };
  
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
  
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  

  return (
    <QueryClientProvider client={queryClient}>
        <Suspense fallback={<RouteLoader showText loadingText="طريق النجاح يبدأ بخطوة... ويستمر بالصبر" size="md" />}>
      <AuthProvider>
        {children}
          
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </AuthProvider>
        </Suspense>
    </QueryClientProvider>
  );
} 
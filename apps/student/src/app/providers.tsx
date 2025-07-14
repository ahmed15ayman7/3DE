'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '@3de/auth';
import { RouteLoader } from '@3de/ui';
import { Suspense, useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* <Suspense fallback={<RouteLoader showText loadingText="طريق النجاح يبدأ بخطوة... ويستمر بالصبر" size="md" />}> */}
        {children}
        {/* </Suspense> */}
          
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </AuthProvider>
    </QueryClientProvider>
  );
} 
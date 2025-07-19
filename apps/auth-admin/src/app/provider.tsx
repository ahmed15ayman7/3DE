'use client';
import { Suspense } from "react";
import { RouteLoader } from '@3de/ui';
import { AuthProvider } from '@3de/auth';
import { ErrorBoundary } from '../components/ErrorBoundary';

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<RouteLoader />}>
      <ErrorBoundary>
        <AuthProvider>{children}</AuthProvider>
      </ErrorBoundary>
    </Suspense>
  );
}
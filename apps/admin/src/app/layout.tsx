'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@3de/auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Toaster } from '@3de/ui';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSidebarToggle = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <div className="min-h-screen">
              {/* Sidebar */}
              <Sidebar
                isCollapsed={sidebarCollapsed}
                onToggle={handleSidebarToggle}
                isMobile={isMobile}
                isOpen={mobileMenuOpen}
                onClose={handleMobileMenuClose}
              />

              {/* Header */}
              <Header
                onMenuClick={handleSidebarToggle}
                isMobile={isMobile}
                isCollapsed={sidebarCollapsed}
              />

              {/* Main Content */}
              <main 
                className={`transition-all duration-300 ${
                  isMobile 
                    ? 'pt-20' 
                    : sidebarCollapsed 
                      ? 'pr-[72px] pt-20' 
                      : 'pr-[280px] pt-20'
                }`}
              >
                <div className="p-6">
                  {children}
                </div>
              </main>
            </div>

            {/* Toaster for notifications */}
            <Toaster />
            
            {/* React Query Devtools - only in development */}
            {process.env.NODE_ENV === 'development' && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

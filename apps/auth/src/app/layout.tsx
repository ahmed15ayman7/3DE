import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@3de/auth';
import { ErrorBoundary } from '../components/ErrorBoundary';
import "@3de/ui/styles.css";
import { Suspense } from "react";
import { RouteLoader } from '@3de/ui';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "3DE - تسجيل الدخول",
  description: "منصة التعلم الإلكتروني المتقدمة - تسجيل الدخول والمصادقة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <AuthProvider>
            <Suspense fallback={<RouteLoader showText loadingText="طريق النجاح يبدأ بخطوة... ويستمر بالصبر" size="md" />}>
              {children}
            </Suspense>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

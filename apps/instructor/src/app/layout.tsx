import type { Metadata } from 'next'
import RootProvider from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'لوحة تحكم المحاضر - أكاديمية 3DE',
  description: 'منصة إدارة شاملة للمحاضرين في أكاديمية 3DE التعليمية',
  keywords: ['تعليم', 'أكاديمية', 'محاضر', 'إدارة', '3DE'],
  authors: [{ name: 'أكاديمية 3DE' }],
  // viewport: {
  //   width: 'device-width',
  //   initialScale: 1,
  //   maximumScale: 1,
  // },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta charSet="utf-8" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#3B82F6" />
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; media-src 'self' blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' blob:; frame-src 'self' blob:; worker-src 'self' blob:; child-src 'self' blob:; form-action 'self'; base-uri 'self'; block-all-mixed-content; upgrade-insecure-requests; report-uri https://your-report-uri.com/csp-report" />
      </head>
      <body className="h-full bg-gray-50 text-gray-900  antialiased">
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  )
}

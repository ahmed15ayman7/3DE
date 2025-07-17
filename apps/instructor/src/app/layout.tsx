import type { Metadata } from 'next'
import './globals.css'
import RootProvider from './providers'

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
      </head>
      <body className="h-full bg-gray-50 text-gray-900 font-arabic antialiased">
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  )
}

'use client';

import { Inter } from 'next/font/google'
import './globals.css'
import QueryProvider from '../components/QueryProvider'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>منصة 3DE - لوحة المحاضر</title>
        <meta name="description" content="لوحة تحكم المحاضر في منصة 3DE التعليمية" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </head>
      <body className="font-sans bg-gray-50 text-gray-900 antialiased">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}

'use client';

import './globals.css'
import QueryProvider from '../components/QueryProvider'
import { Cairo, Tajawal } from "next/font/google";
const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: 'swap',
});

const tajawal = Tajawal({
  variable: "--font-tajawal", 
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700"],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${tajawal.variable}`}>
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

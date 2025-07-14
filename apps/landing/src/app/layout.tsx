import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

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

export const metadata: Metadata = {
  metadataBase: new URL('https://3de.sa'),
  title: {
    default: "أكاديمية 3DE - نحو تعليم رقمي متميز",
    template: "%s | أكاديمية 3DE"
  },
  description: "منصة تعليمية شاملة لكل المراحل - كورسات احترافية ومحاضرون متميزون في بيئة تعليمية متطورة",
  keywords: [
    "أكاديمية 3DE",
    "التعليم الرقمي",
    "كورسات أونلاين", 
    "التعليم الإلكتروني",
    "منصة تعليمية",
    "كورسات عربية",
    "تعلم اونلاين"
  ],
  authors: [{ name: "أكاديمية 3DE" }],
  creator: "أكاديمية 3DE",
  publisher: "أكاديمية 3DE",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: 'https://3de.sa',
    siteName: 'أكاديمية 3DE',
    title: 'أكاديمية 3DE - نحو تعليم رقمي متميز',
    description: 'منصة تعليمية شاملة لكل المراحل - كورسات احترافية ومحاضرون متميزون في بيئة تعليمية متطورة',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'أكاديمية 3DE',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'أكاديمية 3DE - نحو تعليم رقمي متميز',
    description: 'منصة تعليمية شاملة لكل المراحل - كورسات احترافية ومحاضرون متميزون في بيئة تعليمية متطورة',
    images: ['/og-image.jpg'],
    creator: '@3de_academy',
  },
  alternates: {
    canonical: 'https://3de.sa',
    languages: {
      'ar-SA': 'https://3de.sa',
      'ar': 'https://3de.sa/ar',
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#249491" />
      </head>
      <body
        className={`${cairo.variable} ${tajawal.variable} font-sans antialiased bg-gray-50 text-text-primary min-h-screen`}
        suppressHydrationWarning={true}
      >
        <Providers>
          <div id="root" className="flex flex-col min-h-screen">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}

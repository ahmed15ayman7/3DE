import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@3de/ui/styles.css";
import Providers from './providers';
import { Toaster } from "@3de/ui";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "منصة 3DE التعليمية - الطالب",
  description: "منصة تعليمية متكاملة للطلاب",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

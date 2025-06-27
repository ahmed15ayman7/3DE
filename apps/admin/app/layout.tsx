'use client';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { Cairo } from 'next/font/google';
import { Providers } from './providers';
import '../globals.css';
import Script from 'next/script';
const cairo = Cairo({
    subsets: ['arabic'],
    variable: '--font-cairo',
    weight: ['300', '400', '500', '600', '700'],
});




export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const content = (<AppRouterCacheProvider>

        <Providers>
            {children}
            {/* <div id="google_translate_element">
            </div> */}
        </Providers>
    </AppRouterCacheProvider>)

    return (
        <html lang={"ar"}>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#000000" />
                <title>3DE - لوحة التحكم</title>
                <meta name="description" content="  لوحة التحكم " />
                <meta name="author" content="3DE" />
                <meta name="keywords" content="3DE , 3DE مصر , 3DE المنصة العربية الاولي للتعليم المستمر" />
                <meta name="robots" content="index, follow" />
                <Script src="/assets/scripts/google-translate.js" strategy="beforeInteractive" />

            </head>
            <body className={cairo.variable}>
                {content}
            </body>
        </html>
    );
} 
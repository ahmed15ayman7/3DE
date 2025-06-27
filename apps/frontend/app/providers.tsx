'use client';

import { SessionProvider } from 'next-auth/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Cairo } from 'next/font/google';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextIntlClientProvider } from 'next-intl';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
const cairo = Cairo({
    subsets: ['arabic'],
    variable: '--font-cairo',
    weight: ['300', '400', '500', '600', '700'],
});
const messages = {
    // en: require('@/i18n/messages/en.json'),
    ar: require('@/i18n/messages/ar.json'),
};
const theme = createTheme({
    direction: 'rtl',
    palette: {
        primary: {
            main: '#249491',
            light: '#249491',
            dark: '#003f59',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#003f59',
            light: '#003f59',
            dark: '#003f59',
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#fff7e2',
            paper: '#F5F5F5',
        },
        text: {
            primary: '#002D32',
            secondary: '#666666',
        },
    },
    typography: {
        fontFamily: cairo.style.fontFamily,
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '0.5rem',
                    padding: '0.5rem 1.5rem',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '0.5rem',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 45, 50, 0.1), 0 2px 4px -1px rgba(0, 45, 50, 0.06)',
                },
            },
        },
    },
});


export function Providers({ children, locale }: { children: React.ReactNode, locale: string }) {

    const queryClient = new QueryClient();
    return <QueryClientProvider client={queryClient}> <SessionProvider>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <NextIntlClientProvider messages={messages["ar" as keyof typeof messages]} locale={"ar"}>
                {children}
                <LanguageSwitcher />
            </NextIntlClientProvider>
        </ThemeProvider>
    </SessionProvider>
    </QueryClientProvider>;
}
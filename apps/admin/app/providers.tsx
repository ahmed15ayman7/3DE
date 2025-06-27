'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ar } from 'date-fns/locale';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { ReactNode } from 'react';
import { Cairo } from 'next/font/google';
const cairo = Cairo({
    subsets: ['arabic'],
    variable: '--font-cairo',
    weight: ['300', '400', '500', '600', '700'],
});
// إنشاء كاش للـ RTL
const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
});

// إنشاء ثيم مخصص
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
// إنشاء QueryClient
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                <CacheProvider value={cacheRtl}>
                    <ThemeProvider theme={theme}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ar}>
                            {children}
                        </LocalizationProvider>
                    </ThemeProvider>
                </CacheProvider>
            </QueryClientProvider>
        </SessionProvider>
    );
}
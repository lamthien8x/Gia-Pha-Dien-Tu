'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { AuthProvider } from '@/components/auth-provider';

// Clear invalid theme value from localStorage if it exists
if (typeof window !== 'undefined') {
    const theme = localStorage.getItem('theme');
    if (theme && (theme.startsWith('{') || theme.includes('MI_THEME'))) {
        localStorage.removeItem('theme');
    }
}

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        retry: 1,
                    },
                },
            }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            <NextThemesProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
                <AuthProvider>{children}</AuthProvider>
            </NextThemesProvider>
        </QueryClientProvider>
    );
}


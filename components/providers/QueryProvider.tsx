"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Cache data for 30 minutes - data doesn't change frequently
        staleTime: 30 * 60 * 1000,
        // Keep data in cache for 1 hour
        gcTime: 60 * 60 * 1000,
        // Retry failed queries up to 2 times
        retry: 2,
        // Retry with exponential backoff
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Don't refetch on window focus - only refetch manually or on mutations
        refetchOnWindowFocus: false,
        // Don't refetch on reconnect unless data is stale
        refetchOnReconnect: false,
        // Don't refetch on mount if data exists and is not stale
        refetchOnMount: false,
      },
      mutations: {
        // Retry failed mutations once
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
} 
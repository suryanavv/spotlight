"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { toast } from 'sonner';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Cache data for 30 minutes - data doesn't change frequently
        staleTime: 30 * 60 * 1000,
        // Keep data in cache for 1 hour
        gcTime: 60 * 60 * 1000,
        // Retry failed queries up to 3 times with better backoff
        retry: (failureCount, error: unknown) => {
          // Don't retry on 4xx errors (client errors)
          if (error && typeof error === 'object' && 'status' in error && typeof error.status === 'number') {
            if (error.status >= 400 && error.status < 500) {
              return false;
            }
          }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
        // Retry with exponential backoff with jitter
        retryDelay: (attemptIndex) => {
          const baseDelay = 1000 * 2 ** attemptIndex;
          const jitter = Math.random() * 1000;
          return Math.min(baseDelay + jitter, 30000);
        },
        // Network mode: always fetch when online
        networkMode: 'online',
        // Don't refetch on window focus - only refetch manually or on mutations
        refetchOnWindowFocus: false,
        // Don't refetch on reconnect unless data is stale
        refetchOnReconnect: 'always',
        // Don't refetch on mount if data exists and is not stale
        refetchOnMount: false,
      },
      mutations: {
        // Retry failed mutations once
        retry: 1,
        // Show error toasts for failed mutations
        onError: (error: unknown) => {
          const message = (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string')
            ? error.message
            : 'An unexpected error occurred';
          toast.error(message);
        },
        // Network mode for mutations
        networkMode: 'online',
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
} 
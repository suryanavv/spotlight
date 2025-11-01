import './globals.css';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/supabase/auth';

export const metadata = {
  title: 'Spotlight',
  description: 'A portfolio builder powered by Supabase',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
      </head>
      <body>
        <AuthProvider>
          <Toaster />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
} 
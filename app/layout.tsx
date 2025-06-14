import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'Spotlight',
  description: 'A migrated Next.js app',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        </head>
        <body>
          <Toaster />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
} 
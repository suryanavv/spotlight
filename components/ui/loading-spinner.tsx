"use client"

import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  text?: string;
}

export function LoadingSpinner({ text = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="flex h-full min-h-[300px] flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        <p className="mt-3 text-xs text-gray-500">{text}</p>
      </div>
    </div>
  );
} 
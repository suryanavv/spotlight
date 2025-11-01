"use client"

import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";

const OverviewClient = dynamic(() => import('@/components/dashboard/overview-client'), {
  ssr: false,
  loading: () => (
    <div className="space-y-4 mt-16 md:mt-0 pt-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-7 w-24" />
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-border">
        <Skeleton className="h-7 w-40" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-lg mt-8" />
    </div>
  )
});

export default function Overview() {
  return <OverviewClient />;
}

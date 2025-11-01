"use client"

import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";

const EducationClient = dynamic(() => import('@/components/dashboard/education-client'), {
  ssr: false,
  loading: () => (
    <div className="space-y-4 mt-16 md:mt-0 pt-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-7 w-32" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>
    </div>
  )
});

export default function EducationPage() {
  return <EducationClient />;
}
"use client"

import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";

const BlogsClient = dynamic(() => import('@/components/dashboard/blogs-client'), {
  ssr: false,
  loading: () => (
    <div className="space-y-4 mt-16 md:mt-0 pt-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-7 w-24" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    </div>
  )
});

export default function BlogsPage() {
  return <BlogsClient />;
}

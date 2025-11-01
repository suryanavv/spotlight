"use client"

import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";

const ProfileSettingsClient = dynamic(() => import('@/components/dashboard/profile-settings-client'), {
  ssr: false,
  loading: () => (
    <div className="space-y-4 mt-16 md:mt-0 pt-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-32 rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-10 rounded-md" />
          <Skeleton className="h-10 rounded-md" />
                  </div>
        <Skeleton className="h-20 rounded-md" />
        <Skeleton className="h-10 rounded-md" />
            </div>
    </div>
  )
});

export default function ProfileSettings() {
  return <ProfileSettingsClient />;
}

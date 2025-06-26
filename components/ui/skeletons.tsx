import { Skeleton } from "./skeleton"
import { Card, CardContent, CardHeader } from "./card"

// Overview page skeleton
export function OverviewSkeleton() {
  return (
    <div className="space-y-3 sm:space-y-4 mt-16 md:mt-0 pt-4 sm:pt-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 sm:h-6 w-32 sm:w-40" />
      </div>
      
      {/* Button area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 pb-2 sm:pb-3 border-b border-border">
        <Skeleton className="h-6 sm:h-7 w-28 sm:w-36 rounded-full" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 pt-3 sm:pt-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="p-3 sm:p-4 pb-1 sm:pb-2 flex flex-row items-center justify-between mb-2 sm:mb-3">
              <Skeleton className="h-4 sm:h-5 w-16 sm:w-20" />
              <Skeleton className="h-6 sm:h-8 w-6 sm:w-8 rounded-lg" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <Skeleton className="h-8 sm:h-12 w-12 sm:w-16 mb-1 sm:mb-2" />
              <Skeleton className="h-3 sm:h-4 w-full mb-3 sm:mb-6" />
              <Skeleton className="h-6 sm:h-8 w-full rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Profile Completion Card */}
      <Card className="mt-6 sm:mt-8">
        <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
          <Skeleton className="h-5 sm:h-6 w-28 sm:w-32" />
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="mb-4 sm:mb-6">
            <div className="flex justify-between mb-1 sm:mb-2">
              <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
              <Skeleton className="h-3 sm:h-4 w-10 sm:w-12" />
            </div>
            <Skeleton className="h-1.5 sm:h-2 w-full rounded-full" />
          </div>
          <div className="space-y-1 sm:space-y-2 divide-y divide-border/60">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex justify-between items-center py-2 sm:py-3 first:pt-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Skeleton className="h-3 sm:h-4 w-3 sm:w-4 rounded-full" />
                  <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
                </div>
                <Skeleton className="h-5 sm:h-6 w-10 sm:w-12 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Projects page skeleton
export function ProjectsSkeleton() {
  return (
    <div className="space-y-3 sm:space-y-4 mt-16 md:mt-0 pt-4 sm:pt-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
        <Skeleton className="h-5 sm:h-6 w-16 sm:w-20" />
        <Skeleton className="h-6 sm:h-7 w-24 sm:w-28 rounded-full" />
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 pt-2 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            {/* Image placeholder */}
            <Skeleton className="h-28 sm:h-36 w-full" />
            
            <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <Skeleton className="h-3 sm:h-4 w-3/4" />
            </CardHeader>

            <CardContent className="px-3 sm:px-6">
              <Skeleton className="h-2.5 sm:h-3 w-full mb-1" />
              <Skeleton className="h-2.5 sm:h-3 w-2/3 mb-2 sm:mb-3" />
              
              {/* Technology tags */}
              <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
                {Array.from({ length: 3 }).map((_, tagIndex) => (
                  <Skeleton key={tagIndex} className="h-4 sm:h-5 w-12 sm:w-16 rounded-full" />
                ))}
              </div>
            </CardContent>

            {/* Footer with buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-2 border-t border-border p-2 sm:p-3">
              <div className="flex gap-1 justify-center sm:justify-start">
                <Skeleton className="h-6 sm:h-8 w-6 sm:w-8 rounded-full" />
                <Skeleton className="h-6 sm:h-8 w-6 sm:w-8 rounded-full" />
              </div>
              <div className="flex gap-1 justify-center sm:justify-end">
                <Skeleton className="h-6 sm:h-7 w-10 sm:w-12 rounded-full" />
                <Skeleton className="h-6 sm:h-7 w-12 sm:w-16 rounded-full" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Education page skeleton
export function EducationSkeleton() {
  return (
    <div className="space-y-3 sm:space-y-4 mt-16 md:mt-0 pt-4 sm:pt-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
        <Skeleton className="h-5 sm:h-6 w-20 sm:w-24" />
        <Skeleton className="h-6 sm:h-7 w-28 sm:w-32 rounded-full" />
      </div>

      {/* Education List */}
      <div className="space-y-2 sm:space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-0">
                <div className="flex-1 w-full">
                  <Skeleton className="h-3.5 sm:h-4 w-40 sm:w-48 mb-1 sm:mb-2" />
                  <Skeleton className="h-2.5 sm:h-3 w-28 sm:w-32" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-3 sm:px-6">
              <Skeleton className="h-2.5 sm:h-3 w-32 sm:w-40 mb-1" />
              <Skeleton className="h-2.5 sm:h-3 w-24 sm:w-32 mb-1 sm:mb-2" />
              <Skeleton className="h-2.5 sm:h-3 w-full mb-1" />
              <Skeleton className="h-2.5 sm:h-3 w-3/4" />
            </CardContent>

            {/* Footer with buttons */}
            <div className="flex justify-center sm:justify-end border-t border-border p-2 sm:p-3">
              <div className="flex gap-1">
                <Skeleton className="h-6 sm:h-7 w-10 sm:w-12 rounded-full" />
                <Skeleton className="h-6 sm:h-7 w-12 sm:w-16 rounded-full" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Experience page skeleton
export function ExperienceSkeleton() {
  return (
    <div className="space-y-3 sm:space-y-4 mt-16 md:mt-0 pt-4 sm:pt-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
        <Skeleton className="h-5 sm:h-6 w-28 sm:w-32" />
        <Skeleton className="h-6 sm:h-7 w-32 sm:w-36 rounded-full" />
      </div>

      {/* Experience List */}
      <div className="space-y-2 sm:space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-0">
                <div className="flex-1 w-full">
                  <Skeleton className="h-3.5 sm:h-4 w-36 sm:w-44 mb-1 sm:mb-2" />
                  <Skeleton className="h-2.5 sm:h-3 w-24 sm:w-28" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-3 sm:px-6">
              <Skeleton className="h-2.5 sm:h-3 w-28 sm:w-36 mb-1" />
              <div className="flex items-center gap-1 mb-1 sm:mb-2">
                <Skeleton className="h-2.5 sm:h-3 w-2.5 sm:w-3" />
                <Skeleton className="h-2.5 sm:h-3 w-20 sm:w-24" />
              </div>
              <Skeleton className="h-2.5 sm:h-3 w-full mb-1" />
              <Skeleton className="h-2.5 sm:h-3 w-full mb-1" />
              <Skeleton className="h-2.5 sm:h-3 w-2/3" />
            </CardContent>

            {/* Footer with buttons */}
            <div className="flex justify-center sm:justify-end border-t border-border p-2 sm:p-3">
              <div className="flex gap-1">
                <Skeleton className="h-6 sm:h-7 w-10 sm:w-12 rounded-full" />
                <Skeleton className="h-6 sm:h-7 w-12 sm:w-16 rounded-full" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Profile Settings skeleton
export function ProfileSettingsSkeleton() {
  return (
    <div className="space-y-3 sm:space-y-4 mt-16 md:mt-0 pt-4 sm:pt-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 sm:h-6 w-28 sm:w-32" />
      </div>
      
      <Card>
        <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6">
          <Skeleton className="h-5 sm:h-6 w-32 sm:w-40" />
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Avatar and basic info section */}
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4 sm:gap-6">
              <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                <Skeleton className="w-20 sm:w-24 h-20 sm:h-24 rounded-full" />
                <Skeleton className="h-6 sm:h-7 w-24 sm:w-28 rounded-full" />
                <Skeleton className="h-6 sm:h-7 w-28 sm:w-32 rounded-full" />
              </div>

              <div className="flex-1 w-full space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Skeleton className="h-3.5 sm:h-4 w-16 sm:w-20" />
                    <Skeleton className="h-8 sm:h-9 w-full" />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Skeleton className="h-3.5 sm:h-4 w-24 sm:w-28" />
                    <Skeleton className="h-8 sm:h-9 w-full" />
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Skeleton className="h-3.5 sm:h-4 w-6 sm:w-8" />
                  <Skeleton className="h-16 sm:h-20 w-full" />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Skeleton className="h-3.5 sm:h-4 w-12 sm:w-16" />
                  <Skeleton className="h-8 sm:h-9 w-full" />
                </div>
              </div>
            </div>

            {/* Social links section */}
            <div className="space-y-3 sm:space-y-4">
              <Skeleton className="h-5 sm:h-6 w-32 sm:w-40" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="space-y-1.5 sm:space-y-2">
                    <Skeleton className="h-3.5 sm:h-4 w-20 sm:w-24" />
                    <Skeleton className="h-8 sm:h-9 w-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Save button */}
            <div className="flex justify-center sm:justify-end pt-2">
              <Skeleton className="h-7 sm:h-8 w-24 sm:w-28 rounded-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
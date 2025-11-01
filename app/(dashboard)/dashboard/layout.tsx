"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/supabase/auth'
import DashboardShell from './dashboard-shell'

export default function DashboardSectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [isClientReady, setIsClientReady] = useState(false)

  // Handle authentication client-side
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace('/auth')
        return
      }
      setIsClientReady(true)
    }
  }, [user, authLoading, router])

  // Show loading state while checking auth
  if (authLoading || !isClientReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // No initial data - everything is fetched client-side
  return (
    <DashboardShell initialData={null}>
      {children}
    </DashboardShell>
  )
}

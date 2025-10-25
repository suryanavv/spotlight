"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useAuth } from '@/components/providers/AuthProvider'
import { useEffect, useState } from "react"
import { AnimatePresence } from "framer-motion"
import { DashboardDataProvider } from "@/components/providers/DashboardDataProvider"
import { DashboardSidebar } from "./DashboardSidebar"
import { DashboardMobileHeader } from "./DashboardMobileHeader"
import { DashboardMobileMenu } from "./DashboardMobileMenu"
import { DashboardContent } from "./DashboardContent"

interface DashboardShellProps {
  children: React.ReactNode
}

export const DashboardShell = ({ children }: DashboardShellProps) => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Collapse sidebar on mobile by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground border-t-transparent"></div>
          <p className="mt-3 text-xs text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to sign-in
  }

  return (
    <DashboardDataProvider>
      <div className="flex h-screen bg-background">
        <DashboardMobileHeader
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <DashboardMobileMenu
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Desktop sidebar */}
        <AnimatePresence>
          {sidebarOpen && <DashboardSidebar />}
        </AnimatePresence>

        <DashboardContent sidebarOpen={sidebarOpen}>
          {children}
        </DashboardContent>
      </div>
    </DashboardDataProvider>
  )
}

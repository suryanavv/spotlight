"use client"

import { useRouter, usePathname } from "next/navigation"
import { useAuth } from '@/components/providers/AuthProvider'
import { useDashboardData } from '@/lib/hooks/useQueries'
import { useQueryClient } from '@tanstack/react-query'
import { IconUser, IconDashboard, IconBriefcase, IconSchool, IconBuildingStore, IconBook, IconTemplate, IconLogout, IconShare } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { generatePortfolioUrl } from "@/lib/utils/portfolio-url"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface DashboardMobileMenuProps {
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

export const DashboardMobileMenu = ({ mobileMenuOpen, setMobileMenuOpen }: DashboardMobileMenuProps) => {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()

  // Get dashboard data including profile for portfolio URL generation
  const { data } = useDashboardData()

  const handleLogout = async () => {
    try {
      // Show loading state
      toast.loading("Signing out...", { id: "logout" })

      const { error } = await signOut()
      if (error) {
        toast.error("Error signing out", { id: "logout" })
        console.error("Logout error:", error)
        return
      }

      // Clear all cached data to prevent stale data after logout
      queryClient.clear()

      toast.success("Signed out successfully", { id: "logout" })

      // Force a hard redirect to ensure clean state and prevent any cached navigation
      setTimeout(() => {
        window.location.href = "/"
      }, 500) // Small delay to allow toast to show

    } catch (error) {
      toast.error("Error signing out", { id: "logout" })
      console.error("Logout error:", error)
    }
  }

  const navItems = [
    { icon: <IconDashboard size={16} />, name: "Overview", path: "/dashboard" },
    { icon: <IconUser size={16} />, name: "Profile Settings", path: "/dashboard/profile-settings" },
    {
      icon: <IconBriefcase size={16} />,
      name: "Projects",
      path: "/dashboard/projects",
    },
    {
      icon: <IconSchool size={16} />,
      name: "Education",
      path: "/dashboard/education",
    },
    {
      icon: <IconBuildingStore size={16} />,
      name: "Experience",
      path: "/dashboard/experience",
    },
    {
      icon: <IconBook size={16} />,
      name: "Blog Posts",
      path: "/dashboard/blogs",
    },
    {
      icon: <IconTemplate size={16} />,
      name: "Templates",
      path: "/dashboard/templates",
    },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          {/* Overlay for closing menu on outside click */}
          <motion.div
            className="fixed inset-0 z-40 bg-foreground/30 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          />
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 36 }}
            className="fixed bottom-8 left-0 right-0 mx-auto z-50 w-[92vw] max-w-lg rounded-xl border border-border bg-card p-4 shadow-2xl md:hidden flex flex-col items-center pointer-events-auto"
          >
            <nav className="w-full flex-1 flex flex-col justify-center items-center gap-2 mt-1 mb-1">
              {navItems.map((item, index) => {
                const active = isActive(item.path)
                return (
                  <Button
                    key={item.path}
                    variant={active ? 'secondary' : 'ghost'}
                    size="sm"
                    className="w-full justify-center text-xs font-normal rounded-lg py-2 h-8 cursor-pointer"
                    onClick={() => {
                      router.push(item.path)
                      setMobileMenuOpen(false)
                    }}
                  >
                    <span className={cn('mr-2', active ? 'text-foreground' : 'text-muted-foreground')}>{item.icon}</span>
                    {item.name}
                  </Button>
                )
              })}
              <Button
                variant="link"
                size="sm"
                className="w-full justify-center text-xs font-normal rounded-lg py-2 h-8 text-muted-foreground hover:bg-accent hover:text-accent-foreground mt-1 cursor-pointer"
                onClick={() => router.push(generatePortfolioUrl(user!, data?.profile))}
              >
                <IconShare size={16} className="mr-2" />
                View Public Portfolio
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center text-xs font-normal rounded-lg py-2 h-8 text-muted-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
                onClick={handleLogout}
              >
                <IconLogout size={16} className="mr-2" />
                Log out
              </Button>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

"use client"

import { useRouter, usePathname } from "next/navigation"
import { useAuth } from '@/components/providers/AuthProvider'
import { useDashboardData } from '@/lib/hooks/useQueries'
import { useQueryClient } from '@tanstack/react-query'
import { IconUser, IconDashboard, IconBriefcase, IconSchool, IconBuildingStore, IconBook, IconTemplate, IconLogout, IconShare } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { generatePortfolioUrl } from "@/lib/utils/portfolio-url"
import { motion } from "framer-motion"
import { toast } from "sonner"

export const DashboardSidebar = () => {
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
    <motion.div
      initial={{ x: -320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -320, opacity: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 36 }}
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-56 transform border-r border-border bg-card rounded-xl hidden md:block",
      )}
    >
      {/* Desktop Sidebar Header with Website Name */}
      <div className="flex h-14 items-center justify-center border-b border-border px-4 select-none">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 group text-left focus:outline-none"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <span>✦</span>
          <span className="text-md font-semibold tracking-tight text-black group-hover:text-primary transition-colors">Spotlight</span>
        </button>
      </div>
      <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="p-2">
        <ul className="space-y-1">
          {navItems.map((item, index) => {
            const active = isActive(item.path)
            return (
              <motion.li
                key={item.path}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 w-full justify-start rounded-md text-xs font-normal transition-all duration-200 cursor-pointer",
                    active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                  onClick={() => {
                    router.push(item.path)
                  }}
                >
                  <span className={cn("mr-2", active ? "text-accent-foreground" : "text-muted-foreground")}>{item.icon}</span>
                  {item.name}
                  {active && (
                    <motion.div
                      className="absolute bottom-0 left-0 top-0 w-0.5 bg-primary"
                      layoutId="sidebar-indicator"
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 36,
                      }}
                    />
                  )}
                </Button>
              </motion.li>
            )
          })}
        </ul>
      </motion.nav>
      <div className="absolute bottom-0 left-0 right-0 p-2">
        <Button
          variant="link"
          size="sm"
          className="w-full flex items-center gap-2 justify-start rounded-md text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200 mb-1 cursor-pointer"
            onClick={() => router.push(generatePortfolioUrl(user!, data?.profile))}
        >
          <IconShare size={14} />
          View Public Portfolio
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full flex items-center gap-2 justify-start rounded-md text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200 cursor-pointer"
          onClick={handleLogout}
        >
          <IconLogout size={14} />
          Log out
        </Button>
      </div>
    </motion.div>
  )
}

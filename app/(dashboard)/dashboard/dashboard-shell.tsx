"use client"

import type React from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from '@/supabase/auth'
import { useEffect, useState, createContext, useContext, useMemo, memo, useCallback } from "react"
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from "framer-motion"
import { IconUser, IconDashboard, IconBriefcase, IconSchool, IconBuildingStore, IconBook, IconTemplate, IconLogout, IconShare, IconMenu, IconX } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { generatePortfolioUrl } from "@/lib/utils/portfolio-url"
import { toast } from "sonner"
import type { User } from '@supabase/supabase-js'
import type { Project, Education, Experience, Profile, Blog } from '@/supabase/types'

interface DashboardData {
  projects: Project[]
  education: Education[]
  experience: Experience[]
  blogs: Blog[]
  profile?: Profile | null
}

const DashboardDataContext = createContext<DashboardData | null>(null)

export const useDashboardData = (): DashboardData | null => {
  const context = useContext(DashboardDataContext)
  // Return null when data is not yet available (during loading)
  return context
}

const DashboardSidebar = memo(function DashboardSidebar({ initialData }: { initialData: DashboardData | null }) {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Prefetch components on hover for better performance
  const prefetchComponent = useCallback((path: string) => {
    switch (path) {
      case '/dashboard':
        dynamic(() => import('@/components/dashboard/overview-client'), { ssr: false })
        break
      case '/dashboard/profile-settings':
        dynamic(() => import('@/components/dashboard/profile-settings-client'), { ssr: false })
        break
      case '/dashboard/projects':
        dynamic(() => import('@/components/dashboard/projects-client'), { ssr: false })
        break
      case '/dashboard/education':
        dynamic(() => import('@/components/dashboard/education-client'), { ssr: false })
        break
      case '/dashboard/experience':
        dynamic(() => import('@/components/dashboard/experience-client'), { ssr: false })
        break
      case '/dashboard/blogs':
        dynamic(() => import('@/components/dashboard/blogs-client'), { ssr: false })
        break
    }
  }, [])

  const handleLogout = async () => {
    try {
      toast.loading("Signing out...", { id: "logout" })

      const { error } = await signOut()
      if (error) {
        toast.error("Error signing out", { id: "logout" })
        console.error("Logout error:", error)
        return
      }

      toast.success("Signed out successfully", { id: "logout" })

      setTimeout(() => {
        window.location.href = "/"
      }, 500)

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
                <Link
                  href={item.path}
                  prefetch={true}
                  className={cn(
                    "flex h-8 w-full items-center justify-start rounded-md px-3 text-xs font-normal transition-all duration-200 cursor-pointer relative",
                    active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                  onMouseEnter={() => prefetchComponent(item.path)}
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
                </Link>
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
          onClick={() => router.push(generatePortfolioUrl(user!, initialData?.profile))}
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
})

const DashboardMobileHeader = ({ mobileMenuOpen, setMobileMenuOpen }: { mobileMenuOpen: boolean; setMobileMenuOpen: (open: boolean) => void }) => {
  const router = useRouter()

  return (
    <header className="fixed top-5 left-0 right-0 z-50 flex flex-col items-center pointer-events-none md:hidden">
      <div className="flex items-center justify-between h-12 px-4 w-[92vw] max-w-lg bg-card/70 backdrop-blur-sm border border-border rounded-xl shadow-lg pointer-events-auto">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 min-w-0 group text-left focus:outline-none"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <span>✦</span>
          <span className="text-md font-semibold tracking-tight text-foreground group-hover:text-primary select-none">Spotlight</span>
        </button>
        <button
          className="p-2 focus:outline-none active:bg-accent"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle dashboard menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            {mobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <IconX size={20} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <IconMenu size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </header>
  )
}

const DashboardMobileMenu = memo(function DashboardMobileMenu({ mobileMenuOpen, setMobileMenuOpen, initialData }: { mobileMenuOpen: boolean; setMobileMenuOpen: (open: boolean) => void; initialData: DashboardData | null }) {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Prefetch components on hover for better performance
  const prefetchComponent = useCallback((path: string) => {
    switch (path) {
      case '/dashboard':
        dynamic(() => import('@/components/dashboard/overview-client'), { ssr: false })
        break
      case '/dashboard/profile-settings':
        dynamic(() => import('@/components/dashboard/profile-settings-client'), { ssr: false })
        break
      case '/dashboard/projects':
        dynamic(() => import('@/components/dashboard/projects-client'), { ssr: false })
        break
      case '/dashboard/education':
        dynamic(() => import('@/components/dashboard/education-client'), { ssr: false })
        break
      case '/dashboard/experience':
        dynamic(() => import('@/components/dashboard/experience-client'), { ssr: false })
        break
      case '/dashboard/blogs':
        dynamic(() => import('@/components/dashboard/blogs-client'), { ssr: false })
        break
    }
  }, [])

  const handleLogout = async () => {
    try {
      toast.loading("Signing out...", { id: "logout" })

      const { error } = await signOut()
      if (error) {
        toast.error("Error signing out", { id: "logout" })
        console.error("Logout error:", error)
        return
      }

      toast.success("Signed out successfully", { id: "logout" })

      setTimeout(() => {
        window.location.href = "/"
      }, 500)

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
                  <Link
                    key={item.path}
                    href={item.path}
                    prefetch={true}
                    className={cn(
                      "flex w-full items-center justify-center rounded-lg py-2 h-8 text-xs font-normal cursor-pointer transition-colors",
                      active ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                    onClick={() => {
                      setMobileMenuOpen(false)
                    }}
                    onMouseEnter={() => prefetchComponent(item.path)}
                  >
                    <span className={cn('mr-2', active ? 'text-foreground' : 'text-muted-foreground')}>{item.icon}</span>
                    {item.name}
                  </Link>
                )
              })}
              <Button
                variant="link"
                size="sm"
                className="w-full justify-center text-xs font-normal rounded-lg py-2 h-8 text-muted-foreground hover:bg-accent hover:text-accent-foreground mt-1 cursor-pointer"
                onClick={() => router.push(generatePortfolioUrl(user!, initialData?.profile))}
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
})

const DashboardContent = memo(function DashboardContent({ children, sidebarOpen }: { children: React.ReactNode; sidebarOpen: boolean }) {
  const pathname = usePathname()

  return (
    <div className={`flex-1 overflow-auto transition-all duration-300 bg-background ${sidebarOpen ? "md:ml-56" : ""}`}>
      <motion.div
        className="mx-auto max-w-5xl p-4 sm:p-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  )
})

const DashboardShellComponent = function DashboardShell({
  children,
  initialData
}: {
  children: React.ReactNode
  initialData: DashboardData | null
}) {
  // Preload all dashboard data client-side immediately for instant UX
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(initialData)
  const [dataLoading, setDataLoading] = useState(!initialData)

  // Preload all data on mount for instant navigation
  useEffect(() => {
    const preloadData = async () => {
      if (!dashboardData) {
        const startTime = Date.now()

        try {
          // Import and call the data fetching function
          const { getDashboardData } = await import('@/supabase/client-actions')
          const result = await getDashboardData()

          if ('error' in result) {
            console.error('[DashboardShell] Error preloading dashboard data:', result.error)
          } else {
            setDashboardData(result)
            const loadTime = Date.now() - startTime
          }
        } catch (error) {
          console.error('[DashboardShell] Error preloading dashboard data:', error)
        } finally {
          setDataLoading(false)
        }
      }
    }

    preloadData()
  }, [])


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

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => dashboardData, [dashboardData])

  return (
    <DashboardDataContext.Provider value={contextValue}>
      <div className="flex h-screen bg-background">
        <DashboardMobileHeader
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <DashboardMobileMenu
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          initialData={dashboardData}
        />

        {/* Desktop sidebar */}
        <AnimatePresence>
          {sidebarOpen && <DashboardSidebar initialData={dashboardData} />}
        </AnimatePresence>

        <DashboardContent sidebarOpen={sidebarOpen}>
          {children}
        </DashboardContent>
      </div>
    </DashboardDataContext.Provider>
  )
}

export default memo(DashboardShellComponent)
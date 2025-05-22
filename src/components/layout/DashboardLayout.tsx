"use client"

import type React from "react"

import { useNavigate, useLocation } from "react-router-dom"
import { useUser, useClerk } from '@clerk/clerk-react'
import { useEffect, useState } from "react"
import { User, FileText, Briefcase, GraduationCap, Palette, AlignJustify, LogOut, ChevronDown, Menu, X } from "lucide-react"
import Logo from '/placeholder.svg'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const navigate = useNavigate()
  const location = useLocation()
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
    if (isLoaded && !user) {
      navigate('/sign-in') // Clerk's default sign-in route
    }
  }, [user, isLoaded, navigate])

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success("Signed out successfully")
      navigate("/sign-in")
    } catch (error) {
      toast.error("Error signing out")
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
          <p className="mt-3 text-xs text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const navItems = [
    { icon: <FileText size={16} />, name: "Overview", path: "/dashboard" },
    { icon: <User size={16} />, name: "Profile", path: "/dashboard/profile" },
    {
      icon: <Briefcase size={16} />,
      name: "Projects",
      path: "/dashboard/projects",
    },
    {
      icon: <GraduationCap size={16} />,
      name: "Education",
      path: "/dashboard/education",
    },
    {
      icon: <Briefcase size={16} />,
      name: "Experience",
      path: "/dashboard/experience",
    },
    {
      icon: <Palette size={16} />,
      name: "Templates",
      path: "/dashboard/templates",
    },
  ]

  const isActive = (path: string) => location.pathname === path

  // Helper to get current section name for header
  const getSectionName = () => {
    const path = location.pathname
    if (path === "/dashboard") return "Overview"
    if (path === "/dashboard/profile") return "Profile Settings"
    if (path === "/dashboard/projects") return "Projects"
    if (path === "/dashboard/education") return "Education"
    if (path === "/dashboard/experience") return "Experience"
    if (path === "/dashboard/templates") return "Templates"
    return "Dashboard"
  }

  const getBreadcrumb = () => `Dashboard > ${getSectionName()}`

  return (
    <div className="flex h-screen bg-white">
      {/* Mobile header with logo and app name */}
      <header className="fixed top-5 left-0 right-0 z-50 flex flex-col items-center pointer-events-none md:hidden">
        <div className="flex items-center justify-between h-12 px-4 w-[92vw] max-w-lg bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg pointer-events-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 min-w-0 group text-left focus:outline-none"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <span>✦</span>
            <span className="text-md font-semibold tracking-tight text-gray-900 group-hover:text-primary select-none">Spotlight</span>
          </button>
          <button
            className="p-2 focus:outline-none active:bg-gray-100"
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
                  <X size={20} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Menu size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* Mobile bottom popout menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay for closing menu on outside click */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/30 md:hidden"
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
              className="fixed bottom-8 left-0 right-0 mx-auto z-50 w-[92vw] max-w-lg rounded-xl border border-gray-200 bg-white p-4 shadow-2xl md:hidden flex flex-col items-center pointer-events-auto"
            >
              {/* <Button
                variant="ghost"
                size="icon"
                className="absolute right-3 top-3 h-7 w-7 rounded-full"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <ChevronDown size={18} />
              </Button> */}
              <nav className="w-full flex-1 flex flex-col justify-center items-center gap-2 mt-1 mb-1">
                {navItems.map((item, index) => {
                  const active = isActive(item.path)
                  return (
                    <Button
                      key={item.path}
                      variant={active ? 'secondary' : 'ghost'}
                      size="sm"
                      className="w-full justify-center text-xs font-normal rounded-lg py-2 h-8"
                      onClick={() => {
                        navigate(item.path)
                        setMobileMenuOpen(false)
                      }}
                    >
                      <span className={cn('mr-2', active ? 'text-black' : 'text-gray-400')}>{item.icon}</span>
                      {item.name}
                    </Button>
                  )
                })}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center text-xs font-normal rounded-lg py-2 h-8 text-gray-600 hover:bg-gray-100 hover:text-gray-900 mt-1"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </Button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 36 }}
            className={cn(
              "fixed inset-y-0 left-0 z-40 w-56 transform border-r border-gray-200 bg-white rounded-xl hidden md:block",
            )}
          >
            {/* Desktop Sidebar Header with Website Name */}
            <div className="flex h-14 items-center justify-center border-b border-gray-200 px-4 select-none">
              <button
                onClick={() => navigate('/')}
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
                          "h-8 w-full justify-start rounded-md text-xs font-normal transition-all duration-200",
                          active ? "bg-gray-100 text-black" : "text-gray-600 hover:bg-gray-100",
                        )}
                        onClick={() => {
                          navigate(item.path)
                        }}
                      >
                        <span className={cn("mr-2", active ? "text-black" : "text-gray-400")}>{item.icon}</span>
                        {item.name}
                        {active && (
                          <motion.div
                            className="absolute bottom-0 left-0 top-0 w-0.5 bg-black"
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
                variant="outline"
                size="sm"
                className="w-full flex items-center gap-2 justify-start rounded-md text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                onClick={handleLogout}
              >
                <LogOut size={14} />
                Logout
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className={cn("flex-1 overflow-auto transition-all duration-300 bg-white", sidebarOpen ? "md:ml-56" : "")}>
        <motion.div
          className="mx-auto max-w-5xl p-4 sm:p-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

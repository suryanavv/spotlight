"use client"

import { motion } from "framer-motion"
import { usePathname } from "next/navigation"

interface DashboardContentProps {
  children: React.ReactNode
  sidebarOpen: boolean
}

export const DashboardContent = ({ children, sidebarOpen }: DashboardContentProps) => {
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
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  )
}

"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { IconMenu, IconX } from "@tabler/icons-react"
import { motion, AnimatePresence } from "framer-motion"

interface DashboardMobileHeaderProps {
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

export const DashboardMobileHeader = ({ mobileMenuOpen, setMobileMenuOpen }: DashboardMobileHeaderProps) => {
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

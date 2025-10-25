"use client"

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { useAuth } from '@/components/providers/AuthProvider'
import { motion } from "framer-motion"

export const HeroSection = () => {
  const { user } = useAuth()
  const router = useRouter()

  const navigateToAuth = (mode: 'signin' | 'signup') => {
    router.push(`/auth?mode=${mode}`)
  }

  return (
    <section className="relative overflow-hidden py-24 md:py-36">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(var(--ring-rgb),0.08),transparent)]"></div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_left,rgba(var(--ring-rgb),0.05),transparent)]"></div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:20px_20px]"></div>
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80">
          <div className="relative h-full w-full">
            <div className="absolute inset-0 bg-primary opacity-10 blur-3xl"></div>
          </div>
        </div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80">
          <div className="relative h-full w-full">
            <div className="absolute inset-0 bg-primary opacity-10 blur-3xl"></div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="mb-6 text-4xl font-medium tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Your professional portfolio,{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              reimagined
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-base text-muted-foreground md:text-lg leading-relaxed">
            Create a stunning portfolio to highlight your skills, projects, and experience with beautiful
            customizable templates. Join thousands of professionals advancing their careers.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              onClick={() => user ? router.push('/dashboard') : navigateToAuth('signup')}
              variant="default"
              className="mx-4 text-sm rounded-full cursor-pointer"
            >
              {user ? "Shine On in Dashboard" : "Spark Your Spotlight! "}
              <span className="ml-2">✦</span>
            </Button>
          </div>
        </motion.div>
        {/* Preview Image */}
        <motion.div
          className="mx-auto mt-20 max-w-5xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-subtle-lg relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/5 opacity-40"></div>
            <img
              src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80"
              alt="Portfolio dashboard preview"
              className="w-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

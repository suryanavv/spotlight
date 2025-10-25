"use client"

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { useAuth } from '@/components/providers/AuthProvider'
import { motion } from "framer-motion"

export const CtaSection = () => {
  const { user } = useAuth()
  const router = useRouter()

  const navigateToAuth = (mode: 'signin' | 'signup') => {
    router.push(`/auth?mode=${mode}`)
  }

  return (
    <section className="py-6 md:py-10 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(var(--ring-rgb),0.03),transparent)]"></div>
      <div className="container mx-auto px-4">
        <motion.div
          className="mx-auto max-w-3xl rounded-xl bg-card/80 p-12 text-center shadow-subtle relative overflow-hidden backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-subtle opacity-5"></div>
          <h2 className="mb-4 text-3xl font-medium tracking-tight">
            Ready to showcase your work?
          </h2>
          <p className="mb-10 text-base text-muted-foreground max-w-lg mx-auto">
            Join thousands of professionals who use Spotlight to share their portfolios and advance their careers.
          </p>
          <Button
            onClick={() => user ? router.push('/dashboard') : navigateToAuth('signup')}
            variant="default"
            className="mx-4 text-sm rounded-full cursor-pointer"
          >
            {user ? "Shine On in Dashboard" : "Spark Your Spotlight! "}
            <span className="ml-2">✦</span>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

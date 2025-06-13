"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { useUser, useClerk, SignIn, SignUp, UserProfile, UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import { motion } from "framer-motion"
import { ArrowRight, Check, Share2, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { useState, useEffect } from "react"

const Index = () => {
  const { user } = useUser()
  const router = useRouter()
  const { signOut } = useClerk()
  const [authMode, setAuthMode] = useState<null | 'sign-in' | 'sign-up'>(null)
  const [showProfile, setShowProfile] = useState(false)

  // Disable background scroll and dim background when popout is open
  useEffect(() => {
    const popoutOpen = !!authMode || showProfile;
    if (popoutOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [authMode, showProfile]);

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success("Signed out successfully")
      setAuthMode('sign-in')
    } catch (error) {
      toast.error("Error signing out")
    }
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const features = [
    {
      title: "Beautiful Templates",
      description: "Choose from professionally designed templates to make your portfolio stand out.",
    },
    {
      title: "Project Showcase",
      description: "Highlight your best work with detailed project descriptions, images, and links.",
    },
    {
      title: "Easy Sharing",
      description: "Share your portfolio with a single link and make a lasting impression.",
    },
  ]

  // Custom popout for Clerk UI (click outside to close, dim background)
  const renderAuthPopout = () => (
    <>
      {/* Dimmed overlay for outside click */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          background: 'rgba(0,0,0,0.35)',
        }}
        onClick={() => setAuthMode(null)}
        aria-label="Close authentication popout"
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 51,
          minHeight: 100,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        role="dialog"
        aria-modal="true"
        onClick={e => e.stopPropagation()}
      >
        {authMode === 'sign-in' ? (
          <SignIn
            appearance={{
              variables: {
                colorBackground: '#fff',
                colorText: '#000',
              },
            }}
            afterSignInUrl="/dashboard"
            signUpUrl="/"
          />
        ) : (
          <SignUp
            appearance={{
              variables: {
                colorBackground: '#fff',
                colorText: '#000',
              },
            }}
            forceRedirectUrl="/dashboard"
            signInUrl="/"
          />
        )}
      </div>
    </>
  )

  const renderProfilePopout = () => (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          background: 'rgba(0,0,0,0.35)',
        }}
        onClick={() => setShowProfile(false)}
        aria-label="Close profile popout"
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 51,
          minHeight: 100,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        role="dialog"
        aria-modal="true"
        onClick={e => e.stopPropagation()}
      >
        <UserProfile />
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen flex-col bg-white">      {/* Announcement Banner */}
      <div className="bg-primary py-2 text-center text-xs text-primary-foreground">
        <span className="inline-flex items-center">
          <span className="mr-2 rounded-full bg-background px-1.5 py-0.5 text-[10px] font-medium text-foreground">NEW</span>
          Introducing Spotlight
          <Button
            variant="link"
            size="sm"
            className="ml-2 h-auto p-0 text-xs font-normal text-primary-foreground underline"
            onClick={() => setAuthMode('sign-up')}
          >
            Check it out →
          </Button>
        </span>
      </div>

      {/* Inlined Header */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md"
      >
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center text-sm font-medium tracking-tight text-foreground transition-opacity hover:opacity-80"
            >
              <span className="mr-2 text-primary">✦</span> Spotlight
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/portfolio/${user.id}`)}
                  className="hidden h-8 items-center gap-1.5 rounded-full border-gray-200 px-3 text-xs hover:bg-gray-50 hover:text-black sm:flex"
                >
                  <Share2 size={12} />
                  <span>View Portfolio</span>
                </Button>

                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </>
            ) : (
              <>
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={() => setAuthMode('sign-in')}
                  className="hidden h-8 rounded-full px-3 text-xs font-normal md:inline-flex"
                >
                  Log in
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.header>

      <main className="flex-1">        {/* Hero Section */}
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
                  onClick={() => user ? router.push('/dashboard') : setAuthMode('sign-up')}
                  size="lg"
                  variant="gradient"
                  className="rounded-full px-6"
                >
                  {user ? "Go to Dashboard" : "Get Started for Free"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>            {/* Preview Image */}
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
        </section>        {/* Features Section */}
        <section className="py-1 md:py-2">
          <div className="container mx-auto px-4">
            <motion.div              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="mb-4 text-center"
            >
              <h2 className="mb-4 text-3xl font-medium tracking-tight">Why Choose Spotlight</h2>
              <p className="mx-auto max-w-2xl text-base text-muted-foreground leading-relaxed">
                Everything you need to create a professional portfolio that stands out from the crowd.
              </p>
            </motion.div>

            <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true }}
                  className="rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-hover-card relative overflow-hidden group"
                >
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="mb-2 text-base font-medium">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-6 md:py-10 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(var(--ring-rgb),0.03),transparent)]"></div>
          <div className="container mx-auto px-4">
            <motion.div
              className="mx-auto max-w-3xl rounded-xl bg-card/80 p-12 text-center shadow-subtle relative overflow-hidden backdrop-blur-sm"              initial={{ opacity: 0, y: 20 }}
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
                onClick={() => user ? router.push('/dashboard') : setAuthMode('sign-up')}
                variant="gradient"
                size="lg"
                className="rounded-full px-6"
              >
                {user ? "Go to Dashboard" : "Create Your Portfolio"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </section>
      </main>      {/* Footer */}
      <footer className="border-t border-border bg-background py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center text-base font-medium">
              <span className="mr-2 text-primary">✦</span> Spotlight
            </div>
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Spotlight. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
      {/* Clerk Auth Popout */}
      {authMode && renderAuthPopout()}
      {showProfile && renderProfilePopout()}
    </div>
  )
}

export default Index

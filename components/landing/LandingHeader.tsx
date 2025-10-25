"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { useAuth } from '@/components/providers/AuthProvider'
import { motion } from "framer-motion"
import { Share2, LayoutDashboard, User, LogOut } from 'lucide-react'
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
import { generatePortfolioUrl } from '@/lib/utils/portfolio-url'

export const LandingHeader = () => {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const navigateToAuth = (mode: 'signin' | 'signup') => {
    router.push(`/auth?mode=${mode}`)
  }

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      toast.error('Error signing out')
    } else {
      router.push('/')
    }
  }

  const getUserDisplayName = () => {
    if (!user) return ''
    return user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  }

  const getUserAvatar = () => {
    if (!user) return ''
    return user.user_metadata?.avatar_url || user.user_metadata?.picture || ''
  }

  return (
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
                onClick={() => router.push(generatePortfolioUrl(user))}
                className="hidden h-8 items-center gap-1.5 rounded-full border-border px-3 text-xs hover:bg-accent hover:text-accent-foreground cursor-pointer sm:flex"
              >
                <Share2 size={12} />
                <span>View Portfolio</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="hidden h-8 items-center gap-1.5 rounded-full px-3 text-xs cursor-pointer sm:flex"
              >
                 <LayoutDashboard size={12}/>
                <span>Dashboard</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full cursor-pointer">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={getUserAvatar()} alt={getUserDisplayName()} />
                      <AvatarFallback>
                        {getUserDisplayName().charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/dashboard/profile-settings')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateToAuth('signin')}
                className="h-8 rounded-full px-3 text-xs font-normal cursor-pointer"
              >
                Sign in
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => navigateToAuth('signup')}
                className="h-8 rounded-full px-3 text-xs font-normal cursor-pointer"
              >
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.header>
  )
}

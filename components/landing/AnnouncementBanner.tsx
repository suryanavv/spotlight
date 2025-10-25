"use client"

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { useAuth } from '@/components/providers/AuthProvider'

export const AnnouncementBanner = () => {
  const { user } = useAuth()
  const router = useRouter()

  const navigateToAuth = (mode: 'signin' | 'signup') => {
    router.push(`/auth?mode=${mode}`)
  }

  return (
    <div className="bg-primary py-2 text-center text-xs text-primary-foreground">
      <span className="inline-flex items-center">
        <span className="mr-2 rounded-full bg-background px-1.5 py-0.5 text-[10px] font-medium text-foreground">NEW</span>
        Introducing Spotlight
        <Button
          variant="link"
          size="sm"
          className="ml-2 h-auto p-0 text-xs font-normal text-primary-foreground underline cursor-pointer"
          onClick={() => user ? router.push('/dashboard') : navigateToAuth('signup')}
        >
          Check it out →
        </Button>
      </span>
    </div>
  )
}

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          toast.error('Authentication failed')
          router.push('/')
          return
        }

        if (data.session) {
          // Successfully authenticated
          router.push('/dashboard')
        } else {
          // No session found
          router.push('/')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        toast.error('Authentication failed')
        router.push('/')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-sm text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  )
} 
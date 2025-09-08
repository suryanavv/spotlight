'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('Processing authentication...')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setStatus('Verifying authentication...')

        // Check if we have OAuth callback parameters
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        // Handle OAuth errors
        if (error) {
          console.error('OAuth error:', error, errorDescription)
          toast.error(`Authentication failed: ${errorDescription || error}`)
          router.push('/')
          return
        }

        // If we have OAuth code, exchange it for session
        if (code && state) {
          setStatus('Exchanging authorization code...')

          const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

          if (sessionError) {
            console.error('Session exchange error:', sessionError)
            toast.error('Failed to complete authentication')
            router.push('/')
            return
          }

          if (data.session) {
            setStatus('Authentication successful!')
            toast.success('Successfully signed in!')
            router.push('/dashboard')
            return
          }
        }

        // Fallback: try to get current session
        setStatus('Checking current session...')
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error('Session error:', sessionError)
          toast.error('Authentication failed')
          router.push('/')
          return
        }

        if (sessionData.session) {
          setStatus('Authentication successful!')
          toast.success('Successfully signed in!')
          router.push('/dashboard')
        } else {
          // No session found, redirect to auth page
          toast.error('No active session found')
          router.push('/')
        }

      } catch (error) {
        console.error('Unexpected auth callback error:', error)
        toast.error('An unexpected error occurred during authentication')
        router.push('/')
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-6"></div>
        <h2 className="text-xl font-semibold mb-2">Authenticating...</h2>
        <p className="text-sm text-muted-foreground mb-4">{status}</p>
        <div className="text-xs text-muted-foreground">
          Please wait while we complete your sign-in process.
        </div>
      </div>
    </div>
  )
}

function AuthCallbackFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-6"></div>
        <h2 className="text-xl font-semibold mb-2">Loading...</h2>
        <p className="text-sm text-muted-foreground">
          Preparing authentication...
        </p>
      </div>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<AuthCallbackFallback />}>
      <AuthCallbackContent />
    </Suspense>
  )
} 
"use client"

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/supabase/client'
import { toast } from 'sonner'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for OAuth errors in URL params
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        if (error) {
          console.error('OAuth error:', error, errorDescription)
          setError(`Authentication failed: ${error}${errorDescription ? ` - ${errorDescription}` : ''}`)
          setLoading(false)
          return
        }

        // Check for authorization code
        const code = searchParams.get('code')

        if (code) {
          // Exchange the code for a session
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

          if (exchangeError) {
            console.error('Session exchange error:', exchangeError)
            setError('Failed to complete authentication. Please try again.')
            setLoading(false)
            return
          }

          // Success - show success message and redirect
          toast.success('Successfully signed in!')
          router.replace('/dashboard')
        } else {
          // No code, check if we have an existing session
          const { data: { session } } = await supabase.auth.getSession()

          if (session) {
            router.replace('/dashboard')
          } else {
            router.replace('/auth')
          }
        }
      } catch (err) {
        console.error('Unexpected error during auth callback:', err)
        setError('An unexpected error occurred. Please try again.')
        setLoading(false)
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Completing authentication...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️ {error}</div>
          <button
            onClick={() => router.replace('/auth')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    )
  }

  return null
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}

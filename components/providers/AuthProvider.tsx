'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string, options?: { data?: { full_name?: string } }) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  signInWithGitHub: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>
  updateEmail: (email: string) => Promise<{ error: AuthError | null }>
  refreshSession: () => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const lastSignInToastRef = useRef<number>(0)
  const mountedRef = useRef(true)

  useEffect(() => {
    let mounted = true

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
          if (mounted) {
            toast.error('Failed to load authentication session')
          }
        } else if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error('Unexpected error getting session:', error)
        if (mounted) {
          toast.error('An unexpected error occurred while loading your session')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        switch (event) {
          case 'SIGNED_IN': {
            // Prevent duplicate sign-in toasts (throttle to once per 2 seconds)
            const now = Date.now()
            if (now - lastSignInToastRef.current > 2000) {
              toast.success('Successfully signed in!')
              lastSignInToastRef.current = now
            }
            break
          }
          case 'SIGNED_OUT':
            toast.success('Successfully signed out!')
            break
          case 'TOKEN_REFRESHED':
            console.log('Session token refreshed')
            break
          case 'USER_UPDATED':
            toast.success('Profile updated successfully!')
            break
          case 'PASSWORD_RECOVERY':
            toast.info('Password recovery email sent!')
            break
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, options?: { data?: { full_name?: string } }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: options?.data || {},
      },
    })
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      return { error }
    } catch (error) {
      console.error('Google sign-in error:', error)
      return { error: error as AuthError }
    }
  }

  const signInWithGitHub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'read:user user:email',
        },
      })
      return { error }
    } catch (error) {
      console.error('GitHub sign-in error:', error)
      return { error: error as AuthError }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (!error) {
        toast.success('Password reset email sent!')
      }
      return { error }
    } catch (error) {
      console.error('Password reset error:', error)
      return { error: error as AuthError }
    }
  }

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })
      if (!error) {
        toast.success('Password updated successfully!')
      }
      return { error }
    } catch (error) {
      console.error('Password update error:', error)
      return { error: error as AuthError }
    }
  }

  const updateEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        email: email,
      })
      if (!error) {
        toast.success('Email update confirmation sent!')
      }
      return { error }
    } catch (error) {
      console.error('Email update error:', error)
      return { error: error as AuthError }
    }
  }

  const refreshSession = async () => {
    try {
      const { error } = await supabase.auth.refreshSession()
      return { error }
    } catch (error) {
      console.error('Session refresh error:', error)
      return { error: error as AuthError }
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithGitHub,
    resetPassword,
    updatePassword,
    updateEmail,
    refreshSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Additional hooks for compatibility with existing code
export function useUser() {
  const { user, loading } = useAuth()
  return { user, isLoaded: !loading }
}

export function useSession() {
  const { session, loading } = useAuth()
  return { session, isLoaded: !loading }
} 
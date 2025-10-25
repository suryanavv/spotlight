"use client"

import * as React from "react"
import { useState, Suspense } from "react"
import { useAuth } from '@/components/providers/AuthProvider'
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthHeader } from "@/components/auth/AuthHeader"
import { OAuthButtons } from "@/components/auth/OAuthButtons"
import { AuthForm } from "@/components/auth/AuthForm"
import { AuthFooter } from "@/components/auth/AuthFooter"

type AuthMode = 'signin' | 'signup'

function AuthPageContent() {
  const [mode, setMode] = useState<AuthMode>('signin')
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { signIn, signUp, signInWithGoogle } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check URL params for mode
  React.useEffect(() => {
    const urlMode = searchParams.get('mode')
    if (urlMode === 'signup') {
      setMode('signup')
    }
  }, [searchParams])

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setFullName("")
    setError("")
  }

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode)
    resetForm()
    router.replace(`/auth?mode=${newMode}`, { scroll: false })
  }

  const handleEmailAuth = async () => {
    if (!email || !password || (mode === 'signup' && !fullName)) {
      setError("Please fill in all fields.")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.")
      return
    }

    if (mode === 'signup' && password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setError("")
    setLoading(true)

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password)
        if (error) {
          setError(error.message)
        } else {
          toast.success('Welcome back!')
          router.push('/dashboard')
        }
      } else {
        const { error } = await signUp(email, password, {
          data: { full_name: fullName }
        })
        if (error) {
          setError(error.message)
        } else {
          toast.success('Account created! Please check your email to verify your account.')
          switchMode('signin')
        }
      }
    } catch (err) {
      setError(`${mode === 'signin' ? 'Sign in' : 'Sign up'} failed. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setError("")
    setLoading(true)

    try {
      const { error } = await signInWithGoogle()
      if (error) {
        setError(error.message)
      } else {
        // OAuth will redirect automatically
      }
    } catch (err) {
      setError("Google authentication failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-8 px-4 sm:px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <AuthHeader mode={mode} />

        <div className="mt-6 space-y-4">
          <OAuthButtons onGoogleAuth={handleGoogleAuth} loading={loading} />

          <AuthForm
            mode={mode}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            fullName={fullName}
            setFullName={setFullName}
            loading={loading}
            error={error}
            onSubmit={handleEmailAuth}
          />

          <AuthFooter
            mode={mode}
            loading={loading}
            onModeSwitch={switchMode}
          />
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthPageContent />
    </Suspense>
  )
}

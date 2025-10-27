"use client"

import * as React from "react"
import { useState, Suspense } from "react"
import { useAuth } from '@/components/providers/AuthProvider'
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

type AuthMode = 'signin' | 'signup'

const AuthHeader = ({ mode }: { mode: AuthMode }) => {
  return (
    <>
      {/* Back to Home Link */}
      <div className="flex justify-start mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <IconArrowLeft className="mr-1.5 h-3 w-3" />
          Back to home
        </Link>
      </div>

      {/* Header */}
      <div className="text-center space-y-1.5">
        <div className="flex justify-center mb-3">
          <span className="text-primary text-lg">✦</span>
        </div>
        <h1 className="text-xl font-semibold text-foreground">
          {mode === 'signin' ? 'Sign in to Spotlight' : 'Create your account'}
        </h1>
        <p className="text-xs text-muted-foreground">
          {mode === 'signin'
            ? 'Welcome back! Please sign in to continue'
            : 'Get started with Spotlight and build your portfolio'
          }
        </p>
      </div>
    </>
  )
}

const OAuthButtons = ({ onGoogleAuth, loading }: { onGoogleAuth: () => void; loading: boolean }) => {
  return (
    <>
      {/* Google Button */}
      <Button
        variant="outline"
        onClick={onGoogleAuth}
        disabled={loading}
        className="w-full rounded-full h-9 text-xs font-medium border-border hover:bg-accent hover:text-accent-foreground cursor-pointer"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-4 h-4 mr-2"
        />
        Continue with Google
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-3 text-muted-foreground">or</span>
        </div>
      </div>
    </>
  )
}

const AuthForm = ({
  mode,
  email,
  setEmail,
  password,
  setPassword,
  fullName,
  setFullName,
  loading,
  error,
  onSubmit
}: {
  mode: AuthMode
  email: string
  setEmail: (email: string) => void
  password: string
  setPassword: (password: string) => void
  fullName: string
  setFullName: (fullName: string) => void
  loading: boolean
  error: string
  onSubmit: () => void
}) => {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
      {mode === 'signup' && (
        <div className="space-y-1.5">
          <Label htmlFor="fullName" className="text-xs font-medium text-foreground">
            Full Name
          </Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
            className="h-9 text-xs"
            required
          />
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-xs font-medium text-foreground">
          Email address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="h-9 text-xs"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-xs font-medium text-foreground">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder={mode === 'signup' ? "Create a password (min. 6 characters)" : "Enter your password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          className="h-9 text-xs"
          required
        />
      </div>

      {error && (
        <div className="text-xs text-destructive">{error}</div>
      )}

      {mode === 'signin' && (
        <div className="flex justify-end">
          <Button
            variant="link"
            onClick={() => toast.info('Password reset feature coming soon!')}
            className="px-0 text-xs text-muted-foreground hover:text-foreground h-auto cursor-pointer"
            type="button"
          >
            Forgot password?
          </Button>
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full rounded-full h-9 font-medium text-xs cursor-pointer"
      >
        {loading ? (
          mode === 'signin' ? "Signing in..." : "Creating account..."
        ) : (
          <>
            Continue
          </>
        )}
      </Button>
    </form>
  )
}

const AuthFooter = ({ mode, loading, onModeSwitch }: { mode: AuthMode; loading: boolean; onModeSwitch: (newMode: AuthMode) => void }) => {
  return (
    <div className="text-center">
      <span className="text-xs text-muted-foreground">
        {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}{' '}
      </span>
      <Button
        variant="link"
        onClick={() => onModeSwitch(mode === 'signin' ? 'signup' : 'signin')}
        disabled={loading}
        className="px-0 text-xs font-medium hover:underline h-auto cursor-pointer"
      >
        {mode === 'signin' ? 'Sign up' : 'Sign in'}
      </Button>
    </div>
  )
}

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

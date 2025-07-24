"use client"

import * as React from "react"
import { useState } from "react"
import { useAuth } from '@/components/providers/AuthProvider'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: 'signin' | 'signup'
}

type AuthMode = 'signin' | 'signup'

export const AuthModal = ({ isOpen, onClose, defaultMode = 'signin' }: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>(defaultMode)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const router = useRouter()

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
          onClose()
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
          onClose()
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
        onClose()
        // OAuth will redirect automatically
      }
    } catch (err) {
      setError("Google authentication failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'signin' ? 'Sign in to Spotlight' : 'Create your account'}
            </h2>
            <p className="text-sm text-gray-600">
              {mode === 'signin' 
                ? 'Welcome back! Please sign in to continue' 
                : 'Get started with Spotlight and build your portfolio'
              }
            </p>
          </div>

          {/* Google Button */}
          <Button
            variant="outline"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full rounded-full h-12 text-sm font-medium border-gray-200 hover:bg-gray-50"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5 mr-3"
            />
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">or</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={(e) => { e.preventDefault(); handleEmailAuth(); }} className="space-y-5">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                  className="h-12 border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="h-12 border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={mode === 'signup' ? "Create a password (min. 6 characters)" : "Enter your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="h-12 border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                required
              />
            </div>

            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}

            {mode === 'signin' && (
              <div className="flex justify-end">
                <Button 
                  variant="link" 
                  onClick={() => toast.info('Password reset feature coming soon!')}
                  className="px-0 text-sm text-gray-600 hover:text-gray-900"
                  type="button"
                >
                  Forgot password?
                </Button>
              </div>
            )}
            
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full rounded-full h-12 bg-gray-800 hover:bg-gray-900 text-white font-medium"
            >
              {loading ? (
                mode === 'signin' ? "Signing in..." : "Creating account..."
              ) : (
                <>
                  Continue <span className="ml-2">▶</span>
                </>
              )}
            </Button>
          </form>

          {/* Mode Switch */}
          <div className="text-center">
            <span className="text-sm text-gray-600">
              {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}{' '}
            </span>
            <Button
              variant="link"
              onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
              disabled={loading}
              className="px-0 text-sm font-medium text-gray-900 hover:text-gray-700"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
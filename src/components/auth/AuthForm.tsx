"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Eye, EyeOff } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"

type AuthMode = "login" | "signup"

export default function AuthForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [mode, setMode] = useState<AuthMode>("login")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        toast.success("Logged in successfully!")
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        })
        if (error) throw error
        toast.success("Signed up successfully! Check your email for confirmation.")
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      toast.error(error.message || "An error occurred with Google sign in")
    }
  }

  return (
    <motion.div
      className="mx-auto w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2 className="mb-5 text-center text-lg font-medium text-black">
        {mode === "login" ? "Welcome back" : "Create your account"}
      </h2>

      <Button
        type="button"
        className="w-full rounded-md border border-gray-200 bg-white text-xs text-black hover:bg-gray-50"
        onClick={handleGoogleSignIn}
        disabled={loading}
        variant="outline"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg" className="mr-2">
          <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
            <path
              fill="#4285F4"
              d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
            />
            <path
              fill="#34A853"
              d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
            />
            <path
              fill="#FBBC05"
              d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
            />
            <path
              fill="#EA4335"
              d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
            />
          </g>
        </svg>
        <span className="font-normal">Continue with Google</span>
      </Button>

      <div className="relative my-5">
        <Separator className="bg-gray-200" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-500">
          OR
        </span>
      </div>

      <form onSubmit={handleAuth} className="space-y-3">
        {mode === "signup" && (
          <div className="space-y-1">
            <label htmlFor="fullName" className="block text-xs font-normal text-gray-700">
              Full Name
            </label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="h-8 rounded-md border-gray-200 text-xs focus:border-black focus:ring-black"
            />
          </div>
        )}

        <div className="space-y-1">
          <label htmlFor="email" className="block text-xs font-normal text-gray-700">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="h-8 rounded-md border-gray-200 text-xs focus:border-black focus:ring-black"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-xs font-normal text-gray-700">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="h-8 rounded-md border-gray-200 pr-8 text-xs focus:border-black focus:ring-black"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <Button 
          type="submit" 
          className="mt-2 h-8 w-full rounded-full bg-black text-xs font-medium text-white hover:bg-gray-800" 
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            </div>
          ) : mode === "login" ? (
            "Sign In"
          ) : (
            "Sign Up"
          )}
        </Button>
      </form>

      <div className="mt-5 text-center">
        <p className="text-xs text-gray-500">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}
          <Button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            variant="link"
            className="h-auto p-0 text-xs font-normal text-black"
            type="button"
          >
            {mode === "login" ? "Sign Up" : "Sign In"}
          </Button>
        </p>
      </div>
    </motion.div>
  )
}

"use client"

import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"

type AuthMode = 'signin' | 'signup'

interface AuthHeaderProps {
  mode: AuthMode
}

export const AuthHeader = ({ mode }: AuthHeaderProps) => {
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

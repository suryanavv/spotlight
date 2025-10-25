"use client"

import { Button } from "@/components/ui/button"

type AuthMode = 'signin' | 'signup'

interface AuthFooterProps {
  mode: AuthMode
  loading: boolean
  onModeSwitch: (newMode: AuthMode) => void
}

export const AuthFooter = ({ mode, loading, onModeSwitch }: AuthFooterProps) => {
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

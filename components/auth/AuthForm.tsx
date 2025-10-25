"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

type AuthMode = 'signin' | 'signup'

interface AuthFormProps {
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
}

export const AuthForm = ({
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
}: AuthFormProps) => {
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

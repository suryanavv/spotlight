"use client"

import { Button } from "@/components/ui/button"

interface OAuthButtonsProps {
  onGoogleAuth: () => void
  loading: boolean
}

export const OAuthButtons = ({ onGoogleAuth, loading }: OAuthButtonsProps) => {
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

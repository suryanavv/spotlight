"use client"

import { Button } from "./button"
import { RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"

interface RefreshButtonProps {
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "outline" | "ghost" | "secondary"
}

export function RefreshButton({ 
  className,
  size = "sm",
  variant = "outline"
}: RefreshButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleRefresh = () => {
    setIsLoading(true)
    toast.success("Refreshing data...")
    router.refresh()
    setTimeout(() => setIsLoading(false), 500)
  }

  return (
    <Button
      onClick={handleRefresh}
      disabled={isLoading}
      size={size}
      variant={variant}
      className={`${className || ''} cursor-pointer`}
    >
      <RefreshCw 
        size={16} 
        className={`${isLoading ? 'animate-spin' : ''} ${size === 'icon' ? '' : 'mr-2'}`} 
      />
      {size !== 'icon' && 'Refresh'}
    </Button>
  )
} 
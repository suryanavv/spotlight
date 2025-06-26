import { Button } from "./button"
import { RefreshCw } from "lucide-react"
import { useDashboardData } from "@/lib/hooks/useQueries"
import { toast } from "sonner"

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
  const { refresh, isLoading } = useDashboardData()

  const handleRefresh = () => {
    refresh()
    toast.success("Refreshing data...")
  }

  return (
    <Button
      onClick={handleRefresh}
      disabled={isLoading}
      size={size}
      variant={variant}
      className={className}
    >
      <RefreshCw 
        size={16} 
        className={`${isLoading ? 'animate-spin' : ''} ${size === 'icon' ? '' : 'mr-2'}`} 
      />
      {size !== 'icon' && 'Refresh'}
    </Button>
  )
} 
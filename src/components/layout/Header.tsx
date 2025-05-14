"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Share2 } from 'lucide-react'
import { motion } from "framer-motion"
import { toast } from "sonner"

export default function Header() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success("Signed out successfully")
      navigate("/auth")
    } catch (error) {
      toast.error("Error signing out")
    }
  }

  const navItems = [
    { name: "Features", path: "/features" },
    { name: "Examples", path: "/examples" },
    { name: "Pricing", path: "/pricing" },
  ]

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md"
    >
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center text-sm font-medium tracking-tight text-black transition-opacity hover:opacity-80"
          >
            <span className="mr-1.5 text-black">✦</span> Spotlight
          </Link>

          <nav className="hidden md:block">
            <ul className="flex items-center gap-6">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-xs text-gray-600 transition-colors hover:text-black"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/portfolio/${user.id}`)}
                className="hidden h-8 items-center gap-1.5 rounded-full border-gray-200 px-3 text-xs hover:bg-gray-50 hover:text-black sm:flex"
              >
                <Share2 size={12} />
                <span>View Portfolio</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-7 w-7 overflow-hidden rounded-full border border-gray-200 p-0 shadow-none transition-all duration-200 hover:shadow-sm focus-visible:ring-1 focus-visible:ring-black"
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={profile?.avatar_url || undefined} alt="Profile" />
                      <AvatarFallback className="bg-gray-100 text-xs font-medium text-black">
                        {profile?.full_name?.[0] || user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-md border border-gray-200 shadow-sm">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-xs font-medium leading-none">{profile?.full_name || "User"}</p>
                      <p className="text-xs leading-none text-gray-500">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-100" />
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard")}
                    className="rounded-sm text-xs hover:bg-gray-50 hover:text-black"
                  >
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard/profile")}
                    className="rounded-sm text-xs hover:bg-gray-50 hover:text-black"
                  >
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-100" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="rounded-sm text-xs text-gray-700 hover:bg-gray-50 hover:text-black"
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/auth")}
                className="hidden h-8 rounded-full px-3 text-xs font-normal text-gray-600 hover:bg-gray-50 hover:text-black md:inline-flex"
              >
                Log in
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/auth")}
                className="h-8 rounded-full bg-black px-3 text-xs font-medium text-white hover:bg-gray-800"
              >
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.header>
  )
}

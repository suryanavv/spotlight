import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Share2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Header() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-md rounded-b-md"
    >
      <div className="container flex items-center justify-between h-16 mx-auto px-4">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-black flex items-center hover:opacity-80 transition-opacity"
        >
          <span className="text-black mr-1.5">✦</span> Spotlight
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/portfolio/${user.id}`)}
                className="flex items-center gap-1.5"
              >
                <Share2 size={14} />
                <span className="hidden sm:inline text-xs">
                  Public Portfolio
                </span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative rounded-md h-8 w-8 p-0 overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 focus-visible:ring-2 focus-visible:ring-black"
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarImage
                        src={profile?.avatar_url || undefined}
                        alt="Profile"
                      />
                      <AvatarFallback className="bg-gray-100 text-black font-medium">
                        {profile?.full_name?.[0] ||
                          user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-sm border border-gray-100 shadow-sm"
                >
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {profile?.full_name || "User"}
                      </p>
                      <p className="text-xs leading-none text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard")}
                    className="rounded-sm hover:bg-gray-50 transition-colors duration-200 text-sm"
                  >
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard/profile")}
                    className="rounded-sm hover:bg-gray-50 transition-colors duration-200 text-sm"
                  >
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="rounded-sm hover:bg-gray-50 transition-colors duration-200 text-sm"
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button variant="premium" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
}

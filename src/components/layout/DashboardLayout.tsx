import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Palette,
  ChevronLeft,
  Menu,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Collapse sidebar on mobile by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/auth");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="mt-4 text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { icon: <FileText size={18} />, name: "Overview", path: "/dashboard" },
    { icon: <User size={18} />, name: "Profile", path: "/dashboard/profile" },
    {
      icon: <Briefcase size={18} />,
      name: "Projects",
      path: "/dashboard/projects",
    },
    {
      icon: <GraduationCap size={18} />,
      name: "Education",
      path: "/dashboard/education",
    },
    {
      icon: <Briefcase size={18} />,
      name: "Experience",
      path: "/dashboard/experience",
    },
    {
      icon: <Palette size={18} />,
      name: "Templates",
      path: "/dashboard/templates",
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden shadow-sm rounded-sm bg-white border-gray-100"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu size={16} />
      </Button>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "fixed inset-y-0 left-0 z-40 w-64 bg-white/80 backdrop-blur-md border-r border-gray-100 shadow-xl rounded-r-xl transform md:translate-x-0",
            )}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between h-16 px-4 border-b border-gray-100"
            >
              <h1 className="text-base font-medium text-black flex items-center">
                <span className="text-black mr-2">✦</span> Dashboard
              </h1>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-sm hover:bg-gray-50"
                onClick={() => setSidebarOpen(false)}
              >
                <ChevronLeft size={16} />
              </Button>
            </motion.div>
            <motion.nav
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-3"
            >
              <ul className="space-y-1">
                {navItems.map((item, index) => {
                  const active = isActive(item.path);
                  return (
                    <motion.li
                      key={item.path}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "w-full justify-start rounded-sm text-sm font-normal transition-all duration-200",
                          active
                            ? "bg-gray-50 text-black"
                            : "text-gray-600 hover:bg-gray-50",
                        )}
                        onClick={() => {
                          navigate(item.path);
                          if (window.innerWidth < 768) {
                            setSidebarOpen(false);
                          }
                        }}
                      >
                        <span
                          className={cn(
                            "mr-3",
                            active ? "text-black" : "text-gray-400",
                          )}
                        >
                          {item.icon}
                        </span>
                        {item.name}
                        {active && (
                          <motion.div
                            className="absolute left-0 top-0 bottom-0 w-0.5 bg-black"
                            layoutId="sidebar-indicator"
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 30,
                            }}
                          />
                        )}
                      </Button>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.nav>
            <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center gap-2 justify-start rounded-md text-red-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors duration-200"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Logout
              </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div
        className={cn(
          "flex-1 overflow-auto transition-all duration-300 bg-white",
          sidebarOpen ? "md:ml-64" : "",
        )}
      >
        <motion.div
          className="max-w-5xl mx-auto p-4 sm:p-6 rounded-xl shadow-lg bg-white/90"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

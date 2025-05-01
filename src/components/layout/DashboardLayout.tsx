
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { 
  User, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Palette, 
  ChevronLeft, 
  ChevronRight, 
  Menu 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
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

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const navItems = [
    { icon: <FileText size={20} />, name: "Overview", path: "/dashboard" },
    { icon: <User size={20} />, name: "Profile", path: "/dashboard/profile" },
    { icon: <Briefcase size={20} />, name: "Projects", path: "/dashboard/projects" },
    { icon: <GraduationCap size={20} />, name: "Education", path: "/dashboard/education" },
    { icon: <Briefcase size={20} />, name: "Experience", path: "/dashboard/experience" },
    { icon: <Palette size={20} />, name: "Templates", path: "/dashboard/templates" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu />
      </Button>
      
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-purple-700">Dashboard</h1>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <ChevronLeft />
          </Button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate(item.path);
                    if (window.innerWidth < 768) {
                      setSidebarOpen(false);
                    }
                  }}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div 
        className={cn(
          "flex-1 overflow-auto transition-all duration-200",
          sidebarOpen ? "md:ml-64" : ""
        )}
      >
        <div className="container mx-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

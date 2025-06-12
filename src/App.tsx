import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useRoutes, useNavigate } from "react-router-dom";
import { ClerkProvider, SignIn, SignUp } from '@clerk/clerk-react';
import DashboardLayout from "./components/layout/DashboardLayout";
import Index from "./pages/Index";
import Portfolio from "./pages/Portfolio";
import Overview from "./pages/dashboard/Overview";
import ProfileSettings from "./pages/dashboard/ProfileSettings";
import Projects from "./pages/dashboard/Projects";
import Education from "./pages/dashboard/Education";
import Experience from "./pages/dashboard/Experience";
import Templates from "./pages/dashboard/Templates";
import NotFound from "./pages/NotFound";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

// Add type for window.Clerk to fix linter error
declare global {
  interface Window {
    Clerk?: { loaded?: boolean };
  }
}

const queryClient = new QueryClient();


function ClerkAuthLoader({ children }: { children: React.ReactNode }) {
  const [clerkLoaded, setClerkLoaded] = useState(false);
  useEffect(() => {
    // Clerk loads asynchronously, so wait for window.Clerk or document event
    if (window.Clerk && window.Clerk.loaded) {
      setClerkLoaded(true);
    } else {
      const handler = () => setClerkLoaded(true);
      window.addEventListener('clerkLoaded', handler);
      return () => window.removeEventListener('clerkLoaded', handler);
    }
  }, []);
  if (!clerkLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

const App = () => (
  <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<><Index /></>} />
            <Route path="/portfolio/:userId" element={<Portfolio />} />
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout><Overview /></DashboardLayout>} />
            <Route path="/dashboard/profile" element={<DashboardLayout><ProfileSettings /></DashboardLayout>} />
            <Route path="/dashboard/projects" element={<DashboardLayout><Projects /></DashboardLayout>} />
            <Route path="/dashboard/education" element={<DashboardLayout><Education /></DashboardLayout>} />
            <Route path="/dashboard/experience" element={<DashboardLayout><Experience /></DashboardLayout>} />
            <Route path="/dashboard/templates" element={<DashboardLayout><Templates /></DashboardLayout>} />
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useRoutes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/layout/Header";
import DashboardLayout from "./components/layout/DashboardLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import Portfolio from "./pages/Portfolio";
import Overview from "./pages/dashboard/Overview";
import ProfileSettings from "./pages/dashboard/ProfileSettings";
import Projects from "./pages/dashboard/Projects";
import Education from "./pages/dashboard/Education";
import Experience from "./pages/dashboard/Experience";
import Templates from "./pages/dashboard/Templates";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <Index />
                </>
              }
            />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/portfolio/:userId" element={<Portfolio />} />

            {/* Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <DashboardLayout>
                  <Overview />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/profile"
              element={
                <DashboardLayout>
                  <ProfileSettings />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/projects"
              element={
                <DashboardLayout>
                  <Projects />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/education"
              element={
                <DashboardLayout>
                  <Education />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/experience"
              element={
                <DashboardLayout>
                  <Experience />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/templates"
              element={
                <DashboardLayout>
                  <Templates />
                </DashboardLayout>
              }
            />


            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

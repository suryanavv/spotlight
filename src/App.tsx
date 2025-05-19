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


const queryClient = new QueryClient();

// Inline component for auth page header buttons
function AuthHeader({ isSignIn }: { isSignIn: boolean }) {
  const navigate = useNavigate();
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 32, marginTop: 24 }}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('/')}
        className="h-8 rounded-full px-3 text-xs font-medium"
      >
        ← Back
      </Button>
      {isSignIn ? (
        <Button
          variant="default"
          size="sm"
          onClick={() => navigate('/sign-up')}
          className="h-8 rounded-full bg-black px-3 text-xs font-medium text-white hover:bg-gray-800"
        >
          Sign Up
        </Button>
      ) : (
        <Button
          variant="default"
          size="sm"
          onClick={() => navigate('/sign-in')}
          className="h-8 rounded-full bg-black px-3 text-xs font-medium text-white hover:bg-gray-800"
        >
          Sign In
        </Button>
      )}
    </div>
  );
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
            <Route path="/sign-in/*" element={
              <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
                <div style={{ width: '100%', maxWidth: 420 }}>
                  <AuthHeader isSignIn={true} />
                  <SignIn
                    routing="path"
                    path="/sign-in"
                    appearance={{
                      baseTheme: undefined, // force light
                      variables: {
                        colorBackground: '#fff',
                        colorText: '#000',
                      },
                    }}
                    afterSignInUrl="/dashboard"
                  />
                </div>
              </div>
            } />
            <Route path="/sign-up/*" element={
              <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
                <div style={{ width: '100%', maxWidth: 420 }}>
                  <AuthHeader isSignIn={false} />
                  <SignUp
                    routing="path"
                    path="/sign-up"
                    appearance={{
                      baseTheme: undefined, // force light
                      variables: {
                        colorBackground: '#fff',
                        colorText: '#000',
                      },
                    }}
                    afterSignUpUrl="/dashboard"
                  />
                </div>
              </div>
            } />
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;

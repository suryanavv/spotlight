import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthForm from "@/components/auth/AuthForm";
import Header from "@/components/layout/Header";
import { Check } from "lucide-react";

export default function Auth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="hidden md:block fade-in">
              <h1 className="text-4xl font-bold mb-6">
                Showcase Your Portfolio
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Sign in to manage your professional portfolio and share your
                work with the world.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center bg-card p-3 rounded-lg border shadow-sm transition-shadow hover:shadow-md">
                  <div className="mr-3 flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                    <Check className="h-4 w-4" />
                  </div>
                  <span>Create a stunning portfolio</span>
                </li>
                <li className="flex items-center bg-card p-3 rounded-lg border shadow-sm transition-shadow hover:shadow-md">
                  <div className="mr-3 flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                    <Check className="h-4 w-4" />
                  </div>
                  <span>Showcase your projects</span>
                </li>
                <li className="flex items-center bg-card p-3 rounded-lg border shadow-sm transition-shadow hover:shadow-md">
                  <div className="mr-3 flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                    <Check className="h-4 w-4" />
                  </div>
                  <span>Highlight your experience</span>
                </li>
                <li className="flex items-center bg-card p-3 rounded-lg border shadow-sm transition-shadow hover:shadow-md">
                  <div className="mr-3 flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                    <Check className="h-4 w-4" />
                  </div>
                  <span>Choose from beautiful templates</span>
                </li>
              </ul>
            </div>
            <div className="fade-in">
              <AuthForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

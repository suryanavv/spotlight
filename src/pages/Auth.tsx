
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthForm from "@/components/auth/AuthForm";
import Header from "@/components/layout/Header";

export default function Auth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="hidden md:block">
              <h1 className="text-4xl font-bold text-purple-700 mb-4">Showcase Your Portfolio</h1>
              <p className="text-lg text-gray-600 mb-6">
                Sign in to manage your professional portfolio and share your work with the world.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  Create a stunning portfolio
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  Showcase your projects
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  Highlight your experience
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  Choose from beautiful templates
                </li>
              </ul>
            </div>
            <div>
              <AuthForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

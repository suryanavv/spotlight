
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-purple-700 to-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Showcase Your Professional Portfolio
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Create a stunning portfolio to highlight your skills, projects, and experience with beautiful customizable templates.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-purple-700 hover:bg-gray-100"
                onClick={() => navigate(user ? "/dashboard" : "/auth")}
              >
                {user ? "Go to Dashboard" : "Get Started"}
              </Button>
              {!user && (
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => navigate("/auth")}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Spotlight</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-lg shadow-sm border">
                <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Beautiful Templates</h3>
                <p className="text-gray-600">
                  Choose from a variety of professionally designed templates to make your portfolio stand out.
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg shadow-sm border">
                <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Project Showcase</h3>
                <p className="text-gray-600">
                  Highlight your best work with detailed project descriptions, images, and links.
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg shadow-sm border">
                <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Easy Sharing</h3>
                <p className="text-gray-600">
                  Share your portfolio with a single link and make a lasting impression.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials/CTA Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-10">Ready to Showcase Your Work?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who use Spotlight to share their portfolios and advance their careers.
            </p>
            <Button 
              size="lg" 
              className="bg-purple-700 hover:bg-purple-800"
              onClick={() => navigate(user ? "/dashboard" : "/auth")}
            >
              {user ? "Go to Dashboard" : "Create Your Portfolio"}
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold">Spotlight</h2>
              <p className="mt-2 text-gray-400">
                Showcase your professional portfolio
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">Features</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Templates</li>
                  <li>Projects</li>
                  <li>Education</li>
                  <li>Experience</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Resources</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Documentation</li>
                  <li>Support</li>
                  <li>FAQs</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Legal</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Spotlight. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

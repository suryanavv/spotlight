import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-white">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-28 bg-white relative overflow-hidden border-b border-gray-100">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#f9f9f9,transparent)] opacity-70"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="flex flex-col lg:flex-row items-center gap-16 rounded-md shadow-md bg-white/90 p-12"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.div
                className="lg:w-1/2 text-center lg:text-left"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight text-black tracking-tight">
                  Showcase Your Professional Portfolio
                </h1>
                <p className="text-2xl mb-10 text-gray-600 leading-relaxed">
                  Create a stunning portfolio to highlight your skills,
                  projects, and experience with beautiful customizable
                  templates.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button
                    variant="premium"
                    size="lg"
                    onClick={() => navigate(user ? "/dashboard" : "/auth")}
                  >
                    {user ? "Go to Dashboard" : "Get Started"}
                  </Button>
                </div>
              </motion.div>

              <motion.div
                className="lg:w-1/2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-300/30 to-gray-100/30 rounded-xl blur-lg"></div>
                  <div className="relative bg-white p-2 rounded-xl shadow-xl">
                    <img
                      src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80"
                      alt="Portfolio example"
                      className="w-full h-auto rounded-lg shadow-inner"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-gray-300/20 to-gray-100/20 rounded-full blur-xl"></div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gray-50 border-b border-gray-100">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-extrabold mb-6 text-black tracking-tight">
                Why Choose Spotlight
              </h2>
              <div className="w-24 h-1 bg-gray-300 mx-auto rounded-full"></div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  title: "Beautiful Templates",
                  description:
                    "Choose from a variety of professionally designed templates to make your portfolio stand out.",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  ),
                },
                {
                  title: "Project Showcase",
                  description:
                    "Highlight your best work with detailed project descriptions, images, and links.",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                      />
                    </svg>
                  ),
                },
                {
                  title: "Easy Sharing",
                  description:
                    "Share your portfolio with a single link and make a lasting impression.",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  ),
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/90 p-8 rounded-md shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 backdrop-blur-md"
                >
                  <div className="w-14 h-14 bg-gray-100 text-black rounded-lg flex items-center justify-center mx-auto mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,#f9f9f9,transparent)] opacity-70"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-black tracking-tight">
                Ready to Showcase Your Work?
              </h2>
              <p className="text-2xl mb-10 text-gray-600 leading-relaxed">
                Join thousands of professionals who use Spotlight to share their
                portfolios and advance their careers.
              </p>
              <Button
                variant="premium"
                size="lg"
                onClick={() => navigate(user ? "/dashboard" : "/auth")}
              >
                {user ? "Go to Dashboard" : "Create Your Portfolio"}
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:justify-between">
            <div className="mb-8 md:mb-0">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="text-white mr-2">✦</span> Spotlight
              </h2>
              <p className="mt-3 text-gray-400">
                Showcase your professional portfolio
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">
                  Features
                </h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="hover:text-gray-300 transition-colors duration-200 cursor-pointer">
                    Templates
                  </li>
                  <li className="hover:text-gray-300 transition-colors duration-200 cursor-pointer">
                    Projects
                  </li>
                  <li className="hover:text-gray-300 transition-colors duration-200 cursor-pointer">
                    Education
                  </li>
                  <li className="hover:text-gray-300 transition-colors duration-200 cursor-pointer">
                    Experience
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">
                  Resources
                </h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="hover:text-gray-300 transition-colors duration-200 cursor-pointer">
                    Documentation
                  </li>
                  <li className="hover:text-gray-300 transition-colors duration-200 cursor-pointer">
                    Support
                  </li>
                  <li className="hover:text-gray-300 transition-colors duration-200 cursor-pointer">
                    FAQs
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="hover:text-gray-300 transition-colors duration-200 cursor-pointer">
                    Privacy Policy
                  </li>
                  <li className="hover:text-gray-300 transition-colors duration-200 cursor-pointer">
                    Terms of Service
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} Spotlight. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

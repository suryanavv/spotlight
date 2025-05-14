"use client"

import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { motion } from "framer-motion"
import { ArrowRight, Check, Play } from 'lucide-react'
import Header from "@/components/layout/Header"

const Index = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const features = [
    {
      title: "Beautiful Templates",
      description: "Choose from professionally designed templates to make your portfolio stand out.",
    },
    {
      title: "Project Showcase",
      description: "Highlight your best work with detailed project descriptions, images, and links.",
    },
    {
      title: "Easy Sharing",
      description: "Share your portfolio with a single link and make a lasting impression.",
    },
  ]

  const trustedBy = [
    "Google",
    "Microsoft",
    "Adobe",
    "Spotify",
    "Twitter",
    "Airbnb",
  ]

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Announcement Banner */}
      <div className="bg-black py-2 text-center text-xs text-white">
        <span className="inline-flex items-center">
          <span className="mr-2 rounded-full bg-white px-1.5 py-0.5 text-[10px] font-medium text-black">NEW</span>
          Introducing Spotlight Pro with AI-powered portfolio suggestions
          <Button
            variant="link"
            size="sm"
            className="ml-2 h-auto p-0 text-xs font-normal text-white underline"
            onClick={() => navigate("/pricing")}
          >
            Learn more →
          </Button>
        </span>
      </div>

      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,#f5f5f5,transparent)]"></div>
          <div className="container mx-auto px-4">
            <motion.div
              className="mx-auto max-w-3xl text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="mb-5 text-4xl font-medium tracking-tight text-black md:text-5xl lg:text-6xl">
                Your professional portfolio,{" "}
                <span className="bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                  reimagined
                </span>
              </h1>
              <p className="mx-auto mb-8 max-w-2xl text-base text-gray-600 md:text-lg">
                Create a stunning portfolio to highlight your skills, projects, and experience with beautiful
                customizable templates. Join thousands of professionals advancing their careers.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  onClick={() => navigate(user ? "/dashboard" : "/auth")}
                  className="h-9 rounded-full bg-black px-4 text-xs font-medium text-white hover:bg-gray-800"
                >
                  {user ? "Go to Dashboard" : "Get Started for Free"}
                  <ArrowRight className="ml-1.5 h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {}}
                  className="h-9 rounded-full border-gray-200 px-4 text-xs font-medium hover:bg-gray-50 hover:text-black"
                >
                  <Play className="mr-1.5 h-3 w-3 fill-black" />
                  Watch demo
                </Button>
              </div>
            </motion.div>

            {/* Preview Image */}
            <motion.div
              className="mx-auto mt-16 max-w-5xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80"
                  alt="Portfolio dashboard preview"
                  className="w-full"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="border-y border-gray-100 bg-gray-50 py-10">
          <div className="container mx-auto px-4">
            <p className="mb-6 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
              Trusted by professionals from
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
              {trustedBy.map((company, index) => (
                <motion.div
                  key={company}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-sm font-medium text-gray-400"
                >
                  {company}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <h2 className="mb-4 text-3xl font-medium tracking-tight text-black">Why Choose Spotlight</h2>
              <p className="mx-auto max-w-2xl text-base text-gray-600">
                Everything you need to create a professional portfolio that stands out from the crowd.
              </p>
            </motion.div>

            <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true }}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-black">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="mb-2 text-sm font-medium text-black">{feature.title}</h3>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-sm"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-4 h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80"
                      alt="User avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sarah Johnson</p>
                    <p className="text-xs text-gray-500">UX Designer at Google</p>
                  </div>
                </div>
                <div className="text-xs text-gray-400">★★★★★</div>
              </div>
              <blockquote className="mb-4 text-sm text-gray-600">
                "Spotlight helped me create a stunning portfolio that showcased my work in the best possible light. Within
                weeks of launching my portfolio, I received multiple job offers and freelance opportunities."
              </blockquote>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <motion.div
              className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              <h2 className="mb-4 text-2xl font-medium tracking-tight text-black">
                Ready to showcase your work?
              </h2>
              <p className="mb-8 text-sm text-gray-600">
                Join thousands of professionals who use Spotlight to share their portfolios and advance their careers.
              </p>
              <Button
                onClick={() => navigate(user ? "/dashboard" : "/auth")}
                className="h-9 rounded-full bg-black px-4 text-xs font-medium text-white hover:bg-gray-800"
              >
                {user ? "Go to Dashboard" : "Create Your Portfolio"}
                <ArrowRight className="ml-1.5 h-3 w-3" />
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center text-sm font-medium">
              <span className="mr-1.5 text-black">✦</span> Spotlight
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-gray-600">
              <a href="#" className="hover:text-black">
                Features
              </a>
              <a href="#" className="hover:text-black">
                Examples
              </a>
              <a href="#" className="hover:text-black">
                Pricing
              </a>
              <a href="#" className="hover:text-black">
                About
              </a>
            </div>
            <div className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Spotlight. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Index

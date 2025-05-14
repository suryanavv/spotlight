"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import AuthForm from "@/components/auth/AuthForm"
import Header from "@/components/layout/Header"
import { Check } from 'lucide-react'
import { motion } from "framer-motion"

export default function Auth() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard")
    }
  }, [user, loading, navigate])

  const featureItems = [
    "Create a stunning portfolio",
    "Showcase your projects",
    "Highlight your experience",
    "Choose from beautiful templates",
  ]

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <motion.div
              className="hidden md:block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="mb-3 text-2xl font-medium tracking-tight text-black">Showcase Your Portfolio</h1>
              <p className="mb-6 text-sm leading-relaxed text-gray-600">
                Sign in to manage your professional portfolio and share your work with the world.
              </p>
              <ul className="space-y-2">
                {featureItems.map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center rounded-md border border-gray-200 bg-white p-2 shadow-none transition-all duration-200 hover:shadow-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="mr-2 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <Check className="h-2.5 w-2.5 text-black" />
                    </div>
                    <span className="text-xs text-gray-700">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <AuthForm />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

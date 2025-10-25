"use client"

import { motion } from "framer-motion"
import { Check } from 'lucide-react'

export const FeaturesSection = () => {
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

  return (
    <section className="py-1 md:py-2">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mb-4 text-center"
        >
          <h2 className="mb-4 text-3xl font-medium tracking-tight">Why Choose Spotlight</h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground leading-relaxed">
            Everything you need to create a professional portfolio that stands out from the crowd.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-hover-card relative overflow-hidden group"
            >
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <h3 className="mb-2 text-base font-medium">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

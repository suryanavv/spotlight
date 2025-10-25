"use client"

import { AnnouncementBanner } from "@/components/landing/AnnouncementBanner"
import { LandingHeader } from "@/components/landing/LandingHeader"
import { HeroSection } from "@/components/landing/HeroSection"
import { FeaturesSection } from "@/components/landing/FeaturesSection"
import { CtaSection } from "@/components/landing/CtaSection"
import { LandingFooter } from "@/components/landing/LandingFooter"

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AnnouncementBanner />
      <LandingHeader />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}

export default Index

import { notFound } from 'next/navigation'
import { getPortfolioData } from '@/supabase/client-actions'
import { PortfolioTemplate } from "@/components/portfolio/templates"

export default async function Portfolio({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  if (!username) {
    notFound()
  }

  // Fetch portfolio data server-side for instant rendering
  const portfolioData = await getPortfolioData(username)

  if (portfolioData.error || !portfolioData.profile) {
    notFound()
  }

  return (
    <PortfolioTemplate
      profile={portfolioData.profile}
      projects={portfolioData.projects}
      education={portfolioData.education}
      experience={portfolioData.experience}
      blogs={portfolioData.blogs}
    />
  )
}

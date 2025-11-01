"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { supabase } from '@/supabase/client'
import { Profile, Blog } from "@/supabase/types"
import NotFound from "app/not-found"
import { BlogContent } from "@/components/ui/blog-content"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format, parseISO } from "date-fns"
import { IconArrowLeft, IconCalendar, IconUser } from "@tabler/icons-react"
import { useRouter } from "next/navigation"

export default function BlogPost() {
  const params = useParams()
  const username = params.username as string
  const slug = params.slug as string
  const router = useRouter()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBlogPost() {
      if (!username || !slug) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        if (!supabase) {
          throw new Error("Database connection not available")
        }

        // Fetch profile by username first
        const { data: profileData, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("username", username)
          .single()

        if (profileError) throw profileError

        const profile: Profile = profileData as Profile
        setProfile(profile)

        // The slug parameter directly matches the blog slug
        const blogSlug = slug

        // Fetch the specific blog post
        const { data: blogData, error: blogError } = await supabase
          .from("blogs")
          .select("*")
          .eq("user_id", profile.id)
          .eq("slug", blogSlug)
          .eq("published", true)
          .single()

        if (blogError) throw blogError

        setBlog(blogData as Blog)
      } catch (error: unknown) {
        if (error && typeof error === 'object' && 'message' in error) {
          setError((error as { message?: string }).message || "Error fetching blog post")
        } else {
          setError("Error fetching blog post")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchBlogPost()
  }, [username, slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent"></div>
              <p className="mt-3 text-sm text-muted-foreground">Loading blog post...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !blog || !profile) {
    return <NotFound />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push(`/${username}`)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <IconArrowLeft size={16} />
            Back to Portfolio
          </Button>
        </div>

        {/* Blog Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || profile.username || ''} />
              <AvatarFallback>
                {(profile.full_name || profile.username || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconUser size={14} />
                <span>{profile.full_name || profile.username}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconCalendar size={14} />
                <span>
                  {blog.published_at
                    ? format(parseISO(blog.published_at), "MMMM dd, yyyy")
                    : "Recently published"
                  }
                </span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="text-lg text-muted-foreground leading-relaxed">
              {blog.excerpt}
            </p>
          )}
        </header>

        {/* Blog Content */}
        <article className="prose prose-gray dark:prose-invert max-w-none">
          <BlogContent content={blog.content} />
        </article>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <p>Published on {blog.published_at ? format(parseISO(blog.published_at), "MMMM dd, yyyy") : "Recently"}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push(`/${username}`)}
              className="flex items-center gap-2"
            >
              <IconUser size={16} />
              View Profile
            </Button>
          </div>
        </footer>
      </div>
    </div>
  )
}

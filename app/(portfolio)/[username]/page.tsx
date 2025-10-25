'use client';
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from '@/integrations/supabase/client';
import { Profile, Project, Education, Experience, Blog } from "@/types/database";
import NotFound from "app/not-found";
import { PortfolioTemplate } from "@/components/portfolio/templates";

export default function Portfolio() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPortfolioData() {
      if (!username) return;
      try {
        setLoading(true);
        setError(null);
        // Fetch profile by username
        const query = supabase
          .from("user_profiles")
          .select("*")
          .eq("username", username)
          .single();

        const { data: profileData, error: profileError } = await query;
        if (profileError) throw profileError;

        const profile: Profile = profileData as Profile;
        setProfile(profile);

        // Use the profile id as user_id for related data
        const userId = profile.id;

        // Fetch projects
        const { data: projectsData, error: projectsError } = await supabase
          .from("projects")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });
        if (projectsError) throw projectsError;
        setProjects(projectsData as Project[]);
        // Fetch education
        const { data: educationData, error: educationError } = await supabase
          .from("education")
          .select("*")
          .eq("user_id", userId)
          .order("end_date", { ascending: false });
        if (educationError) throw educationError;
        setEducation(educationData as Education[]);
        // Fetch experience
        const { data: experienceData, error: experienceError } = await supabase
          .from("experience")
          .select("*")
          .eq("user_id", userId)
          .order("end_date", { ascending: false });
        if (experienceError) throw experienceError;
        setExperience(experienceData as Experience[]);

        // Fetch blogs (only published ones for public portfolio)
        const { data: blogsData, error: blogsError } = await supabase
          .from("blogs")
          .select("*")
          .eq("user_id", userId)
          .eq("published", true)
          .order("published_at", { ascending: false });
        if (blogsError) throw blogsError;
        setBlogs(blogsData as Blog[]);
      } catch (error: unknown) {
        if (error && typeof error === 'object' && 'message' in error) {
          setError((error as { message?: string }).message || "Error fetching portfolio data");
        } else {
          setError("Error fetching portfolio data");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchPortfolioData();
  }, [username]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground border-t-transparent"></div>
          <p className="mt-3 text-xs text-muted-foreground">Loading Portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return <NotFound />;
  }

    return (
    <PortfolioTemplate
      profile={profile}
      projects={projects}
      education={education}
      experience={experience}
      blogs={blogs}
    />
  );
}

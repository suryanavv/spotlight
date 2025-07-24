'use client';
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from '@/integrations/supabase/client';
import { Profile, Project, Education, Experience } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NotFound from "app/not-found";
import { format, parseISO } from "date-fns";
import {
  Github,
  Globe,
  Linkedin,
  Twitter,
  ExternalLink,
  MapPin,
} from "lucide-react";

export default function Portfolio() {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPortfolioData() {
      if (!userId) return;
      try {
        setLoading(true);
        setError(null);
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", userId)
          .single();
        if (profileError) throw profileError;
        setProfile(profileData as Profile);
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
  }, [userId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
          <p className="mt-3 text-xs text-gray-500">Loading Portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return <NotFound />;
  }

  function formatDateRange(
    startDate?: string | null,
    endDate?: string | null,
    current?: boolean | null,
  ) {
    if (!startDate) return "";

    const start = startDate ? format(parseISO(startDate), "MMM yyyy") : "";
    const end = current
      ? "Present"
      : endDate
        ? format(parseISO(endDate), "MMM yyyy")
        : "";

    return `${start}${end ? ` - ${end}` : ""}`;
  }

  // Function to render templates
  const renderTemplate = () => {
    const templateId = profile.selected_template || "minimal";

    switch (templateId) {
      case "minimal":
        return renderMinimalTemplate();
      case "modern":
        return renderModernTemplate();
      case "creative":
        return renderCreativeTemplate();
      case "professional":
        return renderProfessionalTemplate();
      default:
        return renderMinimalTemplate();
    }
  };

  // Minimal template
  const renderMinimalTemplate = () => {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 rounded-xl backdrop-blur-md border border-border bg-card/80">
        <div className="mb-16 text-center">
          <Avatar className="w-28 h-28 mx-auto mb-6 rounded-lg border-4 border-white">
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback className="text-2xl bg-accent text-accent-foreground">
              {profile.full_name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-4xl font-medium tracking-tight">{profile.full_name}</h1>
          {profile.headline && (
            <h2 className="text-xl text-muted-foreground mt-3">
              {profile.headline}
            </h2>
          )}
          {profile.location && (
            <p className="flex items-center justify-center mt-3 text-sm text-muted-foreground">
              <MapPin size={16} className="mr-1.5" /> {profile.location}
            </p>
          )}

          <div className="flex justify-center mt-6 space-x-3">
            {profile.website && (
              <Button size="icon" variant="outline" className="rounded-full bg-background/50 backdrop-blur-sm hover:bg-accent/50" asChild>
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Website"
                >
                  <Globe size={18} />
                </a>
              </Button>
            )}
            {profile.github && (
              <Button size="icon" variant="outline" className="rounded-full bg-background/50 backdrop-blur-sm hover:bg-accent/50" asChild>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <Github size={18} />
                </a>
              </Button>
            )}
            {profile.linkedin && (
              <Button size="icon" variant="outline" className="rounded-full bg-background/50 backdrop-blur-sm hover:bg-accent/50" asChild>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
              </Button>
            )}
            {profile.twitter && (
              <Button size="icon" variant="outline" className="rounded-full bg-background/50 backdrop-blur-sm hover:bg-accent/50" asChild>
                <a
                  href={profile.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <Twitter size={20} />
                </a>
              </Button>
            )}
          </div>
        </div>

        {profile.bio && (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4">About Me</h2>
            <div className="prose max-w-none">
              <p>{profile.bio}</p>
            </div>
          </div>
        )}

        {projects.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden rounded-md shadow-md border border-gray-100 bg-white/90 hover:shadow-xl transition-all duration-300">
                  {project.image_url && (
                    <div className="h-40">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <h3 className="font-bold">{project.title}</h3>
                    {project.description && (
                      <p className="text-muted-foreground text-sm mt-2 line-clamp-3">
                        {project.description}
                      </p>
                    )}
                    {project.technologies &&
                      project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    <div className="flex gap-2 mt-4">
                      {project.project_url && (
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={project.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink size={14} className="mr-2" /> Live
                            Demo
                          </a>
                        </Button>
                      )}
                      {project.github_url && (
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github size={14} className="mr-2" /> GitHub
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {experience.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4">Experience</h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-b pb-4 last:border-0">
                  <h3 className="font-bold">{exp.position}</h3>
                  <p className="text-muted-foreground">{exp.company}</p>
                  <div className="flex items-center text-sm text-muted-foreground gap-2 mt-1">
                    <span>
                      {formatDateRange(
                        exp.start_date,
                        exp.end_date,
                        exp.current_job,
                      )}
                    </span>
                    {exp.location && (
                      <>
                        <span>•</span>
                        <span>{exp.location}</span>
                      </>
                    )}
                  </div>
                  {exp.description && (
                    <p className="mt-2 text-sm">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Education</h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-b pb-4 last:border-0">
                  <h3 className="font-bold">{edu.institution}</h3>
                  <p className="text-muted-foreground">
                    {edu.degree}{" "}
                    {edu.field_of_study ? `in ${edu.field_of_study}` : ""}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDateRange(edu.start_date, edu.end_date)}
                  </p>
                  {edu.description && (
                    <p className="mt-2 text-sm">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Modern template
  const renderModernTemplate = () => {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="w-full bg-black py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <Avatar className="w-24 h-24 border-4 border-white">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="text-3xl">
                  {profile.full_name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-white">
                  {profile.full_name}
                </h1>
                {profile.headline && (
                  <h2 className="text-xl text-white/80 mt-2">
                    {profile.headline}
                  </h2>
                )}
                {profile.location && (
                  <p className="flex items-center justify-center md:justify-start mt-2 text-sm text-white/80">
                    <MapPin size={16} className="mr-1" /> {profile.location}
                  </p>
                )}

                <div className="flex justify-center md:justify-start mt-4 space-x-3">
                  {profile.website && (
                    <Button
                      size="icon"
                      variant="secondary"
                      asChild
                    >
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Website"
                      >
                        <Globe size={20} />
                      </a>
                    </Button>
                  )}
                  {profile.github && (
                    <Button
                      size="icon"
                      variant="secondary"
                      asChild
                    >
                      <a
                        href={profile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                      >
                        <Github size={20} />
                      </a>
                    </Button>
                  )}
                  {profile.linkedin && (
                    <Button
                      size="icon"
                      variant="secondary"
                      asChild
                    >
                      <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                      >
                        <Linkedin size={20} />
                      </a>
                    </Button>
                  )}
                  {profile.twitter && (
                    <Button
                      size="icon"
                      variant="secondary"
                      asChild
                    >
                      <a
                        href={profile.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Twitter"
                      >
                        <Twitter size={20} />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          {profile.bio && (
            <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">
                About Me
              </h2>
              <div className="prose max-w-none">
                <p>{profile.bio}</p>
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-6 border-b pb-2">
                Projects
              </h2>
              <div className="grid grid-cols-1 gap-8">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex flex-col md:flex-row gap-6"
                  >
                    {project.image_url && (
                      <div className="w-full md:w-1/3">
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                    )}
                    <div
                      className={`w-full ${project.image_url ? "md:w-2/3" : ""}`}
                    >
                      <h3 className="text-xl font-bold">{project.title}</h3>
                      {project.description && (
                        <p className="text-gray-600 mt-2">
                          {project.description}
                        </p>
                      )}
                      {project.technologies &&
                        project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {project.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="bg-gray-100 text-black text-xs px-2.5 py-0.5 rounded-full"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      <div className="flex gap-3 mt-4">
                        {project.project_url && (
                          <Button variant="outline" asChild>
                            <a
                              href={project.project_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink size={16} className="mr-2" /> Live
                              Demo
                            </a>
                          </Button>
                        )}
                        {project.github_url && (
                          <Button variant="outline" asChild>
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Github size={16} className="mr-2" /> GitHub
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {experience.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 border-b pb-2">
                  Experience
                </h2>
                <div className="space-y-6">
                  {experience.map((exp) => (
                    <div key={exp.id}>
                      <h3 className="text-lg font-bold">{exp.position}</h3>
                      <p className="text-black font-medium">{exp.company}</p>
                      <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <span>
                          {formatDateRange(
                            exp.start_date,
                            exp.end_date,
                            exp.current_job,
                          )}
                        </span>
                        {exp.location && (
                          <>
                            <span>•</span>
                            <span className="flex items-center">
                              <MapPin size={14} className="mr-1" />{" "}
                              {exp.location}
                            </span>
                          </>
                        )}
                      </div>
                      {exp.description && (
                        <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {education.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 border-b pb-2">
                  Education
                </h2>
                <div className="space-y-6">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="text-lg font-bold">{edu.institution}</h3>
                      <p className="text-black font-medium">
                        {edu.degree}{" "}
                        {edu.field_of_study ? `in ${edu.field_of_study}` : ""}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDateRange(edu.start_date, edu.end_date)}
                      </p>
                      {edu.description && (
                        <p className="mt-2 text-sm text-gray-600">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Creative template
  const renderCreativeTemplate = () => {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row items-center mb-16 gap-8">
            {profile.avatar_url && (
              <Avatar className="w-32 h-32 border-4 border-gray-500">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="text-4xl">
                  {profile.full_name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}

            <div>
              <h1 className="text-5xl font-bold text-white">
                {profile.full_name}
              </h1>
              {profile.headline && (
                <p className="text-xl mt-2 text-gray-300">{profile.headline}</p>
              )}

              <div className="flex mt-6 space-x-4">
                {profile.website && (
                  <Button
                    size="icon"
                    variant="secondary"
                    asChild
                  >
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Website"
                    >
                      <Globe size={20} />
                    </a>
                  </Button>
                )}
                {profile.github && (
                  <Button
                    size="icon"
                    variant="secondary"
                    asChild
                  >
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                    >
                      <Github size={20} />
                    </a>
                  </Button>
                )}
                {profile.linkedin && (
                  <Button
                    size="icon"
                    variant="secondary"
                    asChild
                  >
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={20} />
                    </a>
                  </Button>
                )}
                {profile.twitter && (
                  <Button
                    size="icon"
                    variant="secondary"
                    asChild
                  >
                    <a
                      href={profile.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter"
                    >
                      <Twitter size={20} />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {profile.bio && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-800 pb-2">
                About Me
              </h2>
              <div className="text-gray-300 leading-relaxed">
                <p>{profile.bio}</p>
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-800 pb-2">
                Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-gray-900 rounded-lg overflow-hidden"
                  >
                    {project.image_url && (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-56 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="text-gray-400 mt-2">
                          {project.description}
                        </p>
                      )}
                      {project.technologies &&
                        project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {project.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="bg-gray-800 text-gray-300 text-xs px-2.5 py-1 rounded-full"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      <div className="flex gap-3 mt-6">
                        {project.project_url && (
                          <Button
                            className="bg-white hover:bg-gray-200 text-black"
                            asChild
                          >
                            <a
                              href={project.project_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink size={16} className="mr-2" /> Demo
                            </a>
                          </Button>
                        )}
                        {project.github_url && (
                          <Button
                            variant="outline"
                            className="border-gray-700 text-gray-300 hover:bg-gray-800"
                            asChild
                          >
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Github size={16} className="mr-2" /> Code
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {experience.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-800 pb-2">
                  Experience
                </h2>
                <div className="space-y-8">
                  {experience.map((exp) => (
                    <div
                      key={exp.id}
                      className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-800"
                    >
                      <div className="absolute left-0 top-0 w-2 h-2 bg-gray-500 rounded-full transform -translate-x-1/2"></div>
                      <h3 className="text-lg font-bold text-white">
                        {exp.position}
                      </h3>
                      <p className="text-gray-400">{exp.company}</p>
                      <div className="text-sm text-gray-400 mt-1">
                        {formatDateRange(
                          exp.start_date,
                          exp.end_date,
                          exp.current_job,
                        )}
                        {exp.location && ` • ${exp.location}`}
                      </div>
                      {exp.description && (
                        <p className="mt-2 text-gray-300">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {education.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-800 pb-2">
                  Education
                </h2>
                <div className="space-y-8">
                  {education.map((edu) => (
                    <div
                      key={edu.id}
                      className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-800"
                    >
                      <div className="absolute left-0 top-0 w-2 h-2 bg-gray-500 rounded-full transform -translate-x-1/2"></div>
                      <h3 className="text-lg font-bold text-white">
                        {edu.institution}
                      </h3>
                      <p className="text-gray-400">
                        {edu.degree}{" "}
                        {edu.field_of_study ? `in ${edu.field_of_study}` : ""}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {formatDateRange(edu.start_date, edu.end_date)}
                      </p>
                      {edu.description && (
                        <p className="mt-2 text-gray-300">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Professional template
  const renderProfessionalTemplate = () => {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-black text-white">
          <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {profile.avatar_url && (
                <Avatar className="w-28 h-28 border-4 border-white shadow-lg">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback className="text-3xl">
                    {profile.full_name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}

              <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold">{profile.full_name}</h1>
                {profile.headline && (
                  <h2 className="text-xl text-gray-200 mt-2">
                    {profile.headline}
                  </h2>
                )}

                <div className="flex justify-center md:justify-start mt-4 space-x-4">
                  {profile.website && (
                    <Button
                      size="sm"
                      variant="secondary"
                      asChild
                    >
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe size={16} className="mr-2" /> Website
                      </a>
                    </Button>
                  )}
                  {profile.linkedin && (
                    <Button
                      size="sm"
                      variant="secondary"
                      asChild
                    >
                      <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin size={16} className="mr-2" /> LinkedIn
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            {profile.bio && (
              <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
                <h2 className="text-xl font-bold mb-4 border-b pb-2">About</h2>
                <p className="text-gray-700">{profile.bio}</p>
              </div>
            )}

            <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">Contact</h2>

              {profile.location && (
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="text-black mt-1 flex-shrink-0" size={18} />
                  <span>{profile.location}</span>
                </div>
              )}

              <div className="space-y-3">
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-black hover:text-gray-700"
                  >
                    <Globe size={18} className="flex-shrink-0" />
                    <span>Website</span>
                  </a>
                )}
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-black hover:text-gray-700"
                  >
                    <Github size={18} className="flex-shrink-0" />
                    <span>GitHub</span>
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-black hover:text-gray-700"
                  >
                    <Linkedin size={18} className="flex-shrink-0" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {profile.twitter && (
                  <a
                    href={profile.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-black hover:text-gray-700"
                  >
                    <Twitter size={18} className="flex-shrink-0" />
                    <span>Twitter</span>
                  </a>
                )}
              </div>
            </div>

            {education.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4 border-b pb-2">
                  Education
                </h2>
                <div className="space-y-6">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="text-lg font-semibold">
                        {edu.institution}
                      </h3>
                      <p className="font-medium text-black">
                        {edu.degree}{" "}
                        {edu.field_of_study ? `in ${edu.field_of_study}` : ""}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatDateRange(edu.start_date, edu.end_date)}
                      </p>
                      {edu.description && (
                        <p className="mt-2 text-sm text-gray-700">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-8">
            {experience.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-6 border-b pb-2">
                  Professional Experience
                </h2>
                <div className="space-y-8">
                  {experience.map((exp) => (
                    <div
                      key={exp.id}
                      className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
                    >
                      <div className="flex flex-col md:flex-row justify-between">
                        <h3 className="text-lg font-semibold text-black">
                          {exp.position}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatDateRange(
                            exp.start_date,
                            exp.end_date,
                            exp.current_job,
                          )}
                        </p>
                      </div>
                      <p className="font-medium">
                        {exp.company}
                        {exp.location && (
                          <span className="font-normal text-gray-600">
                            {" "}
                            • {exp.location}
                          </span>
                        )}
                      </p>
                      {exp.description && (
                        <p className="mt-3 text-gray-700">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {projects.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-6 border-b pb-2">
                  Projects
                </h2>
                <div className="space-y-8">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
                    >
                      <h3 className="text-lg font-semibold text-black">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="text-gray-700 mt-2">
                          {project.description}
                        </p>
                      )}
                      {project.technologies &&
                        project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className="text-gray-700 font-medium">
                              Technologies:
                            </span>
                            <span className="text-gray-600">
                              {project.technologies.join(", ")}
                            </span>
                          </div>
                        )}
                      <div className="flex gap-3 mt-4">
                        {project.project_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-black"
                            asChild
                          >
                            <a
                              href={project.project_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink size={14} className="mr-2" /> View
                              Project
                            </a>
                          </Button>
                        )}
                        {project.github_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-black"
                            asChild
                          >
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Github size={14} className="mr-2" /> View Code
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return renderTemplate();
}

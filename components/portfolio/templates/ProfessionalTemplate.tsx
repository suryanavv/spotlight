"use client"
import { Profile, Project, Education, Experience, Blog } from "@/supabase/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, parseISO } from "date-fns";
import { BlogContent } from "@/components/ui/blog-content";
import { useRouter } from "next/navigation";
import {
  IconBrandGithub,
  IconWorld,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconExternalLink,
  IconMapPin,
} from "@tabler/icons-react";

interface ProfessionalTemplateProps {
  profile: Profile;
  projects: Project[];
  education: Education[];
  experience: Experience[];
  blogs: Blog[];
}

export function ProfessionalTemplate({ profile, projects, education, experience, blogs }: ProfessionalTemplateProps) {
  const router = useRouter();
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
                    className="cursor-pointer"
                    asChild
                  >
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconWorld size={16} className="mr-2" /> Website
                    </a>
                  </Button>
                )}
                {profile.linkedin && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="cursor-pointer"
                    asChild
                  >
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconBrandLinkedin size={16} className="mr-2" /> LinkedIn
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
            <div className="bg-card rounded-lg p-6 shadow-sm mb-8">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">About</h2>
              <p className="text-gray-700">{profile.bio}</p>
            </div>
          )}

          <div className="bg-card rounded-lg p-6 shadow-sm mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Contact</h2>

            {profile.location && (
              <div className="flex items-start gap-3 mb-4">
                <IconMapPin className="text-black mt-1 flex-shrink-0" size={18} />
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
                  <IconWorld size={18} className="flex-shrink-0" />
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
                  <IconBrandGithub size={18} className="flex-shrink-0" />
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
                  <IconBrandLinkedin size={18} className="flex-shrink-0" />
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
                  <IconBrandTwitter size={18} className="flex-shrink-0" />
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
                      {formatDateRange(edu.start_date, edu.end_date, edu.current_education)}
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
                          className="text-black cursor-pointer"
                          asChild
                        >
                          <a
                            href={project.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <IconExternalLink size={14} className="mr-2" /> View
                            Project
                          </a>
                        </Button>
                      )}
                      {project.github_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-black cursor-pointer"
                          asChild
                        >
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <IconBrandGithub size={14} className="mr-2" /> View Code
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {blogs.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6 border-b pb-2">
                Blog Posts
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="border border-gray-100 rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => router.push(`/${profile.username}/blog/${blog.slug}`)}
                  >
                    <h3 className="text-lg font-semibold text-black mb-2">
                      {blog.title}
                    </h3>
                    {blog.excerpt && (
                      <p className="text-gray-700 mt-2 mb-4">
                        {blog.excerpt}
                      </p>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <span>Published {blog.published_at ? format(parseISO(blog.published_at), "MMM yyyy") : "Recently"}</span>
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
}

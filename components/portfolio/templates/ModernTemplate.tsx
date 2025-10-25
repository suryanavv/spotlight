import { Profile, Project, Education, Experience, Blog } from "@/types/database";
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

interface ModernTemplateProps {
  profile: Profile;
  projects: Project[];
  education: Education[];
  experience: Experience[];
  blogs: Blog[];
}

export function ModernTemplate({ profile, projects, education, experience, blogs }: ModernTemplateProps) {
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
    <div className="bg-secondary min-h-screen">
      <div className="w-full bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <Avatar className="w-24 h-24 border-4 border-primary-foreground">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="text-3xl">
                {profile.full_name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-primary-foreground">
                {profile.full_name}
              </h1>
              {profile.headline && (
                <h2 className="text-xl text-primary-foreground/80 mt-2">
                  {profile.headline}
                </h2>
              )}
              {profile.location && (
                <p className="flex items-center justify-center md:justify-start mt-2 text-sm text-primary-foreground/80">
                  <IconMapPin size={16} className="mr-1" /> {profile.location}
                </p>
              )}

              <div className="flex justify-center md:justify-start mt-4 space-x-3">
                {profile.website && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="cursor-pointer"
                    asChild
                  >
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Website"
                    >
                      <IconWorld size={20} />
                    </a>
                  </Button>
                )}
                {profile.github && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="cursor-pointer"
                    asChild
                  >
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                    >
                      <IconBrandGithub size={20} />
                    </a>
                  </Button>
                )}
                {profile.linkedin && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="cursor-pointer"
                    asChild
                  >
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                    >
                      <IconBrandLinkedin size={20} />
                    </a>
                  </Button>
                )}
                {profile.twitter && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="cursor-pointer"
                    asChild
                  >
                    <a
                      href={profile.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter"
                    >
                      <IconBrandTwitter size={20} />
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
          <div className="bg-card rounded-lg p-6 shadow-sm mb-8">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">
              About Me
            </h2>
            <div className="prose max-w-none">
              <p>{profile.bio}</p>
            </div>
          </div>
        )}

        {projects.length > 0 && (
          <div className="bg-card rounded-lg p-6 shadow-sm mb-8">
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
                        <Button variant="outline" className="cursor-pointer" asChild>
                          <a
                            href={project.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <IconExternalLink size={16} className="mr-2" /> Live
                            Demo
                          </a>
                        </Button>
                      )}
                      {project.github_url && (
                        <Button variant="outline" className="cursor-pointer" asChild>
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <IconBrandGithub size={16} className="mr-2" /> GitHub
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

          {blogs.length > 0 && (
            <div className="bg-card rounded-lg p-6 shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-6 border-b pb-2">
                Blog Posts
              </h2>
              <div className="grid grid-cols-1 gap-6">
                {blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`/${profile.username}/blog/${blog.slug}`)}
                  >
                    <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
                    {blog.excerpt && (
                      <p className="text-gray-600 mt-2 mb-4">
                        {blog.excerpt}
                      </p>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      <span>Published {blog.published_at ? format(parseISO(blog.published_at), "MMM yyyy") : "Recently"}</span>
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
                            <IconMapPin size={14} className="mr-1" />{" "}
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
                      {formatDateRange(edu.start_date, edu.end_date, edu.current_education)}
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
}

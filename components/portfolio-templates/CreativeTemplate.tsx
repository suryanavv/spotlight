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

interface CreativeTemplateProps {
  profile: Profile;
  projects: Project[];
  education: Education[];
  experience: Experience[];
  blogs: Blog[];
}

export function CreativeTemplate({ profile, projects, education, experience, blogs }: CreativeTemplateProps) {
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
                          className="bg-white hover:bg-gray-200 text-black cursor-pointer"
                          asChild
                        >
                          <a
                            href={project.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <IconExternalLink size={16} className="mr-2" /> Demo
                          </a>
                        </Button>
                      )}
                      {project.github_url && (
                        <Button
                          variant="outline"
                          className="border-gray-700 text-gray-300 hover:bg-gray-800 cursor-pointer"
                          asChild
                        >
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <IconBrandGithub size={16} className="mr-2" /> Code
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
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-800 pb-2">
                Blog Posts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-800 transition-colors"
                    onClick={() => router.push(`/${profile.username}/blog/${blog.slug}`)}
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                        {blog.title}
                      </h3>
                      {blog.excerpt && (
                        <p className="text-gray-400 mt-2 mb-4 line-clamp-3">
                          {blog.excerpt}
                        </p>
                      )}
                      <div className="flex items-center text-sm text-gray-400">
                        <span>Published {blog.published_at ? format(parseISO(blog.published_at), "MMM yyyy") : "Recently"}</span>
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
                      {formatDateRange(edu.start_date, edu.end_date, edu.current_education)}
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
}

import { Profile, Project, Education, Experience, Blog } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

interface MinimalTemplateProps {
  profile: Profile;
  projects: Project[];
  education: Education[];
  experience: Experience[];
  blogs: Blog[];
}

export function MinimalTemplate({ profile, projects, education, experience, blogs }: MinimalTemplateProps) {
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
    <div className="max-w-4xl mx-auto px-6 py-16 rounded-xl backdrop-blur-md border border-border bg-card/80">
      <div className="mb-16 text-center">
        <Avatar className="w-28 h-28 mx-auto mb-6 rounded-lg border-4 border-card">
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
            <IconMapPin size={16} className="mr-1.5" /> {profile.location}
          </p>
        )}

        <div className="flex justify-center mt-6 space-x-3">
          {profile.website && (
            <Button size="icon" variant="outline" className="rounded-full bg-background/50 backdrop-blur-sm hover:bg-accent/50 cursor-pointer" asChild>
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Website"
              >
                <IconWorld size={18} />
              </a>
            </Button>
          )}
          {profile.github && (
            <Button size="icon" variant="outline" className="rounded-full bg-background/50 backdrop-blur-sm hover:bg-accent/50 cursor-pointer" asChild>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <IconBrandGithub size={18} />
              </a>
            </Button>
          )}
          {profile.linkedin && (
            <Button size="icon" variant="outline" className="rounded-full bg-background/50 backdrop-blur-sm hover:bg-accent/50 cursor-pointer" asChild>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <IconBrandLinkedin size={18} />
              </a>
            </Button>
          )}
          {profile.twitter && (
            <Button size="icon" variant="outline" className="rounded-full bg-background/50 backdrop-blur-sm hover:bg-accent/50 cursor-pointer" asChild>
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
              <Card key={project.id} className="overflow-hidden rounded-md shadow-md border border-border bg-card/90 hover:shadow-xl transition-all duration-300">
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
                      <Button size="sm" variant="outline" className="cursor-pointer" asChild>
                        <a
                          href={project.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <IconExternalLink size={14} className="mr-2" /> Live
                          Demo
                        </a>
                      </Button>
                    )}
                    {project.github_url && (
                      <Button size="sm" variant="outline" className="cursor-pointer" asChild>
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <IconBrandGithub size={14} className="mr-2" /> GitHub
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

        {blogs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4">Blog Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogs.map((blog) => (
                <Card
                  key={blog.id}
                  className="overflow-hidden rounded-md shadow-md border border-border bg-card/90 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => router.push(`/${profile.username}/blog/${blog.slug}`)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-bold text-base mb-2 line-clamp-2">{blog.title}</h3>
                    {blog.excerpt && (
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
                        {blog.excerpt}
                      </p>
                    )}
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>Published {blog.published_at ? format(parseISO(blog.published_at), "MMM yyyy") : "Recently"}</span>
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
                  {formatDateRange(edu.start_date, edu.end_date, edu.current_education)}
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
}

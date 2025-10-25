import { Profile, Project, Education, Experience, Blog } from "@/types/database";
import { MinimalTemplate } from "./MinimalTemplate";
import { ModernTemplate } from "./ModernTemplate";
import { CreativeTemplate } from "./CreativeTemplate";
import { ProfessionalTemplate } from "./ProfessionalTemplate";

interface PortfolioTemplateProps {
  profile: Profile;
  projects: Project[];
  education: Education[];
  experience: Experience[];
  blogs: Blog[];
}

export function PortfolioTemplate({
  profile,
  projects,
  education,
  experience,
  blogs
}: PortfolioTemplateProps) {
  const selectedTemplate = profile.selected_template || "minimal";

  switch (selectedTemplate) {
    case "minimal":
      return (
        <MinimalTemplate
          profile={profile}
          projects={projects}
          education={education}
          experience={experience}
          blogs={blogs}
        />
      );
    case "modern":
      return (
        <ModernTemplate
          profile={profile}
          projects={projects}
          education={education}
          experience={experience}
          blogs={blogs}
        />
      );
    case "creative":
      return (
        <CreativeTemplate
          profile={profile}
          projects={projects}
          education={education}
          experience={experience}
          blogs={blogs}
        />
      );
    case "professional":
      return (
        <ProfessionalTemplate
          profile={profile}
          projects={projects}
          education={education}
          experience={experience}
          blogs={blogs}
        />
      );
    default:
      return (
        <MinimalTemplate
          profile={profile}
          projects={projects}
          education={education}
          experience={experience}
          blogs={blogs}
        />
      );
  }
}

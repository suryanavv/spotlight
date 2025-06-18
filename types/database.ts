export interface Profile {
  id: string;
  full_name: string | null;
  headline: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  avatar_url: string | null;
  selected_template: string | null;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  project_url: string | null;
  github_url: string | null;
  technologies: string[] | null;
  created_at: string | null;
}

export interface Education {
  id: string;
  user_id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  start_date: string | null;
  end_date: string | null;
  current_education: boolean | null;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Experience {
  id: string;
  user_id: string;
  company: string;
  position: string;
  location: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  current_job: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

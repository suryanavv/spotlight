-- =========================================
-- Spotlight Portfolio Database Schema
-- Complete setup for all tables, policies, and functions
-- Run this file once to set up your entire database
-- =========================================

-- =========================================
-- 1. BASE TABLES SETUP
-- =========================================

-- Create user_profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  full_name TEXT,
  github TEXT,
  headline TEXT,
  linkedin TEXT,
  location TEXT,
  selected_template TEXT,
  twitter TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  website TEXT,
  username TEXT UNIQUE
);

-- Create education table
CREATE TABLE IF NOT EXISTS public.education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  current_education BOOLEAN DEFAULT false,
  degree TEXT NOT NULL,
  description TEXT,
  end_date DATE,
  field_of_study TEXT,
  institution TEXT NOT NULL,
  start_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create experience table
CREATE TABLE IF NOT EXISTS public.experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  current_job BOOLEAN DEFAULT false,
  description TEXT,
  end_date DATE,
  location TEXT,
  position TEXT NOT NULL,
  start_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  description TEXT,
  github_url TEXT,
  image_url TEXT,
  project_url TEXT,
  technologies TEXT[],
  title TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- =========================================
-- 2. BLOGS TABLE SETUP
-- =========================================

-- Create blogs table for MDX blog posts
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL, -- MDX content
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- =========================================
-- 3. INDEXES FOR PERFORMANCE
-- =========================================

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);

-- Blogs indexes
CREATE INDEX IF NOT EXISTS idx_blogs_user_id ON public.blogs(user_id);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON public.blogs(published);

-- =========================================
-- 4. CONSTRAINTS
-- =========================================

-- Add username constraint to ensure it's not empty when provided
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS username_not_empty;
ALTER TABLE public.user_profiles ADD CONSTRAINT username_not_empty CHECK (username IS NULL OR length(trim(username)) > 0);

-- =========================================
-- 5. ENABLE ROW LEVEL SECURITY
-- =========================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- =========================================
-- 6. ROW LEVEL SECURITY POLICIES
-- =========================================

-- User profiles table policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Allow public to view profiles for portfolio display
DROP POLICY IF EXISTS "Public can view profiles for portfolios" ON public.user_profiles;
CREATE POLICY "Public can view profiles for portfolios" ON public.user_profiles
  FOR SELECT USING (username IS NOT NULL AND trim(username) != '');

-- Education table policies
DROP POLICY IF EXISTS "Users can view own education" ON public.education;
CREATE POLICY "Users can view own education" ON public.education
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own education" ON public.education;
CREATE POLICY "Users can insert own education" ON public.education
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own education" ON public.education;
CREATE POLICY "Users can update own education" ON public.education
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own education" ON public.education;
CREATE POLICY "Users can delete own education" ON public.education
  FOR DELETE USING (auth.uid() = user_id);

-- Public access policy for education table
DROP POLICY IF EXISTS "Public can view education for portfolios" ON public.education;
CREATE POLICY "Public can view education for portfolios" ON public.education
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id::text = education.user_id::text
      AND user_profiles.username IS NOT NULL
      AND trim(user_profiles.username) != ''
    )
  );

-- Experience table policies
DROP POLICY IF EXISTS "Users can view own experience" ON public.experience;
CREATE POLICY "Users can view own experience" ON public.experience
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own experience" ON public.experience;
CREATE POLICY "Users can insert own experience" ON public.experience
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own experience" ON public.experience;
CREATE POLICY "Users can update own experience" ON public.experience
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own experience" ON public.experience;
CREATE POLICY "Users can delete own experience" ON public.experience
  FOR DELETE USING (auth.uid() = user_id);

-- Public access policy for experience table
DROP POLICY IF EXISTS "Public can view experience for portfolios" ON public.experience;
CREATE POLICY "Public can view experience for portfolios" ON public.experience
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id::text = experience.user_id::text
      AND user_profiles.username IS NOT NULL
      AND trim(user_profiles.username) != ''
    )
  );

-- Projects table policies
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own projects" ON public.projects;
CREATE POLICY "Users can insert own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;
CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- Public access policy for projects table
DROP POLICY IF EXISTS "Public can view projects for portfolios" ON public.projects;
CREATE POLICY "Public can view projects for portfolios" ON public.projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id::text = projects.user_id::text
      AND user_profiles.username IS NOT NULL
      AND trim(user_profiles.username) != ''
    )
  );

-- Blogs table policies
DROP POLICY IF EXISTS "Users can view own blogs" ON public.blogs;
CREATE POLICY "Users can view own blogs" ON public.blogs
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own blogs" ON public.blogs;
CREATE POLICY "Users can insert own blogs" ON public.blogs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own blogs" ON public.blogs;
CREATE POLICY "Users can update own blogs" ON public.blogs
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own blogs" ON public.blogs;
CREATE POLICY "Users can delete own blogs" ON public.blogs
  FOR DELETE USING (auth.uid() = user_id);

-- Public access policy for published blogs in portfolios
DROP POLICY IF EXISTS "Public can view published blogs for portfolios" ON public.blogs;
CREATE POLICY "Public can view published blogs for portfolios" ON public.blogs
  FOR SELECT USING (
    published = true AND
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id::text = blogs.user_id::text
      AND user_profiles.username IS NOT NULL
      AND trim(user_profiles.username) != ''
    )
  );

-- =========================================
-- 7. FUNCTIONS
-- =========================================

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically generate slug from title
CREATE OR REPLACE FUNCTION generate_blog_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically set published_at when published becomes true
CREATE OR REPLACE FUNCTION set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.published = true AND OLD.published = false THEN
    NEW.published_at = TIMEZONE('utc'::text, NOW());
  ELSIF NEW.published = false THEN
    NEW.published_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- 8. TRIGGERS
-- =========================================

-- Trigger to automatically create user profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to automatically update updated_at for blogs
CREATE TRIGGER update_blogs_updated_at
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to automatically set published_at for blogs
CREATE TRIGGER set_blog_published_at
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW
  EXECUTE FUNCTION set_published_at();

-- =========================================
-- 9. STORAGE BUCKET SETUP
-- =========================================

-- Create the portfolio storage bucket for avatars and project images
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
DROP POLICY IF EXISTS "Allow authenticated users to upload files" ON storage.objects;
CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'portfolio'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their own files
DROP POLICY IF EXISTS "Allow authenticated users to update their files" ON storage.objects;
CREATE POLICY "Allow authenticated users to update their files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'portfolio'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own files
DROP POLICY IF EXISTS "Allow authenticated users to delete their files" ON storage.objects;
CREATE POLICY "Allow authenticated users to delete their files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'portfolio'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public access to view files (needed for displaying images)
DROP POLICY IF EXISTS "Allow public access to view files" ON storage.objects;
CREATE POLICY "Allow public access to view files" ON storage.objects
FOR SELECT USING (bucket_id = 'portfolio');

-- =========================================
-- SETUP COMPLETE
-- =========================================

-- You can now run this file in your Supabase SQL Editor or use:
-- supabase db push (if you have the Supabase CLI installed)
--
-- The schema includes:
-- ✅ User profiles extending Supabase auth.users
-- ✅ Education, experience, and projects tracking
-- ✅ Blog system with MDX support
-- ✅ File storage for avatars and project images
-- ✅ Row Level Security policies for data protection
-- ✅ Public portfolio viewing capabilities
-- ✅ Automatic timestamps and slug generation

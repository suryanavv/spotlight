-- =========================================
-- Spotlight Portfolio Database Schema
-- Complete setup for all tables, policies, and functions
-- Run this file once to set up your entire database
-- =========================================

-- =========================================
-- 1. BASE TABLES SETUP
-- =========================================

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  email TEXT,
  full_name TEXT,
  image TEXT,
  name TEXT,
  token_identifier TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  user_id UUID
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  website TEXT
);

-- Create education table
CREATE TABLE IF NOT EXISTS public.education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
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

-- Add username field and constraints to user_profiles
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'username') THEN
    ALTER TABLE public.user_profiles ADD COLUMN username TEXT UNIQUE;
    ALTER TABLE public.user_profiles ADD CONSTRAINT username_not_empty CHECK (username IS NULL OR length(trim(username)) > 0);
  END IF;
END $$;

-- =========================================
-- 5. ENABLE ROW LEVEL SECURITY
-- =========================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- =========================================
-- 6. ROW LEVEL SECURITY POLICIES
-- =========================================

-- Users table policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- User profiles table policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Allow public to view profiles for portfolio display
CREATE POLICY "Public can view profiles for portfolios" ON public.user_profiles
  FOR SELECT USING (username IS NOT NULL AND trim(username) != '');

-- Education table policies
CREATE POLICY "Users can view own education" ON public.education
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own education" ON public.education
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own education" ON public.education
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own education" ON public.education
  FOR DELETE USING (auth.uid() = user_id);

-- Public access policy for education table
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
CREATE POLICY "Users can view own experience" ON public.experience
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own experience" ON public.experience
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own experience" ON public.experience
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own experience" ON public.experience
  FOR DELETE USING (auth.uid() = user_id);

-- Public access policy for experience table
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
CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- Public access policy for projects table
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
CREATE POLICY "Users can view own blogs" ON public.blogs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own blogs" ON public.blogs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own blogs" ON public.blogs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own blogs" ON public.blogs
  FOR DELETE USING (auth.uid() = user_id);

-- Public access policy for published blogs in portfolios
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
  INSERT INTO public.users (id, email, full_name, avatar_url, token_identifier)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.id::text
  );

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
CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'portfolio'
  AND auth.role() = 'authenticated'
)
ON CONFLICT (schemaname, tablename, policyname) DO NOTHING;

-- Allow authenticated users to update their own files
CREATE POLICY "Allow authenticated users to update their files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'portfolio'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
ON CONFLICT (schemaname, tablename, policyname) DO NOTHING;

-- Allow authenticated users to delete their own files
CREATE POLICY "Allow authenticated users to delete their files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'portfolio'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
ON CONFLICT (schemaname, tablename, policyname) DO NOTHING;

-- Allow public access to view files (needed for displaying images)
CREATE POLICY "Allow public access to view files" ON storage.objects
FOR SELECT USING (bucket_id = 'portfolio')
ON CONFLICT (schemaname, tablename, policyname) DO NOTHING;

-- =========================================
-- SETUP COMPLETE
-- =========================================

-- You can now run this file in your Supabase SQL Editor or use:
-- supabase db push (if you have the Supabase CLI installed)
--
-- The schema includes:
-- ✅ Users and user profiles management
-- ✅ Education, experience, and projects tracking
-- ✅ Blog system with MDX support
-- ✅ File storage for avatars and project images
-- ✅ Row Level Security policies for data protection
-- ✅ Public portfolio viewing capabilities
-- ✅ Automatic timestamps and slug generation

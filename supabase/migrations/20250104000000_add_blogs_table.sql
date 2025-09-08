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

-- Create index on user_id for faster queries
CREATE INDEX idx_blogs_user_id ON public.blogs(user_id);

-- Create index on slug for faster lookups
CREATE INDEX idx_blogs_slug ON public.blogs(slug);

-- Create index on published for filtering published posts
CREATE INDEX idx_blogs_published ON public.blogs(published);

-- Enable Row Level Security
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for blogs table
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

-- Trigger to automatically update updated_at
CREATE TRIGGER update_blogs_updated_at
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

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

-- Trigger to automatically set published_at
CREATE TRIGGER set_blog_published_at
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW
  EXECUTE FUNCTION set_published_at();

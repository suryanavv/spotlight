-- =========================================
-- DATABASE RESET SCRIPT
-- Completely removes all Spotlight database objects
-- Run this before applying the new schema
-- =========================================

-- =========================================
-- 1. DROP POLICIES (must be done before dropping tables)
-- =========================================

-- Drop storage policies
DROP POLICY IF EXISTS "Allow authenticated users to upload files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update their files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete their files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to view files" ON storage.objects;

-- Drop blogs policies
DROP POLICY IF EXISTS "Users can view own blogs" ON public.blogs;
DROP POLICY IF EXISTS "Users can insert own blogs" ON public.blogs;
DROP POLICY IF EXISTS "Users can update own blogs" ON public.blogs;
DROP POLICY IF EXISTS "Users can delete own blogs" ON public.blogs;
DROP POLICY IF EXISTS "Public can view published blogs for portfolios" ON public.blogs;

-- Drop projects policies
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;
DROP POLICY IF EXISTS "Public can view projects for portfolios" ON public.projects;

-- Drop experience policies
DROP POLICY IF EXISTS "Users can view own experience" ON public.experience;
DROP POLICY IF EXISTS "Users can insert own experience" ON public.experience;
DROP POLICY IF EXISTS "Users can update own experience" ON public.experience;
DROP POLICY IF EXISTS "Users can delete own experience" ON public.experience;
DROP POLICY IF EXISTS "Public can view experience for portfolios" ON public.experience;

-- Drop education policies
DROP POLICY IF EXISTS "Users can view own education" ON public.education;
DROP POLICY IF EXISTS "Users can insert own education" ON public.education;
DROP POLICY IF EXISTS "Users can update own education" ON public.education;
DROP POLICY IF EXISTS "Users can delete own education" ON public.education;
DROP POLICY IF EXISTS "Public can view education for portfolios" ON public.education;

-- Drop user_profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Public can view profiles for portfolios" ON public.user_profiles;

-- =========================================
-- 2. DROP TRIGGERS
-- =========================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_blogs_updated_at ON public.blogs;
DROP TRIGGER IF EXISTS set_blog_published_at ON public.blogs;

-- =========================================
-- 3. DROP FUNCTIONS
-- =========================================

DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS generate_blog_slug(TEXT);
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS set_published_at();

-- =========================================
-- 4. DROP TABLES (with CASCADE to handle foreign keys)
-- =========================================

DROP TABLE IF EXISTS public.blogs CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.experience CASCADE;
DROP TABLE IF EXISTS public.education CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- =========================================
-- 5. DROP INDEXES
-- =========================================

DROP INDEX IF EXISTS idx_user_profiles_username;
DROP INDEX IF EXISTS idx_blogs_user_id;
DROP INDEX IF EXISTS idx_blogs_slug;
DROP INDEX IF EXISTS idx_blogs_published;

-- =========================================
-- 6. DROP STORAGE BUCKET
-- =========================================

DELETE FROM storage.buckets WHERE id = 'portfolio';

-- =========================================
-- 7. CLEANUP COMPLETE
-- =========================================

-- =========================================
-- RESET COMPLETE
-- =========================================

DO $$
BEGIN
  RAISE NOTICE 'Database reset complete! All Spotlight tables, policies, functions, and triggers have been removed.';
  RAISE NOTICE 'You can now run schema.sql to recreate the database from scratch.';
END $$;

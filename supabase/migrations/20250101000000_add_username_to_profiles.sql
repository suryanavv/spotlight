-- Add username field to user_profiles table
ALTER TABLE public.user_profiles
ADD COLUMN username TEXT UNIQUE;

-- Create index on username for faster lookups
CREATE INDEX idx_user_profiles_username ON public.user_profiles(username);

-- Add a constraint to ensure username is not empty when provided
ALTER TABLE public.user_profiles
ADD CONSTRAINT username_not_empty CHECK (username IS NULL OR length(trim(username)) > 0);

-- Update RLS policy to allow public read access for portfolios
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid()::text = id::text);

-- Allow public to view profiles for portfolio display
CREATE POLICY "Public can view profiles for portfolios" ON public.user_profiles
  FOR SELECT USING (username IS NOT NULL AND trim(username) != '');

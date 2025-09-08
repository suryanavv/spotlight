-- Add public access policies for portfolio viewing
-- This allows unauthenticated users to view portfolio content when the user has a username set

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

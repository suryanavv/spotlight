"use client";

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/components/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { queryKeys } from '@/lib/hooks/useQueries';
import type { Project, Education, Experience, Profile, Blog } from '@/types/database';
import { toast } from 'sonner';

export function DashboardDataProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    // Prefetch dashboard data when user enters dashboard area
    if (user) {
      const prefetchData = async () => {
        // Check if data is already in cache and not stale
        const existingData = queryClient.getQueryData(queryKeys.dashboardData(user.id));
        if (existingData) return; // Data already exists, no need to prefetch

        // Prefetch the data
        queryClient.prefetchQuery({
          queryKey: queryKeys.dashboardData(user.id),
          queryFn: async () => {
            try {
              // Execute all queries in parallel for better performance
              const [projectsResult, educationResult, experienceResult, blogsResult, profileResult] = await Promise.allSettled([
                supabase
                  .from('projects')
                  .select('*')
                  .eq('user_id', user.id)
                  .order('created_at', { ascending: false }),
                supabase
                  .from('education')
                  .select('*')
                  .eq('user_id', user.id)
                  .order('end_date', { ascending: false }),
                supabase
                  .from('experience')
                  .select('*')
                  .eq('user_id', user.id)
                  .order('end_date', { ascending: false }),
                supabase
                  .from('blogs')
                  .select('*')
                  .eq('user_id', user.id)
                  .order('created_at', { ascending: false }),
                supabase
                  .from('user_profiles')
                  .select('*')
                  .eq('id', user.id)
                  .single()
              ]);

              // Handle results and extract data with better error handling
              const projects = projectsResult.status === 'fulfilled' && !projectsResult.value.error
                ? projectsResult.value.data as Project[]
                : [];

              const education = educationResult.status === 'fulfilled' && !educationResult.value.error
                ? educationResult.value.data as Education[]
                : [];

              const experience = experienceResult.status === 'fulfilled' && !experienceResult.value.error
                ? experienceResult.value.data as Experience[]
                : [];

              const blogs = blogsResult.status === 'fulfilled' && !blogsResult.value.error
                ? blogsResult.value.data as Blog[]
                : [];

              const profile = profileResult.status === 'fulfilled' && !profileResult.value.error
                ? profileResult.value.data as unknown as Profile
                : null;

              // Log any errors for debugging
              if (projectsResult.status === 'rejected') {
                console.warn('Failed to fetch projects:', projectsResult.reason);
              }
              if (educationResult.status === 'rejected') {
                console.warn('Failed to fetch education:', educationResult.reason);
              }
              if (experienceResult.status === 'rejected') {
                console.warn('Failed to fetch experience:', experienceResult.reason);
              }
              if (blogsResult.status === 'rejected') {
                console.warn('Failed to fetch blogs:', blogsResult.reason);
              }
              if (profileResult.status === 'rejected') {
                console.warn('Failed to fetch profile:', profileResult.reason);
              }

              return {
                projects,
                education,
                experience,
                blogs,
                profile,
              };
            } catch (error) {
              console.error('Error prefetching dashboard data:', error);
              // Return empty data on error to prevent crashes
              return {
                projects: [],
                education: [],
                experience: [],
                blogs: [],
                profile: null,
              };
            }
          },
          staleTime: 30 * 60 * 1000, // 30 minutes
          gcTime: 60 * 60 * 1000, // 1 hour
        });
      };

      prefetchData();
    }
  }, [user, queryClient]);

  return <>{children}</>;
} 
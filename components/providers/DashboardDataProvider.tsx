"use client";

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/nextjs';
import { useClerkSupabaseClient } from '@/integrations/supabase/client';
import { queryKeys } from '@/lib/hooks/useQueries';
import type { Project, Education, Experience, Profile } from '@/types/database';

export function DashboardDataProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const supabase = useClerkSupabaseClient();

  useEffect(() => {
    // Prefetch dashboard data when user enters dashboard area
    if (user && supabase) {
      const prefetchData = async () => {
        // Check if data is already in cache and not stale
        const existingData = queryClient.getQueryData(queryKeys.dashboardData(user.id));
        if (existingData) return; // Data already exists, no need to prefetch

        // Prefetch the data
        queryClient.prefetchQuery({
          queryKey: queryKeys.dashboardData(user.id),
          queryFn: async () => {
            // Execute all queries in parallel for better performance
            const [projectsResult, educationResult, experienceResult, profileResult] = await Promise.allSettled([
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
                .from('user_profiles')
                .select('*')
                .eq('id', user.id)
                .single()
            ]);

            // Handle results and extract data
            const projects = projectsResult.status === 'fulfilled' && !projectsResult.value.error 
              ? projectsResult.value.data as Project[] 
              : [];
            
            const education = educationResult.status === 'fulfilled' && !educationResult.value.error
              ? educationResult.value.data as Education[]
              : [];
            
            const experience = experienceResult.status === 'fulfilled' && !experienceResult.value.error
              ? experienceResult.value.data as Experience[]
              : [];
            
            const profile = profileResult.status === 'fulfilled' && !profileResult.value.error
              ? profileResult.value.data as Profile
              : null;

            return {
              projects,
              education,
              experience,
              profile,
            };
          },
          staleTime: 30 * 60 * 1000, // 30 minutes
        });
      };

      prefetchData();
    }
  }, [user, supabase, queryClient]);

  return <>{children}</>;
} 
"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/components/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import type { Project, Education, Experience, Profile, Blog } from '@/types/database';
import { toast } from 'sonner';

// Query Keys for consistent caching
export const queryKeys = {
  // Use a single key for all dashboard data to ensure single fetch
  dashboardData: (userId: string) => ['dashboard-data', userId],
} as const;

// Combined Dashboard Data Hook - Fetches ALL data at once
export function useDashboardData() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.dashboardData(user?.id || ''),
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
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

      const blogs = blogsResult.status === 'fulfilled' && !blogsResult.value.error
        ? blogsResult.value.data as Blog[]
        : [];

      const profile = profileResult.status === 'fulfilled' && !profileResult.value.error
        ? profileResult.value.data as unknown as Profile
        : null;

      return {
        projects,
        education,
        experience,
        blogs,
        profile,
      };
    },
    enabled: !!user,
    staleTime: 30 * 60 * 1000, // 30 minutes - longer for dashboard data since it doesn't change frequently
  });

  // Manual refresh function for explicit user refresh
  const refresh = () => {
    if (user) {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardData(user.id) });
    }
  };

  // Check if we have any cached data
  const existingData = queryClient.getQueryData(queryKeys.dashboardData(user?.id || ''));
  
  return {
    ...query,
    refresh,
    // Show skeleton only when there's no cached data and we're loading
    isInitialLoading: query.isLoading && !existingData,
    // Show content with cached data even if refetching
    hasData: !!existingData || !!query.data,
  };
}

// Individual data selectors that use the combined data
export function useProjects() {
  const { data, isLoading, error, isInitialLoading, hasData } = useDashboardData();

  return {
    data: data?.projects || [],
    isLoading,
    error,
    isInitialLoading,
    hasData,
  };
}

export function useEducation() {
  const { data, isLoading, error, isInitialLoading, hasData } = useDashboardData();

  return {
    data: data?.education || [],
    isLoading,
    error,
    isInitialLoading,
    hasData,
  };
}

export function useExperience() {
  const { data, isLoading, error, isInitialLoading, hasData } = useDashboardData();

  return {
    data: data?.experience || [],
    isLoading,
    error,
    isInitialLoading,
    hasData,
  };
}

export function useBlogs() {
  const { data, isLoading, error, isInitialLoading, hasData } = useDashboardData();

  return {
    data: data?.blogs || [],
    isLoading,
    error,
    isInitialLoading,
    hasData,
  };
}

export function useProfile() {
  const { data, isLoading, error, isInitialLoading, hasData } = useDashboardData();

  return {
    data: data?.profile || null,
    isLoading,
    error,
    isInitialLoading,
    hasData,
  };
}

// Mutation Hooks for Cache Invalidation

// Project Mutations
export function useProjectMutations() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const createProject = useMutation({
    mutationFn: async (projectData: Omit<Project, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('projects').insert([projectData]).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate only the combined dashboard data
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardData(user?.id || '') });
      toast.success('Project added!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error adding project');
    },
  });

  const updateProject = useMutation({
    mutationFn: async ({ id, ...projectData }: Partial<Project> & { id: string }) => {
      const { data, error } = await supabase.from('projects').update(projectData).eq('id', id).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardData(user?.id || '') });
      toast.success('Project updated!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error updating project');
    },
  });

  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardData(user?.id || '') });
      toast.success('Project deleted!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error deleting project');
    },
  });

  return { createProject, updateProject, deleteProject };
}

// Education Mutations
export function useEducationMutations() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const createEducation = useMutation({
    mutationFn: async (educationData: Omit<Education, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase.from('education').insert([educationData]).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardData(user?.id || '') });
      toast.success('Education added!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error adding education');
    },
  });

  const updateEducation = useMutation({
    mutationFn: async ({ id, ...educationData }: Partial<Education> & { id: string }) => {
      const { data, error } = await supabase.from('education').update(educationData).eq('id', id).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardData(user?.id || '') });
      toast.success('Education updated!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error updating education');
    },
  });

  const deleteEducation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('education').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardData(user?.id || '') });
      toast.success('Education deleted!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error deleting education');
    },
  });

  return { createEducation, updateEducation, deleteEducation };
}

// Experience Mutations
export function useExperienceMutations() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const createExperience = useMutation({
    mutationFn: async (experienceData: Omit<Experience, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase.from('experience').insert([experienceData]).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardData(user?.id || '') });
      toast.success('Experience added!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error adding experience');
    },
  });

  const updateExperience = useMutation({
    mutationFn: async ({ id, ...experienceData }: Partial<Experience> & { id: string }) => {
      const { data, error } = await supabase.from('experience').update(experienceData).eq('id', id).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardData(user?.id || '') });
      toast.success('Experience updated!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error updating experience');
    },
  });

  const deleteExperience = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('experience').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardData(user?.id || '') });
      toast.success('Experience deleted!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error deleting experience');
    },
  });

  return { createExperience, updateExperience, deleteExperience };
}

// Profile Mutations
export function useProfileMutations() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const updateProfile = useMutation({
    mutationFn: async (profileData: Partial<Profile>) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Invalidate the dashboard data to refetch everything
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardData(user?.id || '') });
      
      // Also, update the specific profile data in the cache immediately
      queryClient.setQueryData(queryKeys.dashboardData(user?.id || ''), (oldData: unknown) => {
        const currentData = oldData as { projects?: Project[]; education?: Education[]; experience?: Experience[]; profile?: Profile } | undefined;
        return currentData ? { ...currentData, profile: data } : { profile: data };
      });

      toast.success('Profile updated!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error updating profile');
    },
  });

  return { updateProfile };
}

// Blog Mutations
export function useBlogMutations() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const createBlog = useMutation({
    mutationFn: async (blogData: Omit<Blog, 'id' | 'created_at' | 'updated_at' | 'published_at'>) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase.from('blogs').insert([blogData]).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardData(user?.id || '') });
      toast.success('Blog post created!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error creating blog post');
    },
  });

  const updateBlog = useMutation({
    mutationFn: async ({ id, ...blogData }: Partial<Blog> & { id: string }) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase.from('blogs').update(blogData).eq('id', id).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardData(user?.id || '') });
      toast.success('Blog post updated!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error updating blog post');
    },
  });

  const deleteBlog = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase.from('blogs').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardData(user?.id || '') });
      toast.success('Blog post deleted!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error deleting blog post');
    },
  });

  return { createBlog, updateBlog, deleteBlog };
} 
import { supabase } from './client'
import type { Project, Education, Experience, Profile, Blog } from './types'

// Dashboard data fetching - single query for all data
export async function getDashboardData(): Promise<{
  projects: Project[]
  education: Education[]
  experience: Experience[]
  blogs: Blog[]
  profile: Profile | null
} | { error: Error }> {
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: authError || new Error('Not authenticated') }
  }

  // Fetch all data in parallel for optimal performance
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
      .order('start_date', { ascending: false }),
    supabase
      .from('experience')
      .select('*')
      .eq('user_id', user.id)
      .order('start_date', { ascending: false }),
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
  ])

  const projects = projectsResult.status === 'fulfilled' && !projectsResult.value.error
    ? projectsResult.value.data || []
    : []

  const education = educationResult.status === 'fulfilled' && !educationResult.value.error
    ? educationResult.value.data || []
    : []

  const experience = experienceResult.status === 'fulfilled' && !experienceResult.value.error
    ? experienceResult.value.data || []
    : []

  const blogs = blogsResult.status === 'fulfilled' && !blogsResult.value.error
    ? blogsResult.value.data || []
    : []

  const profile = profileResult.status === 'fulfilled' && !profileResult.value.error
    ? profileResult.value.data
    : null

  return {
    projects,
    education,
    experience,
    blogs,
    profile,
  }
}

// Dashboard counts fetching - only counts for faster loading
export async function getDashboardCounts(): Promise<{
  projects: number
  education: number
  experience: number
  blogs: number
  hasProfile: boolean
} | { error: Error }> {
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: authError || new Error('Not authenticated') }
  }

  // Fetch only counts in parallel for optimal performance
  const [projectsCount, educationCount, experienceCount, blogsCount, profileResult] = await Promise.allSettled([
    supabase
      .from('projects')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabase
      .from('education')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabase
      .from('experience')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabase
      .from('blogs')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabase
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .single()
  ])

  const projects = projectsCount.status === 'fulfilled' && !projectsCount.value.error
    ? projectsCount.value.count || 0
    : 0

  const education = educationCount.status === 'fulfilled' && !educationCount.value.error
    ? educationCount.value.count || 0
    : 0

  const experience = experienceCount.status === 'fulfilled' && !experienceCount.value.error
    ? experienceCount.value.count || 0
    : 0

  const blogs = blogsCount.status === 'fulfilled' && !blogsCount.value.error
    ? blogsCount.value.count || 0
    : 0

  const hasProfile = profileResult.status === 'fulfilled' && !profileResult.value.error

  return {
    projects,
    education,
    experience,
    blogs,
    hasProfile,
  }
}

// Profile actions
export async function updateProfile(profileData: Partial<Profile>) {
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: authError || new Error('Not authenticated') }
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .upsert({ ...profileData, id: user.id })
    .select()
    .single()

  if (error) return { error }

  return { data }
}

// Project actions
export async function createProject(projectData: Omit<Project, 'id' | 'user_id' | 'created_at'>) {
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: authError || new Error('Not authenticated') }
  }

  const { data: project, error } = await supabase
    .from('projects')
    .insert({ ...projectData, user_id: user.id })
    .select()
    .single()

  if (error) return { error }

  return { data: project }
}

export async function updateProject(id: string, projectData: Partial<Project>) {
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: authError || new Error('Not authenticated') }
  }

  const { data: project, error } = await supabase
    .from('projects')
    .update(projectData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return { error }

  return { data: project }
}

export async function deleteProject(id: string) {
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: authError || new Error('Not authenticated') }
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error }

  return { success: true }
}

// Education actions
export async function createEducation(educationData: Omit<Education, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: authError || new Error('Not authenticated') }
  }

  const { data: education, error } = await supabase
    .from('education')
    .insert({ ...educationData, user_id: user.id })
    .select()
    .single()

  if (error) return { error }

  return { data: education }
}

export async function updateEducation(id: string, educationData: Partial<Education>) {
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: authError || new Error('Not authenticated') }
  }

  const { data: education, error } = await supabase
    .from('education')
    .update({ ...educationData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return { error }

  return { data: education }
}

export async function deleteEducation(id: string) {
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: authError || new Error('Not authenticated') }
  }

  const { error } = await supabase
    .from('education')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error }

  return { success: true }
}

// Experience actions
export async function createExperience(experienceData: Omit<Experience, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: authError || new Error('Not authenticated') }
  }

  const { data: experience, error } = await supabase
    .from('experience')
    .insert({ ...experienceData, user_id: user.id })
    .select()
    .single()

  if (error) return { error }

  return { data: experience }
}

export async function updateExperience(id: string, experienceData: Partial<Experience>) {
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: authError || new Error('Not authenticated') }
  }

  const { data: experience, error } = await supabase
    .from('experience')
    .update({ ...experienceData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return { error }

  return { data: experience }
}

export async function deleteExperience(id: string) {
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: authError || new Error('Not authenticated') }
  }

  const { error } = await supabase
    .from('experience')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error }

  return { success: true }
}

// Blog actions
export async function createBlog(blogData: Omit<Blog, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: authError || new Error('Not authenticated') }
  }

  const { data: blog, error } = await supabase
    .from('blogs')
    .insert({ ...blogData, user_id: user.id })
    .select()
    .single()

  if (error) return { error }

  return { data: blog }
}

export async function updateBlog(id: string, blogData: Partial<Blog>) {
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: authError || new Error('Not authenticated') }
  }

  const { data: blog, error } = await supabase
    .from('blogs')
    .update({ ...blogData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return { error }

  return { data: blog }
}

export async function deleteBlog(id: string) {
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: authError || new Error('Not authenticated') }
  }

  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error }

  return { success: true }
}

// Portfolio data fetching (public)
export async function getPortfolioData(username: string) {

  // Get profile by username
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (profileError || !profile) {
    return { error: profileError || new Error('Profile not found') }
  }

  // Fetch all portfolio data in parallel
  const [projectsResult, educationResult, experienceResult, blogsResult] = await Promise.allSettled([
    supabase
      .from('projects')
      .select('*')
      .eq('user_id', profile.id)
      .eq('published', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('education')
      .select('*')
      .eq('user_id', profile.id)
      .order('start_date', { ascending: false }),
    supabase
      .from('experience')
      .select('*')
      .eq('user_id', profile.id)
      .order('start_date', { ascending: false }),
    supabase
      .from('blogs')
      .select('*')
      .eq('user_id', profile.id)
      .eq('published', true)
      .order('created_at', { ascending: false })
  ])

  const projects = projectsResult.status === 'fulfilled' && !projectsResult.value.error
    ? projectsResult.value.data || []
    : []

  const education = educationResult.status === 'fulfilled' && !educationResult.value.error
    ? educationResult.value.data || []
    : []

  const experience = experienceResult.status === 'fulfilled' && !experienceResult.value.error
    ? experienceResult.value.data || []
    : []

  const blogs = blogsResult.status === 'fulfilled' && !blogsResult.value.error
    ? blogsResult.value.data || []
    : []

  return {
    profile,
    projects,
    education,
    experience,
    blogs,
  }
}

"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from '@/components/providers/AuthProvider'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/hooks/useQueries'
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Upload, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { createClient } from "@supabase/supabase-js"
import { ProfileSettingsSkeleton } from '@/components/ui/skeletons'
import { useProfile, useProfileMutations } from "@/lib/hooks/useQueries"

export default function ProfileSettings() {
  const { user, loading: authLoading } = useAuth()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)
  const [removingAvatar, setRemovingAvatar] = useState(false)

  // Use React Query hooks
  const { data: profile, isInitialLoading, hasData, error } = useProfile()
  const { updateProfile } = useProfileMutations()

  const [formData, setFormData] = useState({
    full_name: "",
    headline: "",
    bio: "",
    location: "",
    website: "",
    github: "",
    linkedin: "",
    twitter: "",
    avatar_url: "",
  })

  // Move functions to top to fix hoisting errors
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !supabase) return

    setLoading(true)
    try {
      const profileData = {
        ...formData,
        id: user.id,
        updated_at: new Date().toISOString(),
      };

      // Use the new mutation hook
      await updateProfile.mutateAsync(profileData);
    } catch (error: unknown) {
      // Error handling is done in the mutation hook
      console.error('Error submitting profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploadingAvatar(true)
    try {
      // Create a unique file name
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage.from("portfolio").upload(filePath, file)

      if (uploadError) throw uploadError

      // Get the public URL
      const { data: publicUrlData } = supabase.storage.from("portfolio").getPublicUrl(filePath)

      // Update the profile with the new avatar URL
      const avatarUrl = publicUrlData.publicUrl

      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({ 
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (updateError) throw updateError

      // Update local state and refresh profile
      setFormData((prev) => ({ ...prev, avatar_url: avatarUrl }))
      toast.success("Profile picture updated!")

      // Invalidate the dashboard data cache to reflect profile changes
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardData(user.id) })
    } catch (error: unknown) {

      if (error && typeof error === 'object' && 'message' in error) {
        toast.error("Error uploading avatar: " + (error as { message?: string }).message)
      } else {
        toast.error("Error uploading avatar")
      }
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleRemoveAvatar = async () => {
    if (!user) return
    setRemovingAvatar(true)
    try {
      // Remove avatar_url from profile
      const { error } = await supabase
        .from("user_profiles")
        .update({ 
          avatar_url: "",
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
      if (error) throw error
      setFormData((prev) => ({ ...prev, avatar_url: "" }))
      toast.success("Profile photo removed!")
      setShowRemoveDialog(false)

      // Invalidate the dashboard data cache to reflect profile changes
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardData(user.id) })
    } catch (error: unknown) {

      if (error && typeof error === 'object' && 'message' in error) {
        toast.error("Error removing profile photo: " + (error as { message?: string }).message)
      } else {
        toast.error("Error removing profile photo")
      }
    } finally {
      setRemovingAvatar(false)
    }
  }

  useEffect(() => {
    if (!user) return;

    async function initializeProfile() {
      if (!user?.id) return;
      
      setPageLoading(true);
      try {
        // First, try to fetch existing profile
        const { data: existingProfile, error: fetchError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching user profile:', fetchError);
          toast.error('Error loading profile');
          return;
        }

        if (existingProfile) {
          // Profile exists, use it
          setFormData({
            full_name: existingProfile.full_name || '',
            headline: existingProfile.headline || '',
            bio: existingProfile.bio || '',
            location: existingProfile.location || '',
            website: existingProfile.website || '',
            github: existingProfile.github || '',
            linkedin: existingProfile.linkedin || '',
            twitter: existingProfile.twitter || '',
            avatar_url: existingProfile.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
          });
        } else {
          // Profile doesn't exist, create it with auth user data as defaults
          const defaultProfile = {
            id: user.id,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '',
            headline: '',
            bio: '',
            location: '',
            website: '',
            github: '',
            linkedin: '',
            twitter: '',
            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          // Use upsert to handle race conditions where profile might be created by another process
          const { error: upsertError } = await supabase
            .from('user_profiles')
            .upsert([defaultProfile], {
              onConflict: 'id',
              ignoreDuplicates: false
            });

          if (upsertError) {
            // Only show error if it's not a duplicate key constraint
            if (!upsertError.message.includes('duplicate key') && 
                !upsertError.message.includes('unique constraint')) {
              console.error('Error creating user profile:', upsertError);
              toast.error('Error creating profile: ' + upsertError.message);
            } else {
              // If it's a duplicate key error, the profile was already created elsewhere
              console.log('Profile already exists, which is expected in some cases');
            }
          }
          // Profile creation success is silent - no toast needed

          // Set form data with defaults
          setFormData({
            full_name: defaultProfile.full_name,
            headline: defaultProfile.headline,
            bio: defaultProfile.bio,
            location: defaultProfile.location,
            website: defaultProfile.website,
            github: defaultProfile.github,
            linkedin: defaultProfile.linkedin,
            twitter: defaultProfile.twitter,
            avatar_url: defaultProfile.avatar_url,
          });
        }
      } catch (error) {
        toast.error('Error loading profile');
      } finally {
        setPageLoading(false);
      }
    }

    initializeProfile();
  }, [user, profile, authLoading]);

  // Show a skeleton while the initial data is loading and we don't have any cached data
  if ((isInitialLoading && !hasData) || authLoading) {
    return <ProfileSettingsSkeleton />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load profile</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()} 
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 mt-16 md:mt-0 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium">Profile Settings</h1>
      </div>
      <Card className="border border-gray-200 shadow-none">
        <CardHeader>
          <CardTitle className="text-lg font-medium"></CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
              <motion.div
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Avatar className="w-24 h-24 border-2 border-gray-200">
                  <AvatarImage src={formData.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl bg-gray-100 text-gray-500">
                    {formData.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="relative flex flex-col gap-2 items-center mt-2">
                  <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleAvatarChange}
                    disabled={uploadingAvatar}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="default"
                    className="h-7 rounded-full text-black bg-gray-50 hover:bg-gray-100 px-3 text-xs"
                    title="Change photo"
                    onClick={() => document.getElementById('avatar')?.click()}
                    disabled={uploadingAvatar}
                    aria-label="Change profile photo"
                  >
                    {uploadingAvatar ? (
                      "Uploading..."
                    ) : (
                      <>
                        <Upload size={14} className="mr-1" /> Change Photo
                      </>
                    )}
                  </Button>
                  {formData.avatar_url && (
                    <Button
                      type="button"
                      size="sm"
                      variant="default"
                      className="h-7 rounded-full text-red-500 bg-red-50 hover:bg-red-100 px-3 text-xs"
                      title="Remove photo"
                      onClick={() => setShowRemoveDialog(true)}
                      disabled={uploadingAvatar || removingAvatar}
                      aria-label="Remove profile photo"
                    >
                      <Trash2 size={14} className="mr-1" /> Remove Photo
                    </Button>
                  )}
                </div>
              </motion.div>

              <div className="flex-1 w-full space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="border-gray-200 focus:border-black focus:ring-black"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="headline">Professional Title</Label>
                    <Input
                      id="headline"
                      name="headline"
                      value={formData.headline}
                      onChange={handleChange}
                      placeholder="Full Stack Developer"
                      className="border-gray-200 focus:border-black focus:ring-black"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Write a short bio about yourself..."
                    rows={4}
                    className="border-gray-200 focus:border-black focus:ring-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="San Francisco, CA"
                    className="border-gray-200 focus:border-black focus:ring-black"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Social Media & Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Personal Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                    type="url"
                    className="border-gray-200 focus:border-black focus:ring-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                    type="url"
                    className="border-gray-200 focus:border-black focus:ring-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                    type="url"
                    className="border-gray-200 focus:border-black focus:ring-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    placeholder="https://twitter.com/username"
                    type="url"
                    className="border-gray-200 focus:border-black focus:ring-black"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="default" disabled={uploadingAvatar || loading} size="sm" className="rounded-full">
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Remove Photo Confirmation Dialog */}
      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent className="max-w-xs p-6 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-base">Remove Profile Photo?</DialogTitle>
            <DialogDescription>
              This will delete your current profile photo and revert to the default avatar.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              variant="destructive"
              className="h-7 rounded-full px-3 text-xs hover:bg-red-400 hover:text-gray-400 order-1 sm:order-2"
              onClick={handleRemoveAvatar}
              disabled={removingAvatar}
            >
              {removingAvatar ? "Removing..." : "Remove"}
            </Button>
            <Button
              variant="ghost"
              className="h-7 rounded-full px-3 text-xs hover:bg-muted order-2 sm:order-1"
              onClick={() => setShowRemoveDialog(false)}
              disabled={removingAvatar}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

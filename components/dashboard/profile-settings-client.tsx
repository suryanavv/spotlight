"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/supabase/client"
import { useAuth } from '@/supabase/auth'
import { useDashboardData } from '../../app/(dashboard)/dashboard/dashboard-shell'
import { updateProfile } from '@/supabase/client-actions'
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { IconUpload, IconTrash } from "@tabler/icons-react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

export default function ProfileSettingsClient() {
  const { user, loading: authLoading } = useAuth()
  const dashboardData = useDashboardData()
  const [loading, setLoading] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)
  const [removingAvatar, setRemovingAvatar] = useState(false)
  const [usernameError, setUsernameError] = useState("")
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [usernameTimeout, setUsernameTimeout] = useState<NodeJS.Timeout | null>(null)

  const profile = dashboardData?.profile

  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    headline: "",
    bio: "",
    location: "",
    website: "",
    github: "",
    linkedin: "",
    twitter: "",
    avatar_url: "",
  })

  // Username validation function
  const validateUsername = (username: string) => {
    if (!username) return "Username is required"
    if (username.length < 3) return "Username must be at least 3 characters"
    if (username.length > 30) return "Username must be less than 30 characters"
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) return "Username can only contain letters, numbers, hyphens, and underscores"
    return null
  }

  // Check username uniqueness
  const checkUsernameAvailability = async (username: string) => {
    if (!username || username === profile?.username) return

    const validationError = validateUsername(username)
    if (validationError) {
      setUsernameError(validationError)
      return
    }

    setCheckingUsername(true)
    try {
      if (!user?.id) {
        setUsernameError("User not found")
        return
      }

      if (!supabase) {
        setUsernameError("Database connection not available")
        return
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('username')
        .eq('username', username)
        .neq('id', user.id) // Exclude current user's profile
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        setUsernameError("Error checking username availability")
      } else if (data) {
        setUsernameError("This username is already taken")
      } else {
        setUsernameError("")
      }
    } catch (error) {
      setUsernameError("Error checking username availability")
    } finally {
      setCheckingUsername(false)
    }
  }

  // Move functions to top to fix hoisting errors
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === 'username') {
      // Clear error when user starts typing
      setUsernameError("")

      // Clear existing timeout
      if (usernameTimeout) {
        clearTimeout(usernameTimeout)
      }

      // Set new timeout for debounced validation
      const timeout = setTimeout(() => {
        if (value && value !== profile?.username) {
          checkUsernameAvailability(value)
        }
      }, 1000) // 1 second delay

      setUsernameTimeout(timeout)
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !supabase) return

    // Validate username before submission
    if (formData.username) {
      const validationError = validateUsername(formData.username)
      if (validationError) {
        setUsernameError(validationError)
        return
      }

      // Check username availability if it's changed
      if (formData.username !== profile?.username) {
        await checkUsernameAvailability(formData.username)
        if (usernameError) {
          return
        }
      }
    }

    setLoading(true)
    try {
      const profileData = {
        ...formData,
        updated_at: new Date().toISOString(),
      };

      // Use the server action
      const result = await updateProfile(profileData);

      if (result.error) {
        toast.error('Failed to update profile');
        console.error('Error updating profile:', result.error);
      } else {
        toast.success('Profile updated successfully!');
      }
    } catch (error: unknown) {
      toast.error('Failed to update profile');
      console.error('Error submitting profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user || !supabase) return

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

      // Update local state
      setFormData((prev) => ({ ...prev, avatar_url: avatarUrl }))
      toast.success("Profile picture updated!")

      // Note: Server action will revalidate paths automatically
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
    if (!user || !supabase) return
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

      // Note: Server action will revalidate paths automatically
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

  // Initialize form data when profile data is available
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        headline: profile.headline || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        github: profile.github || '',
        linkedin: profile.linkedin || '',
        twitter: profile.twitter || '',
        avatar_url: profile.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture || '',
      });
    } else if (user && !profile) {
      // If no profile exists yet, use auth user data as defaults
      setFormData({
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '',
        username: '',
        headline: '',
        bio: '',
        location: '',
        website: '',
        github: '',
        linkedin: '',
        twitter: '',
        avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
      });
    }
  }, [profile, user]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (usernameTimeout) {
        clearTimeout(usernameTimeout)
      }
    }
  }, [usernameTimeout])

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
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
                    className="h-7 rounded-full text-black bg-gray-50 hover:bg-gray-100 px-3 text-xs cursor-pointer"
                    title="Change photo"
                    onClick={() => document.getElementById('avatar')?.click()}
                    disabled={uploadingAvatar}
                    aria-label="Change profile photo"
                  >
                    {uploadingAvatar ? (
                      "Uploading..."
                    ) : (
                      <>
                        <IconUpload size={14} className="mr-1" /> Change Photo
                      </>
                    )}
                  </Button>
                  {formData.avatar_url && (
                    <Button
                      type="button"
                      size="sm"
                      variant="default"
                      className="h-7 rounded-full text-red-500 bg-red-50 hover:bg-red-100 px-3 text-xs cursor-pointer"
                      title="Remove photo"
                      onClick={() => setShowRemoveDialog(true)}
                      disabled={uploadingAvatar || removingAvatar}
                      aria-label="Remove profile photo"
                    >
                      <IconTrash size={14} className="mr-1" /> Remove Photo
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
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="johndoe"
                      className={`border-gray-200 focus:border-black focus:ring-black ${
                        usernameError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      disabled={checkingUsername}
                    />
                    <div className="text-xs">
                      {checkingUsername ? (
                        <span className="text-blue-600">Checking availability...</span>
                      ) : usernameError ? (
                        <span className="text-red-600">{usernameError}</span>
                      ) : (
                        <span className="text-muted-foreground">
                          This will be your portfolio URL: /{formData.username || 'username'}
                        </span>
                      )}
                    </div>
                  </div>
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
              <Button type="submit" variant="default" disabled={uploadingAvatar || loading} size="sm" className="rounded-full cursor-pointer">
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

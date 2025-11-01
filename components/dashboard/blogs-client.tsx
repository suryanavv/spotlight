"use client"

import { useState, useEffect } from "react"
import { useAuth } from '@/supabase/auth'
import { useDashboardData } from '../../app/(dashboard)/dashboard/dashboard-shell'
import { createBlog, updateBlog, deleteBlog } from '@/supabase/client-actions'
import type { Blog } from "@/supabase/types"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { IconPencil, IconTrash, IconPlus, IconBook, IconEye, IconEyeOff, IconX } from "@tabler/icons-react"
import { motion } from "framer-motion"

export default function BlogsClient() {
  const { user } = useAuth()
  const dashboardData = useDashboardData()

  // Get preloaded blogs data from context
  const blogs = dashboardData?.blogs || []
  const loading = !dashboardData

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    published: false,
  });

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  const handleOpenDialog = (blog: Blog | null = null) => {
    // Close any existing inline forms first
    setShowInlineForm(false)
    setEditingBlog(null)

    // Then set up the new form
    if (blog) {
      setEditingBlog(blog)
      setFormData({
        title: blog.title,
        excerpt: blog.excerpt || "",
        content: blog.content,
        published: blog.published || false,
      })
    } else {
      setEditingBlog(null)
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        published: false,
      })
    }

    if (isMobile) {
      setShowInlineForm(true);
    } else {
      setDialogOpen(true);
    }
  }

  const handleCloseForm = () => {
    setDialogOpen(false);
    setShowInlineForm(false);
    setEditingBlog(null);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      published: checked
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    // Basic validation
    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }
    if (!formData.content.trim()) {
      toast.error('Content is required')
      return
    }

    try {
      const blogData = {
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim() || null,
        content: formData.content.trim(),
        published: formData.published,
        published_at: formData.published ? new Date().toISOString() : null,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-'),
      }

      if (editingBlog) {
        const result = await updateBlog(editingBlog.id, blogData)
        if (result.error) {
          toast.error('Failed to update blog')
          console.error('Error updating blog:', result.error)
          return
        } else {
          toast.success('Blog updated successfully!')
        }
      } else {
        const result = await createBlog(blogData)
        if (result.error) {
          toast.error('Failed to create blog')
          console.error('Error creating blog:', result.error)
          return
        } else {
          toast.success('Blog created successfully!')
        }
      }

      handleCloseForm()
    } catch (error: unknown) {
      // Error handling is done in the mutation hooks
      console.error('Error submitting blog:', error)
    }
  }

  const handleDelete = (id: string) => {
    setDeletingId(id)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!deletingId) return
    try {
      const result = await deleteBlog(deletingId)
      if (result.error) {
        toast.error('Failed to delete blog')
        console.error('Error deleting blog:', result.error)
      } else {
        toast.success('Blog deleted successfully!')
        setShowDeleteDialog(false)
        setDeletingId(null)
      }
    } catch (error: unknown) {
      toast.error('Failed to delete blog')
      console.error('Error deleting blog:', error)
    }
  }

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isMobile && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">
            {editingBlog ? "Edit Blog Post" : "Add Blog Post"}
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleCloseForm}
            className="h-8 w-8 rounded-full"
          >
            <IconX size={14} />
          </Button>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title" className="text-xs">
          Title *
        </Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Blog post title"
          required
          className="h-9 rounded-md border-gray-200 text-sm focus:border-black focus:ring-black"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt" className="text-xs">
          Excerpt (Optional)
        </Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          placeholder="Brief description of the blog post"
          rows={3}
          className="rounded-md border-gray-200 text-sm focus:border-black focus:ring-black resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content" className="text-xs">
          Content (MDX) *
        </Label>
        <Textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Write your blog post content in MDX format..."
          rows={12}
          required
          className="rounded-md border-gray-200 text-sm focus:border-black focus:ring-black font-mono"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="published" checked={formData.published} onCheckedChange={handleSwitchChange} />
        <Label htmlFor="published" className="text-xs">
          Publish blog post
        </Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCloseForm}
          className="h-8 rounded-full border-gray-200 px-3 text-xs touch-manipulation cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={false}
          className="h-8 rounded-full px-3 text-xs touch-manipulation"
        >
          {editingBlog ? "Update" : "Add"} Blog Post
        </Button>
      </div>
    </form>
  )

  // Show loading state while data is being preloaded
  if (loading) {
    return (
      <div className="space-y-4 mt-16 md:mt-0 pt-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-7 w-24" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-16 md:mt-0 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium">Blog Posts</h1>
        <Button
          variant="outline"
          onClick={() => handleOpenDialog()}
          className="h-7 rounded-full border-gray-200 px-3 text-xs hover:bg-gray-50 hover:text-black touch-manipulation"
        >
          <IconPlus className="mr-1.5 h-3.5 w-3.5" />
          Add Post
        </Button>
      </div>

      {isMobile && showInlineForm && !editingBlog && (
        <Card className="border-gray-200 shadow-none">
          <CardContent className="p-4">
            {renderForm()}
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {blogs.length === 0 ? (
          <motion.div
            className="rounded-lg border border-gray-200 bg-gray-50 py-10 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <IconBook size={20} className="text-gray-400" />
            </div>
            <h3 className="text-sm font-medium">No blog posts yet</h3>
            <p className="mt-1 text-xs text-gray-500">Create your first blog post to share your thoughts and ideas.</p>
            <Button className="mt-3 h-7 rounded-full px-3 text-xs touch-manipulation" variant="outline" onClick={() => handleOpenDialog()}>
              <IconPlus className="mr-1.5 h-3.5 w-3.5" />
              Add Post
            </Button>
          </motion.div>
        ) : (
          blogs.map((blog, index) => {
            const isBeingEdited = isMobile && editingBlog?.id === blog.id && showInlineForm;

            if (isBeingEdited) {
              return (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="border-gray-200 shadow-none">
                    <CardContent className="p-4">
                      {renderForm()}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="border-gray-200 shadow-none transition-shadow duration-200 hover:shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-start justify-between text-sm font-medium">
                      <div>
                        <div>{blog.title}</div>
                        <div className="mt-1 text-xs font-normal text-gray-500">
                          {blog.published_at ? `Published ${new Date(blog.published_at).toLocaleDateString()}` : 'Draft'}
                        </div>
                      </div>
                      {blog.published ? (
                        <IconEye size={14} className="text-green-500 ml-2" />
                      ) : (
                        <IconEyeOff size={14} className="text-gray-400 ml-2" />
                      )}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    {blog.excerpt ? (
                      <p className="whitespace-pre-line text-xs text-gray-600">{blog.excerpt}</p>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No excerpt provided</p>
                    )}
                  </CardContent>

                  <CardFooter className="flex justify-end border-t border-gray-100 p-3">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenDialog(blog)}
                        className="h-7 rounded-full px-3 text-xs touch-manipulation cursor-pointer"
                      >
                        <IconPencil size={14} className="mr-1"/>Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(blog.id)}
                        className="h-7 rounded-full px-3 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 touch-manipulation"
                      >
                        <IconTrash size={14} className="mr-1"/>Delete
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="md:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-sm font-medium">
              {editingBlog ? "Edit Blog Post" : "Add New Blog Post"}
            </DialogTitle>
          </DialogHeader>
          {renderForm()}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-xs p-6 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-base">Delete Blog Post?</DialogTitle>
            <DialogDescription>
              This will permanently delete this blog post. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              variant="default"
              className="h-7 rounded-full px-3 text-xs bg-red-500 hover:bg-red-900 hover:text-gray-400 order-1 sm:order-2"
              onClick={confirmDelete}
            >
              Delete
            </Button>
            <Button
              variant="ghost"
              className="h-7 rounded-full px-3 text-xs hover:bg-muted order-2 sm:order-1"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

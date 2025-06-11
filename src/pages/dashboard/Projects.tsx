import type React from "react"

import { useState, useEffect } from "react"
import { useClerkSupabaseClient } from "../../integrations/supabase/client"
import { useUser } from '@clerk/clerk-react'
import type { Project } from "@/types/database"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Pencil, Trash2, Plus, ExternalLink, Github, ImageIcon, X } from "lucide-react"
import { motion } from "framer-motion"

export default function Projects() {
  const supabase = useClerkSupabaseClient()
  const { user } = useUser()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showInlineForm, setShowInlineForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project_url: "",
    github_url: "",
    image_url: "",
    technologies: "",
  })

  useEffect(() => {
    fetchProjects()
    
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [user, supabase])

  async function fetchProjects() {
    if (!user || !supabase) return
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
      if (error) throw error
      setProjects(data as Project[])
    } catch (error: any) {
      toast.error(error.message || "Error fetching projects")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (project: Project | null = null) => {
    // Close any existing inline forms first
    setShowInlineForm(false)
    setEditingProject(null)
    
    // Then set up the new form
    if (project) {
      setEditingProject(project)
      setFormData({
        title: project.title,
        description: project.description || "",
        project_url: project.project_url || "",
        github_url: project.github_url || "",
        image_url: project.image_url || "",
        technologies: project.technologies ? project.technologies.join(", ") : "",
      })
    } else {
      setEditingProject(null)
      setFormData({
        title: "",
        description: "",
        project_url: "",
        github_url: "",
        image_url: "",
        technologies: "",
      })
    }
    
    if (isMobile) {
      setShowInlineForm(true)
    } else {
      setDialogOpen(true)
    }
  }

  const handleCloseForm = () => {
    setDialogOpen(false)
    setShowInlineForm(false)
    setEditingProject(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploadingImage(true)
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `projects/${fileName}`

      const { error: uploadError } = await supabase.storage.from("portfolio").upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage.from("portfolio").getPublicUrl(filePath)

      const imageUrl = publicUrlData.publicUrl
      setFormData((prev) => ({ ...prev, image_url: imageUrl }))
    } catch (error: any) {
      toast.error(error.message || "Error uploading image")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const projectData = {
        ...formData,
        technologies: formData.technologies ? formData.technologies.split(",").map((t) => t.trim()) : [],
        user_id: user.id,
      }

      if (editingProject) {
        const { error } = await supabase.from("projects").update(projectData).eq("id", editingProject.id)

        if (error) throw error
        toast.success("Project updated successfully")
      } else {
        const { error } = await supabase.from("projects").insert([projectData])

        if (error) throw error
        toast.success("Project added successfully")
      }

      handleCloseForm()
      fetchProjects()
    } catch (error: any) {
      toast.error(error.message || "Error saving project")
    }
  }

  const handleDelete = (id: string) => {
    setDeletingId(id)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!deletingId) return
    setDeleting(true)
    try {
      const { error } = await supabase.from("projects").delete().eq("id", deletingId)
      if (error) throw error
      toast.success("Project deleted successfully")
      fetchProjects()
      setShowDeleteDialog(false)
      setDeletingId(null)
    } catch (error: any) {
      toast.error(error.message || "Error deleting project")
    } finally {
      setDeleting(false)
    }
  }

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isMobile && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">
            {editingProject ? "Edit Project" : "Add New Project"}
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleCloseForm}
            className="h-8 w-8 rounded-full"
          >
            <X size={14} />
          </Button>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="title" className="text-xs">
          Project Title *
        </Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="h-9 rounded-md border-gray-200 text-sm focus:border-black focus:ring-black"
          placeholder="Enter project title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-xs">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="rounded-md border-gray-200 text-sm focus:border-black focus:ring-black"
          placeholder="Describe your project"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="project_url" className="text-xs">
            Live Demo URL
          </Label>
          <Input
            id="project_url"
            name="project_url"
            type="url"
            value={formData.project_url}
            onChange={handleChange}
            placeholder="https://..."
            className="h-9 rounded-md border-gray-200 text-sm focus:border-black focus:ring-black"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="github_url" className="text-xs">
            GitHub Repository
          </Label>
          <Input
            id="github_url"
            name="github_url"
            type="url"
            value={formData.github_url}
            onChange={handleChange}
            placeholder="https://github.com/..."
            className="h-9 rounded-md border-gray-200 text-sm focus:border-black focus:ring-black"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="technologies" className="text-xs">
          Technologies Used
        </Label>
        <Input
          id="technologies"
          name="technologies"
          value={formData.technologies}
          onChange={handleChange}
          placeholder="React, TypeScript, Tailwind CSS, etc. (comma-separated)"
          className="h-9 rounded-md border-gray-200 text-sm focus:border-black focus:ring-black"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="project_image" className="text-xs">
          Project Image
        </Label>
        {formData.image_url && (
          <div className="mb-2">
            <img
              src={formData.image_url || "/placeholder.svg"}
              alt="Project preview"
              className="h-32 rounded-md border border-gray-200 object-cover"
              loading="lazy"
            />
          </div>
        )}
        <Input
          id="project_image"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploadingImage}
          className="h-9 rounded-md border-gray-200 text-sm focus:border-black focus:ring-black file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
        />
        {uploadingImage && <p className="text-xs text-gray-500">Uploading image...</p>}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCloseForm}
          className="h-8 rounded-full border-gray-200 px-3 text-xs touch-manipulation"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={uploadingImage} 
          className="h-8 rounded-full px-3 text-xs touch-manipulation"
        >
          {editingProject ? "Save Changes" : "Add Project"}
        </Button>
      </div>
    </form>
  )

  // Show loading spinner if supabase client is not ready
  if (!supabase) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-b-2 border-black border-t-transparent"></div>
          <p className="mt-3 text-xs text-gray-500">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 mt-16 md:mt-0 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium">Projects</h1>
        <Button
          variant="outline"
          onClick={() => handleOpenDialog()}
          className="h-7 rounded-full border-gray-200 px-3 text-xs hover:bg-gray-50 hover:text-black"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add Project
        </Button>
      </div>

      {isMobile && showInlineForm && !editingProject && (
        <Card className="border-gray-200 shadow-none">
          <CardContent className="p-4">
            {renderForm()}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 ? (
          <motion.div
            className="col-span-full rounded-lg border border-gray-200 bg-gray-50 py-10 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <ImageIcon size={20} className="text-gray-400" />
            </div>
            <h3 className="text-sm font-medium">No projects yet</h3>
            <p className="mt-1 text-xs text-gray-500">Showcase your work by adding your first project</p>
            <Button className="mt-3 h-7 rounded-full px-3 text-xs" variant="outline" onClick={() => handleOpenDialog()}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Your First Project
            </Button>
          </motion.div>
        ) : (
          projects.map((project, index) => {
            const isBeingEdited = isMobile && editingProject?.id === project.id && showInlineForm;
            
            if (isBeingEdited) {
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`touch-manipulation ${isMobile ? 'col-span-full' : ''}`}
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
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="touch-manipulation"
              >
                <Card className="rounded-md border-gray-200 shadow-none transition-all duration-300 hover:shadow-sm">
                  {project.image_url ? (
                    <div className="overflow-hidden rounded-t-md">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src={project.image_url || "/placeholder.svg"}
                          alt={project.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </AspectRatio>
                    </div>
                  ) : (
                    <div className="flex h-36 items-center justify-center rounded-t-md bg-gray-100">
                      <ImageIcon size={24} className="text-gray-300" />
                    </div>
                  )}

                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-1 text-sm font-medium">{project.title}</CardTitle>
                  </CardHeader>

                  <CardContent>
                    {project.description ? (
                      <p className="mb-3 line-clamp-2 text-xs text-gray-600">{project.description}</p>
                    ) : (
                      <p className="mb-3 text-xs text-gray-400 italic">No description provided</p>
                    )}
                    
                    {project.technologies && project.technologies.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech) => (
                          <span key={tech} className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-800">
                            {tech}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No technologies specified</p>
                    )}
                  </CardContent>

                  <CardFooter className="flex justify-between border-t border-gray-100 p-3">
                    <div className="flex gap-1">
                      {project.project_url ? (
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          asChild 
                          className="h-8 w-8 rounded-full touch-manipulation"
                        >
                          <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={14} />
                          </a>
                        </Button>
                      ) : null}
                      {project.github_url ? (
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          asChild 
                          className="h-8 w-8 rounded-full touch-manipulation"
                        >
                          <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                            <Github size={14} />
                          </a>
                        </Button>
                      ) : null}
                      {!project.project_url && !project.github_url && (
                        <span className="text-xs text-gray-400 italic">No links provided</span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(project)}
                        className="h-7 rounded-full px-3 text-xs touch-manipulation"
                      >
                        <Pencil className="mr-1 h-3 w-3" /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                        className="h-7 rounded-full px-3 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 touch-manipulation"
                      >
                        <Trash2 className="mr-1 h-3 w-3" /> Delete
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
              {editingProject ? "Edit Project" : "Add New Project"}
            </DialogTitle>
          </DialogHeader>
          {renderForm()}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-xs p-6 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-base">Delete Project?</DialogTitle>
            <DialogDescription>
              This will permanently delete the project. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              variant="destructive"
              className="h-7 rounded-full px-3 text-xs hover:bg-red-400 hover:text-gray-400 order-1 sm:order-2"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
            <Button
              variant="ghost"
              className="h-7 rounded-full px-3 text-xs hover:bg-muted order-2 sm:order-1"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
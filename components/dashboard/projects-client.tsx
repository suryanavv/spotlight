"use client"

import { useState, useEffect } from "react"
import { useAuth } from '@/supabase/auth'
import { useDashboardData } from '../../app/(dashboard)/dashboard/dashboard-shell'
import type { Project } from "@/supabase/types"
import { createProject, updateProject, deleteProject } from '@/supabase/client-actions'
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { IconPencil, IconTrash, IconPlus, IconBriefcase, IconX, IconExternalLink, IconBrandGithub } from "@tabler/icons-react"
import { motion } from "framer-motion"

export default function ProjectsClient() {
  const { user } = useAuth()
  const dashboardData = useDashboardData()

  // Get preloaded projects data from context
  const projects = dashboardData?.projects || []
  const loading = !dashboardData

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showInlineForm, setShowInlineForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    project_url: "",
    github_url: "",
    technologies: "",
  })

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
        image_url: project.image_url || "",
        project_url: project.project_url || "",
        github_url: project.github_url || "",
        technologies: project.technologies ? project.technologies.join(", ") : "",
      })
    } else {
      setEditingProject(null)
      setFormData({
        title: "",
        description: "",
        image_url: "",
        project_url: "",
        github_url: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    // Basic validation
    if (!formData.title.trim()) {
      toast.error('Project title is required')
      return
    }

    try {
      const projectData = {
        title: formData.title,
        description: formData.description || null,
        image_url: formData.image_url || null,
        project_url: formData.project_url || null,
        github_url: formData.github_url || null,
        technologies: formData.technologies ? formData.technologies.split(",").map(tech => tech.trim()).filter(Boolean) : null,
      }

      if (editingProject) {
        const result = await updateProject(editingProject.id, projectData)
        if (result.error) {
          toast.error('Failed to update project')
          console.error('Error updating project:', result.error)
        } else {
          toast.success('Project updated successfully!')
        }
      } else {
        const result = await createProject(projectData)
        if (result.error) {
          toast.error('Failed to create project')
          console.error('Error creating project:', result.error)
        } else {
          toast.success('Project created successfully!')
        }
      }

      handleCloseForm()
    } catch (error: unknown) {
      toast.error('Failed to save project')
      console.error('Error submitting project:', error)
    }
  }

  const handleDelete = (id: string) => {
    setDeletingId(id)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!deletingId) return

    try {
      const result = await deleteProject(deletingId)
      if (result.error) {
        toast.error('Failed to delete project')
        console.error('Error deleting project:', result.error)
      } else {
        toast.success('Project deleted successfully!')
        setShowDeleteDialog(false)
        setDeletingId(null)
      }
    } catch (error: unknown) {
      toast.error('Failed to delete project')
      console.error('Error deleting project:', error)
    }
  }

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isMobile && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">
            {editingProject ? "Edit Project" : "Add Project"}
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
          Project Title *
        </Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="My Awesome Project"
          required
          className="h-9 rounded-md border-gray-200 text-sm focus:border-black focus:ring-black"
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
          placeholder="Describe your project, what it does, and the technologies used..."
          rows={3}
          className="rounded-md border-gray-200 text-sm focus:border-black focus:ring-black"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="project_url" className="text-xs">
            Project URL
          </Label>
          <Input
            id="project_url"
            name="project_url"
            value={formData.project_url}
            onChange={handleChange}
            placeholder="https://myproject.com"
            type="url"
            className="h-9 rounded-md border-gray-200 text-sm focus:border-black focus:ring-black"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="github_url" className="text-xs">
            GitHub URL
          </Label>
          <Input
            id="github_url"
            name="github_url"
            value={formData.github_url}
            onChange={handleChange}
            placeholder="https://github.com/username/repo"
            type="url"
            className="h-9 rounded-md border-gray-200 text-sm focus:border-black focus:ring-black"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url" className="text-xs">
          Image URL
        </Label>
        <Input
          id="image_url"
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
          placeholder="https://example.com/project-image.jpg"
          type="url"
          className="h-9 rounded-md border-gray-200 text-sm focus:border-black focus:ring-black"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="technologies" className="text-xs">
          Technologies
        </Label>
        <Input
          id="technologies"
          name="technologies"
          value={formData.technologies}
          onChange={handleChange}
          placeholder="React, TypeScript, Node.js, PostgreSQL"
          className="h-9 rounded-md border-gray-200 text-sm focus:border-black focus:ring-black"
        />
        <p className="text-xs text-gray-500">Separate technologies with commas</p>
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
          disabled={loading}
          className="h-8 rounded-full px-3 text-xs touch-manipulation"
        >
          {loading ? "Saving..." : editingProject ? "Update" : "Add"} Project
        </Button>
      </div>
    </form>
  )

  // Show loading state while data is being preloaded
  if (loading) {
    return (
      <div className="space-y-4 mt-16 md:mt-0 pt-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-7 w-28" />
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
        <h1 className="text-lg font-medium">Projects</h1>
        <Button
          variant="outline"
          onClick={() => handleOpenDialog()}
          className="h-7 rounded-full border-gray-200 px-3 text-xs hover:bg-gray-50 hover:text-black touch-manipulation"
        >
          <IconPlus className="mr-1.5 h-3.5 w-3.5" />
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

      <div className="space-y-3">
        {projects.length === 0 ? (
          <motion.div
            className="rounded-lg border border-gray-200 bg-gray-50 py-10 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <IconBriefcase size={20} className="text-gray-400" />
            </div>
            <h3 className="text-sm font-medium">No projects yet</h3>
            <p className="mt-1 text-xs text-gray-500">
              Showcase your portfolio projects
            </p>
            <Button className="mt-3 h-7 rounded-full px-3 text-xs touch-manipulation" variant="outline" onClick={() => handleOpenDialog()}>
              <IconPlus className="mr-1.5 h-3.5 w-3.5" />
              Add Project
            </Button>
          </motion.div>
        ) : (
          projects.map((project, index) => {
            const isBeingEdited = isMobile && editingProject?.id === project.id && showInlineForm

            if (isBeingEdited) {
              return (
                <motion.div
                  key={project.id}
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
              )
            }

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="border-gray-200 shadow-none transition-shadow duration-200 hover:shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-start justify-between text-sm font-medium">
                      <div>
                        <div>{project.title}</div>
                      </div>
                      <div className="flex gap-1 ml-2">
                        {project.project_url && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => window.open(project.project_url!, '_blank')}
                          >
                            <IconExternalLink size={12} />
                          </Button>
                        )}
                        {project.github_url && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => window.open(project.github_url!, '_blank')}
                          >
                            <IconBrandGithub size={12} />
                          </Button>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    {project.description ? (
                      <p className="text-xs text-gray-600 mb-2">{project.description}</p>
                    ) : (
                      <p className="text-xs text-gray-400 italic mb-2">No description provided</p>
                    )}
                    {project.technologies && project.technologies.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No technologies specified</p>
                    )}
                  </CardContent>

                  <CardFooter className="flex justify-end border-t border-gray-100 p-3">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenDialog(project)}
                        className="h-7 rounded-full px-3 text-xs touch-manipulation cursor-pointer"
                      >
                        <IconPencil size={14} className="mr-1"/>Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(project.id)}
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
              {editingProject ? "Edit Project" : "Add New Project"}
            </DialogTitle>
            <DialogDescription>
              {editingProject ? "Update your project details below." : "Add a new project to your portfolio."}
            </DialogDescription>
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
              This will permanently delete this project. This action cannot be undone.
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

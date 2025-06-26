"use client"

import { useState, useEffect } from "react"
import { useUser } from '@clerk/nextjs';
import { useExperience, useExperienceMutations } from '@/lib/hooks/useQueries';
import type { Experience } from "@/types/database"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { format, parseISO } from "date-fns"
import { Pencil, Trash2, Plus, Briefcase, MapPin, X } from "lucide-react"
import { motion } from "framer-motion"
import { MonthYearPicker } from "@/components/month-year-picker"
import { ExperienceSkeleton } from '@/components/ui/skeletons';

export default function ExperiencePage() {
  const { user } = useUser();
  
  // Use React Query hooks for data fetching and mutations
  const { data: experienceList = [], isInitialLoading, hasData, error } = useExperience();
  const { createExperience, updateExperience, deleteExperience } = useExperienceMutations();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const currentDate = format(new Date(), 'yyyy-MM-dd')

  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    start_date: "" as string | null,
    end_date: "" as string | null,
    current_job: false,
    description: "",
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

  if (isInitialLoading && !hasData) {
    return <ExperienceSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load experience data</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()} 
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const handleOpenDialog = (experience: Experience | null = null) => {
    // Close any existing inline forms first
    setShowInlineForm(false)
    setEditingExperience(null)
    
    // Then set up the new form
    if (experience) {
      setEditingExperience(experience)
      setFormData({
        company: experience.company,
        position: experience.position,
        location: experience.location || "",
        start_date: experience.start_date || "",
        end_date: experience.end_date || "",
        current_job: experience.current_job || false,
        description: experience.description || "",
      })
    } else {
      setEditingExperience(null)
      setFormData({
        company: "",
        position: "",
        location: "",
        start_date: "",
        end_date: "",
        current_job: false,
        description: "",
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
    setEditingExperience(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (name: 'start_date' | 'end_date', date: string) => {
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: date }
      
      // If start date is changed and it's after the current end date, clear end date
      if (name === 'start_date' && newFormData.end_date && !newFormData.current_job) {
        const startDate = parseISO(date)
        const endDate = parseISO(newFormData.end_date)
        if (startDate > endDate) {
          newFormData.end_date = null
        }
      }
      
      return newFormData
    })
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      current_job: checked,
      end_date: checked ? null : prev.end_date,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const experienceData = {
        ...formData,
        user_id: user.id,
        // Convert empty strings to null for date fields
        start_date: formData.start_date || null,
        end_date: formData.current_job ? null : (formData.end_date || null),
      }

      if (editingExperience) {
        await updateExperience.mutateAsync({ id: editingExperience.id, ...experienceData })
      } else {
        await createExperience.mutateAsync(experienceData)
      }

      handleCloseForm()
    } catch (error: unknown) {
      // Error handling is done in the mutation hooks
      console.error('Error submitting experience:', error)
    }
  }

  const handleDelete = (id: string) => {
    setDeletingId(id)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!deletingId) return
    try {
      await deleteExperience.mutateAsync(deletingId)
      setShowDeleteDialog(false)
      setDeletingId(null)
    } catch (error: unknown) {
      // Error handling is done in the mutation hook
      console.error('Error deleting experience:', error)
    }
  }

  function formatDateRange(startDate?: string | null, endDate?: string | null, currentJob?: boolean | null) {
    if (!startDate) return ""

    const start = startDate ? format(parseISO(startDate), "MMM yyyy") : ""
    
    if (currentJob) {
      return `${start} - Present`
    }
    
    const end = endDate ? format(parseISO(endDate), "MMM yyyy") : ""
    return `${start} - ${end}`
  }

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isMobile && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">
            {editingExperience ? "Edit Experience" : "Add Experience"}
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
        <Label htmlFor="company" className="text-xs">
          Company *
        </Label>
        <Input
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Company Name"
          required
          className="h-9 rounded-md border-gray-200 text-sm focus:border-black focus:ring-black"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="position" className="text-xs">
          Position *
        </Label>
        <Input
          id="position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          placeholder="Job Title"
          required
          className="h-9 rounded-md border-gray-200 text-sm focus:border-black focus:ring-black"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="text-xs">
          Location
        </Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="City, Country"
          className="h-9 rounded-md border-gray-200 text-sm focus:border-black focus:ring-black"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date" className="text-xs">
            Start Date
          </Label>
          <MonthYearPicker
            date={formData.start_date}
            onDateChange={(date) => handleDateChange('start_date', date)}
            maxDate={currentDate}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_date" className="text-xs">
            End Date
          </Label>
          <MonthYearPicker
            date={formData.end_date}
            onDateChange={(date) => handleDateChange('end_date', date)}
            disabled={formData.current_job}
            minDate={formData.start_date}
            maxDate={currentDate}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="current_job" checked={formData.current_job} onCheckedChange={handleSwitchChange} />
        <Label htmlFor="current_job" className="text-xs">
          I currently work here
        </Label>
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
          placeholder="Describe your responsibilities and achievements"
          rows={3}
          className="rounded-md border-gray-200 text-sm focus:border-black focus:ring-black"
        />
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
          disabled={createExperience.isPending || updateExperience.isPending}
          className="h-8 rounded-full px-3 text-xs touch-manipulation"
        >
          {createExperience.isPending || updateExperience.isPending ? "Saving..." : editingExperience ? "Update" : "Add"} Experience
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-4 mt-16 md:mt-0 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium">Work Experience</h1>
        <Button
          variant="outline"
          onClick={() => handleOpenDialog()}
          className="h-7 rounded-full border-gray-200 px-3 text-xs hover:bg-gray-50 hover:text-black touch-manipulation"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add Experience
        </Button>
      </div>

      {isMobile && showInlineForm && !editingExperience && (
        <Card className="border-gray-200 shadow-none">
          <CardContent className="p-4">
            {renderForm()}
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {experienceList.length === 0 ? (
          <motion.div
            className="rounded-lg border border-gray-200 bg-gray-50 py-10 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Briefcase size={20} className="text-gray-400" />
            </div>
            <h3 className="text-sm font-medium">No work experience yet</h3>
            <p className="mt-1 text-xs text-gray-500">Showcase your professional experience</p>
            <Button className="mt-3 h-7 rounded-full px-3 text-xs touch-manipulation" variant="outline" onClick={() => handleOpenDialog()}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Experience
            </Button>
          </motion.div>
        ) : (
          experienceList.map((experience, index) => {
            const isBeingEdited = isMobile && editingExperience?.id === experience.id && showInlineForm;
            
            if (isBeingEdited) {
              return (
                <motion.div
                  key={experience.id}
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
                key={experience.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="border-gray-200 shadow-none transition-shadow duration-200 hover:shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-start justify-between text-sm font-medium">
                      <div>
                        <div>{experience.position}</div>
                        <div className="mt-1 text-xs font-normal text-gray-500">
                          {formatDateRange(experience.start_date, experience.end_date, experience.current_job)}
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="text-xs font-medium">{experience.company}</div>
                    {experience.location ? (
                      <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={12} />
                        <span>{experience.location}</span>
                      </div>
                    ) : (
                      <div className="mt-1 text-xs text-gray-400 italic">No location specified</div>
                    )}
                    {experience.description ? (
                      <p className="mt-2 whitespace-pre-line text-xs text-gray-600">{experience.description}</p>
                    ) : (
                      <p className="mt-2 text-xs text-gray-400 italic">No description provided</p>
                    )}
                  </CardContent>

                  <CardFooter className="flex justify-end border-t border-gray-100 p-3">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenDialog(experience)}
                        className="h-7 rounded-full px-3 text-xs touch-manipulation"
                      >
                        <Pencil size={14} className="mr-1"/>Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(experience.id)}
                        className="h-7 rounded-full px-3 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 touch-manipulation"
                      >
                        <Trash2 size={14} className="mr-1"/>Delete
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
              {editingExperience ? "Edit Experience" : "Add New Experience"}
            </DialogTitle>
          </DialogHeader>
          {renderForm()}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-xs p-6 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-base">Delete Experience Entry?</DialogTitle>
            <DialogDescription>
              This will permanently delete this experience entry. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:space-x-2">
                          <Button
                variant="default"
                className="h-7 rounded-full px-3 text-xs bg-red-500 hover:bg-red-900 hover:text-gray-400 order-1 sm:order-2"
                onClick={confirmDelete}
                disabled={deleteExperience.isPending}
              >
                {deleteExperience.isPending ? "Deleting..." : "Delete"}
              </Button>
              <Button
                variant="ghost"
                className="h-7 rounded-full px-3 text-xs hover:bg-muted order-2 sm:order-1"
                onClick={() => setShowDeleteDialog(false)}
                disabled={deleteExperience.isPending}
              >
                Cancel
              </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
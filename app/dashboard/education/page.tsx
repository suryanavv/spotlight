"use client"

import { useState, useEffect } from "react"
import { useAuth } from '@/components/providers/AuthProvider';
import { useEducation, useEducationMutations } from '@/lib/hooks/useQueries';
import type { Education } from "@/types/database"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { format, parseISO } from "date-fns"
import { Pencil, Trash2, Plus, GraduationCap, X } from "lucide-react"
import { motion } from "framer-motion"
import { MonthYearPicker } from "@/components/month-year-picker"
import { EducationSkeleton } from '@/components/ui/skeletons';

export default function EducationPage() {
  const { user } = useAuth();
  
  // Use React Query hooks for data fetching and mutations
  const { data: education = [], isInitialLoading, hasData, error } = useEducation();
  const { createEducation, updateEducation, deleteEducation } = useEducationMutations();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const currentDate = format(new Date(), 'yyyy-MM-dd')

  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    field_of_study: "",
    start_date: "" as string | null,
    end_date: "" as string | null,
    current_education: false,
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
    return <EducationSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load education data</p>
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

  const handleOpenDialog = (education: Education | null = null) => {
    // Close any existing inline forms first
    setShowInlineForm(false)
    setEditingEducation(null)
    
    // Then set up the new form
    if (education) {
      setEditingEducation(education)
      setFormData({
        institution: education.institution,
        degree: education.degree,
        field_of_study: education.field_of_study || "",
        start_date: education.start_date || "",
        end_date: education.end_date || "",
        current_education: education.current_education || false,
        description: education.description || "",
      })
    } else {
      setEditingEducation(null)
      setFormData({
        institution: "",
        degree: "",
        field_of_study: "",
        start_date: "",
        end_date: "",
        current_education: false,
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
    setEditingEducation(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (name: 'start_date' | 'end_date', date: string) => {
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: date }
      
      // If start date is changed and it's after the current end date, clear end date
      if (name === 'start_date' && newFormData.end_date && !newFormData.current_education) {
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
      current_education: checked,
      end_date: checked ? null : prev.end_date,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const educationData = {
        ...formData,
        user_id: user.id,
        // Convert empty strings to null for date fields
        start_date: formData.start_date || null,
        end_date: formData.current_education ? null : (formData.end_date || null),
      }

      if (editingEducation) {
        await updateEducation.mutateAsync({ id: editingEducation.id, ...educationData })
      } else {
        await createEducation.mutateAsync(educationData)
      }

      handleCloseForm()
    } catch (error: unknown) {
      // Error handling is done in the mutation hooks
      console.error('Error submitting education:', error)
    }
  }

  const handleDelete = (id: string) => {
    setDeletingId(id)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!deletingId) return
    try {
      await deleteEducation.mutateAsync(deletingId)
      setShowDeleteDialog(false)
      setDeletingId(null)
    } catch (error: unknown) {
      // Error handling is done in the mutation hook
      console.error('Error deleting education:', error)
    }
  }

  function formatDateRange(startDate?: string | null, endDate?: string | null, currentEducation?: boolean | null) {
    if (!startDate) return "Present"

    const start = startDate ? format(parseISO(startDate), "MMM yyyy") : ""
    
    if (currentEducation) {
      return `${start} - Present`
    }

    const end = endDate ? format(parseISO(endDate), "MMM yyyy") : "Present"
    return `${start} - ${end}`
  }

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isMobile && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">
            {editingEducation ? "Edit Education" : "Add Education"}
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
        <Label htmlFor="institution" className="text-xs">
          Institution *
        </Label>
        <Input
          id="institution"
          name="institution"
          value={formData.institution}
          onChange={handleChange}
          placeholder="University or School Name"
          required
          className="h-9 rounded-md border-gray-200 text-sm focus:border-black focus:ring-black"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="degree" className="text-xs">
          Degree/Certificate *
        </Label>
        <Input
          id="degree"
          name="degree"
          value={formData.degree}
          onChange={handleChange}
          placeholder="Bachelor of Science, Certificate, etc."
          required
          className="h-9 rounded-md border-gray-200 text-sm focus:border-black focus:ring-black"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="field_of_study" className="text-xs">
          Field of Study
        </Label>
        <Input
          id="field_of_study"
          name="field_of_study"
          value={formData.field_of_study}
          onChange={handleChange}
          placeholder="Computer Science, Business, etc."
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
            disabled={formData.current_education}
            minDate={formData.start_date}
            maxDate={currentDate}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="current_education" checked={formData.current_education} onCheckedChange={handleSwitchChange} />
        <Label htmlFor="current_education" className="text-xs">
          I am currently studying here
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
          placeholder="Notable achievements, activities, GPA, etc."
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
          disabled={createEducation.isPending || updateEducation.isPending}
          className="h-8 rounded-full px-3 text-xs touch-manipulation"
        >
          {createEducation.isPending || updateEducation.isPending ? "Saving..." : editingEducation ? "Update" : "Add"} Education
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-4 mt-16 md:mt-0 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium">Education</h1>
        <Button
          variant="outline"
          onClick={() => handleOpenDialog()}
          className="h-7 rounded-full border-gray-200 px-3 text-xs hover:bg-gray-50 hover:text-black touch-manipulation"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add Education
        </Button>
      </div>

      {isMobile && showInlineForm && !editingEducation && (
        <Card className="border-gray-200 shadow-none">
          <CardContent className="p-4">
            {renderForm()}
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {education.length === 0 ? (
          <motion.div
            className="rounded-lg border border-gray-200 bg-gray-50 py-10 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <GraduationCap size={20} className="text-gray-400" />
            </div>
            <h3 className="text-sm font-medium">No education entries yet</h3>
            <p className="mt-1 text-xs text-gray-500">
              Showcase your educational qualifications
            </p>
            <Button className="mt-3 h-7 rounded-full px-3 text-xs touch-manipulation" variant="outline" onClick={() => handleOpenDialog()}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Education
            </Button>
          </motion.div>
        ) : (
          education.map((education, index) => {
            const isBeingEdited = isMobile && editingEducation?.id === education.id && showInlineForm;
            
            if (isBeingEdited) {
              return (
                <motion.div
                  key={education.id}
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
                key={education.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="border-gray-200 shadow-none transition-shadow duration-200 hover:shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-start justify-between text-sm font-medium">
                      <div>
                        <div>{education.institution}</div>
                        <div className="mt-1 text-xs font-normal text-gray-500">
                          {formatDateRange(education.start_date, education.end_date, education.current_education)}
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="text-xs font-medium">{education.degree}</div>
                    {education.field_of_study ? (
                      <div className="text-xs text-gray-500">{education.field_of_study}</div>
                    ) : (
                      <div className="text-xs text-gray-400 italic">No field of study specified</div>
                    )}
                    {education.description ? (
                      <p className="mt-2 text-xs text-gray-600">{education.description}</p>
                    ) : (
                      <p className="mt-2 text-xs text-gray-400 italic">No description provided</p>
                    )}
                  </CardContent>

                  <CardFooter className="flex justify-end border-t border-gray-100 p-3">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenDialog(education)}
                        className="h-7 rounded-full px-3 text-xs touch-manipulation"
                      >
                        <Pencil size={14} className="mr-1"/>Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(education.id)}
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
              {editingEducation ? "Edit Education" : "Add New Education"}
            </DialogTitle>
          </DialogHeader>
          {renderForm()}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-xs p-6 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-base">Delete Education Entry?</DialogTitle>
            <DialogDescription>
              This will permanently delete this education entry. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:space-x-2">
                          <Button
                variant="default"
                className="h-7 rounded-full px-3 text-xs bg-red-500 hover:bg-red-900 hover:text-gray-400 order-1 sm:order-2"
                onClick={confirmDelete}
                disabled={deleteEducation.isPending}
              >
                {deleteEducation.isPending ? "Deleting..." : "Delete"}
              </Button>
              <Button
                variant="ghost"
                className="h-7 rounded-full px-3 text-xs hover:bg-muted order-2 sm:order-1"
                onClick={() => setShowDeleteDialog(false)}
                disabled={deleteEducation.isPending}
              >
                Cancel
              </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
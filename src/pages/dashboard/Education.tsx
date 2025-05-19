"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useUser } from '@clerk/clerk-react';
import { useClerkSupabaseClient } from '../../integrations/supabase/client';
import type { Education } from "@/types/database"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { format, parseISO } from "date-fns"
import { Pencil, Trash2, Plus, GraduationCap } from "lucide-react"
import { motion } from "framer-motion"

export default function EducationPage() {
  const supabase = useClerkSupabaseClient();
  const { user } = useUser();
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);

  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    field_of_study: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  useEffect(() => {
    fetchEducation();
  }, [user, supabase]);

  async function fetchEducation() {
    if (!user || !supabase) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .eq("user_id", user.id)
        .order("end_date", { ascending: false });
      if (error) throw error;
      setEducationList(data as Education[]);
    } catch (error: any) {
      toast.error(error.message || "Error fetching education data");
    } finally {
      setLoading(false);
    }
  }

  const handleOpenDialog = (education: Education | null = null) => {
    if (education) {
      setEditingEducation(education)
      setFormData({
        institution: education.institution,
        degree: education.degree,
        field_of_study: education.field_of_study || "",
        start_date: education.start_date || "",
        end_date: education.end_date || "",
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
        description: "",
      })
    }
    setDialogOpen(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const educationData = {
        ...formData,
        user_id: user.id,
      }

      if (editingEducation) {
        const { error } = await supabase
          .from("education")
          .update(educationData)
          .eq("id", editingEducation.id)

        if (error) throw error
        toast.success("Education updated successfully")
      } else {
        const { error } = await supabase
          .from("education")
          .insert([educationData])

        if (error) throw error
        toast.success("Education added successfully")
      }

      setDialogOpen(false)
      fetchEducation()
    } catch (error: any) {
      toast.error(error.message || "Error saving education details")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education entry?")) return

    try {
      const { error } = await supabase
        .from("education")
        .delete()
        .eq("id", id)

      if (error) throw error
      toast.success("Education entry deleted successfully")
      fetchEducation()
    } catch (error: any) {
      toast.error(error.message || "Error deleting education entry")
    }
  }

  function formatDateRange(startDate?: string | null, endDate?: string | null) {
    if (!startDate) return "Present"

    const start = startDate ? format(parseISO(startDate), "MMM yyyy") : ""
    const end = endDate ? format(parseISO(endDate), "MMM yyyy") : "Present"

    return `${start} - ${end}`
  }

  // Show loading spinner if supabase client is not ready
  if (!supabase) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-b-2 border-black border-t-transparent"></div>
          <p className="mt-3 text-xs text-gray-500">Loading education data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium">Education</h1>
        <Button
          variant="outline"
          onClick={() => handleOpenDialog()}
          className="h-7 rounded-full border-gray-200 px-3 text-xs hover:bg-gray-50 hover:text-black"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add Education
        </Button>
      </div>

      <div className="space-y-3">
        {educationList.length === 0 ? (
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
              Add your educational background to showcase your qualifications
            </p>
            <Button className="mt-3 h-7 rounded-full px-3 text-xs" variant="outline" onClick={() => handleOpenDialog()}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Education
            </Button>
          </motion.div>
        ) : (
          educationList.map((education, index) => (
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
                        {formatDateRange(education.start_date, education.end_date)}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="text-xs font-medium">{education.degree}</div>
                  {education.field_of_study && <div className="text-xs text-gray-500">{education.field_of_study}</div>}
                  {education.description && <p className="mt-2 text-xs text-gray-600">{education.description}</p>}
                </CardContent>

                <CardFooter className="flex justify-end border-t border-gray-100 p-3">
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleOpenDialog(education)}
                      className="h-6 w-6 rounded-full"
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(education.id)}
                      className="h-6 w-6 rounded-full"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-sm font-medium">
              {editingEducation ? "Edit Education" : "Add Education"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
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
                className="h-8 rounded-md border-gray-200 text-xs focus:border-black focus:ring-black"
              />
            </div>

            <div className="space-y-1">
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
                className="h-8 rounded-md border-gray-200 text-xs focus:border-black focus:ring-black"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="field_of_study" className="text-xs">
                Field of Study
              </Label>
              <Input
                id="field_of_study"
                name="field_of_study"
                value={formData.field_of_study}
                onChange={handleChange}
                placeholder="Computer Science, Business, etc."
                className="h-8 rounded-md border-gray-200 text-xs focus:border-black focus:ring-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="start_date" className="text-xs">
                  Start Date
                </Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="h-8 rounded-md border-gray-200 text-xs focus:border-black focus:ring-black"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="end_date" className="text-xs">
                  End Date
                </Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={handleChange}
                  placeholder="Leave blank if still studying"
                  className="h-8 rounded-md border-gray-200 text-xs focus:border-black focus:ring-black"
                />
              </div>
            </div>

            <div className="space-y-1">
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
                className="rounded-md border-gray-200 text-xs focus:border-black focus:ring-black"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="h-7 rounded-full border-gray-200 px-3 text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" className="h-7 rounded-full px-3 text-xs">
                {editingEducation ? "Update" : "Add"} Education
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

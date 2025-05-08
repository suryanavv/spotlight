import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Education } from "@/types/database";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format, parseISO } from "date-fns";
import { Pencil, Trash2, Plus, GraduationCap } from "lucide-react";

export default function EducationPage() {
  const { user } = useAuth();
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(
    null,
  );

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
  }, [user]);

  async function fetchEducation() {
    if (!user) return;

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
      setEditingEducation(education);
      setFormData({
        institution: education.institution,
        degree: education.degree,
        field_of_study: education.field_of_study || "",
        start_date: education.start_date || "",
        end_date: education.end_date || "",
        description: education.description || "",
      });
    } else {
      setEditingEducation(null);
      setFormData({
        institution: "",
        degree: "",
        field_of_study: "",
        start_date: "",
        end_date: "",
        description: "",
      });
    }
    setDialogOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const educationData = {
        ...formData,
        user_id: user.id,
      };

      if (editingEducation) {
        const { error } = await supabase
          .from("education")
          .update(educationData)
          .eq("id", editingEducation.id);

        if (error) throw error;
        toast.success("Education updated successfully");
      } else {
        const { error } = await supabase
          .from("education")
          .insert([educationData]);

        if (error) throw error;
        toast.success("Education added successfully");
      }

      setDialogOpen(false);
      fetchEducation();
    } catch (error: any) {
      toast.error(error.message || "Error saving education details");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education entry?"))
      return;

    try {
      const { error } = await supabase.from("education").delete().eq("id", id);

      if (error) throw error;
      toast.success("Education entry deleted successfully");
      fetchEducation();
    } catch (error: any) {
      toast.error(error.message || "Error deleting education entry");
    }
  };

  function formatDateRange(startDate?: string | null, endDate?: string | null) {
    if (!startDate) return "Present";

    const start = startDate ? format(parseISO(startDate), "MMM yyyy") : "";
    const end = endDate ? format(parseISO(endDate), "MMM yyyy") : "Present";

    return `${start} - ${end}`;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4">Loading education data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Education</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Education
        </Button>
      </div>

      <div className="space-y-4">
        {educationList.length === 0 ? (
          <div className="py-12 text-center bg-muted/20 rounded-lg">
            <div className="mx-auto bg-muted/30 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <GraduationCap size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No education entries yet</h3>
            <p className="text-muted-foreground mt-2">
              Add your educational background to showcase your qualifications
            </p>
            <Button className="mt-4" onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Education
            </Button>
          </div>
        ) : (
          educationList.map((education) => (
            <Card key={education.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <div>
                    <div>{education.institution}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {formatDateRange(
                        education.start_date,
                        education.end_date,
                      )}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="font-medium">{education.degree}</div>
                {education.field_of_study && (
                  <div className="text-sm text-muted-foreground">
                    {education.field_of_study}
                  </div>
                )}
                {education.description && (
                  <p className="mt-2 text-sm">{education.description}</p>
                )}
              </CardContent>

              <CardFooter className="flex justify-end border-t p-4">
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleOpenDialog(education)}
                  >
                    <Pencil size={18} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(education.id)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingEducation ? "Edit Education" : "Add Education"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="institution">Institution *</Label>
              <Input
                id="institution"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                placeholder="University or School Name"
                required
                className="bg-gray-100 text-black text-xs px-2.5 py-0.5 rounded-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="degree">Degree/Certificate *</Label>
              <Input
                id="degree"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                placeholder="Bachelor of Science, Certificate, etc."
                required
                className="bg-gray-100 text-black text-xs px-2.5 py-0.5 rounded-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="field_of_study">Field of Study</Label>
              <Input
                id="field_of_study"
                name="field_of_study"
                value={formData.field_of_study}
                onChange={handleChange}
                placeholder="Computer Science, Business, etc."
                className="bg-gray-100 text-black text-xs px-2.5 py-0.5 rounded-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={handleChange}
                  placeholder="Leave blank if still studying"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Notable achievements, activities, GPA, etc."
                rows={3}
                className="bg-gray-100 text-black text-xs px-2.5 py-0.5 rounded-full"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingEducation ? "Update" : "Add"} Education
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

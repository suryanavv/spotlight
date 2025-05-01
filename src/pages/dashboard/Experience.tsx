
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Experience } from "@/types/database";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { format, parseISO } from "date-fns";
import { Pencil, Trash2, Plus, Briefcase, MapPin } from "lucide-react";

export default function ExperiencePage() {
  const { user } = useAuth();
  const [experienceList, setExperienceList] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    start_date: "",
    end_date: "",
    current_job: false,
    description: "",
  });

  useEffect(() => {
    fetchExperience();
  }, [user]);

  async function fetchExperience() {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("experience")
        .select("*")
        .eq("user_id", user.id)
        .order("end_date", { ascending: false });

      if (error) throw error;
      setExperienceList(data as Experience[]);
    } catch (error: any) {
      toast.error(error.message || "Error fetching experience data");
    } finally {
      setLoading(false);
    }
  }

  const handleOpenDialog = (experience: Experience | null = null) => {
    if (experience) {
      setEditingExperience(experience);
      setFormData({
        company: experience.company,
        position: experience.position,
        location: experience.location || "",
        start_date: experience.start_date || "",
        end_date: experience.end_date || "",
        current_job: experience.current_job || false,
        description: experience.description || "",
      });
    } else {
      setEditingExperience(null);
      setFormData({
        company: "",
        position: "",
        location: "",
        start_date: "",
        end_date: "",
        current_job: false,
        description: "",
      });
    }
    setDialogOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ 
      ...prev, 
      current_job: checked,
      end_date: checked ? "" : prev.end_date
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const experienceData = {
        ...formData,
        user_id: user.id,
      };

      if (editingExperience) {
        const { error } = await supabase
          .from("experience")
          .update(experienceData)
          .eq("id", editingExperience.id);

        if (error) throw error;
        toast.success("Experience updated successfully");
      } else {
        const { error } = await supabase
          .from("experience")
          .insert([experienceData]);

        if (error) throw error;
        toast.success("Experience added successfully");
      }

      setDialogOpen(false);
      fetchExperience();
    } catch (error: any) {
      toast.error(error.message || "Error saving experience details");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience entry?")) return;

    try {
      const { error } = await supabase
        .from("experience")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Experience entry deleted successfully");
      fetchExperience();
    } catch (error: any) {
      toast.error(error.message || "Error deleting experience entry");
    }
  };

  function formatDateRange(startDate?: string | null, endDate?: string | null, currentJob?: boolean | null) {
    if (!startDate) return "";

    const start = startDate ? format(parseISO(startDate), "MMM yyyy") : "";
    const end = currentJob ? "Present" : endDate ? format(parseISO(endDate), "MMM yyyy") : "";
    
    return `${start} - ${end}`;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
          <p className="mt-4">Loading experience data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Work Experience</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </div>

      <div className="space-y-4">
        {experienceList.length === 0 ? (
          <div className="py-12 text-center bg-muted/20 rounded-lg">
            <div className="mx-auto bg-muted/30 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Briefcase size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No work experience yet</h3>
            <p className="text-muted-foreground mt-2">
              Add your work experience to showcase your professional journey
            </p>
            <Button className="mt-4" onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Experience
            </Button>
          </div>
        ) : (
          experienceList.map((experience) => (
            <Card key={experience.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <div>
                    <div>{experience.position}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {formatDateRange(experience.start_date, experience.end_date, experience.current_job)}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="font-medium">{experience.company}</div>
                {experience.location && (
                  <div className="flex items-center text-sm text-muted-foreground gap-1 mt-1">
                    <MapPin size={14} />
                    <span>{experience.location}</span>
                  </div>
                )}
                {experience.description && (
                  <p className="mt-2 text-sm whitespace-pre-line">{experience.description}</p>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-end border-t p-4">
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => handleOpenDialog(experience)}>
                    <Pencil size={18} />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(experience.id)}>
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
              {editingExperience ? "Edit Experience" : "Add Experience"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company Name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Job Title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Country"
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
                  disabled={formData.current_job}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                id="current_job"
                checked={formData.current_job}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="current_job">I currently work here</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your responsibilities and achievements"
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingExperience ? "Update" : "Add"} Experience
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/database";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Pencil,
  Trash2,
  Plus,
  ExternalLink,
  Github,
  Image as ImageIcon,
} from "lucide-react";

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project_url: "",
    github_url: "",
    image_url: "",
    technologies: "",
  });

  useEffect(() => {
    fetchProjects();
  }, [user]);

  async function fetchProjects() {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data as Project[]);
    } catch (error: any) {
      toast.error(error.message || "Error fetching projects");
    } finally {
      setLoading(false);
    }
  }

  const handleOpenDialog = (project: Project | null = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description || "",
        project_url: project.project_url || "",
        github_url: project.github_url || "",
        image_url: project.image_url || "",
        technologies: project.technologies
          ? project.technologies.join(", ")
          : "",
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: "",
        description: "",
        project_url: "",
        github_url: "",
        image_url: "",
        technologies: "",
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("portfolio")
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;
      setFormData((prev) => ({ ...prev, image_url: imageUrl }));
    } catch (error: any) {
      toast.error(error.message || "Error uploading image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const projectData = {
        ...formData,
        technologies: formData.technologies
          ? formData.technologies.split(",").map((t) => t.trim())
          : [],
        user_id: user.id,
      };

      if (editingProject) {
        const { error } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", editingProject.id);

        if (error) throw error;
        toast.success("Project updated successfully");
      } else {
        const { error } = await supabase.from("projects").insert([projectData]);

        if (error) throw error;
        toast.success("Project added successfully");
      }

      setDialogOpen(false);
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message || "Error saving project");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);

      if (error) throw error;
      toast.success("Project deleted successfully");
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message || "Error deleting project");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
        <h1 className="text-3xl font-extrabold text-black tracking-tight mb-1">Projects</h1>
        <Button variant="premium" onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-5 w-5" /> Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pt-6">
        {projects.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <div className="mx-auto bg-muted/30 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <ImageIcon size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No projects yet</h3>
            <p className="text-muted-foreground mt-2">
              Showcase your work by adding your first project
            </p>
            <Button className="mt-4" onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Project
            </Button>
          </div>
        ) : (
          projects.map((project) => (
            <Card key={project.id} className="rounded-md shadow-md bg-white/90 backdrop-blur-md border border-gray-100 hover:shadow-xl transition-all duration-300">
              {project.image_url ? (
                <div className="overflow-hidden rounded-t-lg">
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                </div>
              ) : (
                <div className="bg-muted/30 flex items-center justify-center h-48 rounded-t-lg">
                  <ImageIcon size={48} className="text-muted-foreground/40" />
                </div>
              )}

              <CardHeader>
                <CardTitle className="line-clamp-2">{project.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground line-clamp-3 text-sm mb-4">
                  {project.description}
                </p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="bg-gray-100 text-black text-xs px-2.5 py-0.5 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-between border-t p-4">
                <div className="flex gap-2">
                  {project.project_url && (
                    <Button size="icon" variant="ghost" asChild>
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink size={18} />
                      </a>
                    </Button>
                  )}
                  {project.github_url && (
                    <Button size="icon" variant="ghost" asChild>
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github size={18} />
                      </a>
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="premium"
                    className="w-full"
                    onClick={() => handleOpenDialog(project)}
                  >
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button
                    variant="premium"
                    className="w-full"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
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
              {editingProject ? "Edit Project" : "Add New Project"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project_url">Live Demo URL</Label>
                <Input
                  id="project_url"
                  name="project_url"
                  type="url"
                  value={formData.project_url}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github_url">GitHub Repository</Label>
                <Input
                  id="github_url"
                  name="github_url"
                  type="url"
                  value={formData.github_url}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="technologies">Technologies Used</Label>
              <Input
                id="technologies"
                name="technologies"
                value={formData.technologies}
                onChange={handleChange}
                placeholder="React, TypeScript, Tailwind CSS, etc. (comma-separated)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project_image">Project Image</Label>
              {formData.image_url && (
                <div className="mb-2">
                  <img
                    src={formData.image_url}
                    alt="Project preview"
                    className="h-40 object-cover rounded-md"
                  />
                </div>
              )}
              <Input
                id="project_image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
              />
              {uploadingImage && (
                <p className="text-sm text-muted-foreground">
                  Uploading image...
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="premium"
                className="w-full"
                onClick={handleSubmit}
                disabled={uploadingImage}
              >
                {editingProject ? "Save Changes" : "Add Project"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

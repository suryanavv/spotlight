
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Project, Education, Experience } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Share2, Briefcase, GraduationCap, FileText } from "lucide-react";

export default function Overview() {
  const { user, profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      try {
        setLoading(true);
        
        // Fetch projects
        const { data: projectsData, error: projectsError } = await supabase
          .from("projects")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (projectsError) throw projectsError;
        setProjects(projectsData as Project[]);

        // Fetch education
        const { data: educationData, error: educationError } = await supabase
          .from("education")
          .select("*")
          .eq("user_id", user.id)
          .order("end_date", { ascending: false });

        if (educationError) throw educationError;
        setEducation(educationData as Education[]);

        // Fetch experience
        const { data: experienceData, error: experienceError } = await supabase
          .from("experience")
          .select("*")
          .eq("user_id", user.id)
          .order("end_date", { ascending: false });

        if (experienceError) throw experienceError;
        setExperience(experienceData as Experience[]);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
          <p className="mt-4">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <Button 
          onClick={() => navigate(`/portfolio/${user?.id}`)}
          className="flex items-center gap-2"
        >
          <Share2 size={16} />
          View Public Portfolio
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <FileText size={20} />
              Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{projects.length}</p>
            <p className="text-muted-foreground mt-1">Total projects</p>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => navigate("/dashboard/projects")}
            >
              Manage Projects
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap size={20} />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{education.length}</p>
            <p className="text-muted-foreground mt-1">Education entries</p>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => navigate("/dashboard/education")}
            >
              Manage Education
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Briefcase size={20} />
              Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{experience.length}</p>
            <p className="text-muted-foreground mt-1">Work experiences</p>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => navigate("/dashboard/experience")}
            >
              Manage Experience
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Basic Information</p>
                <p className="text-sm text-muted-foreground">
                  {profile?.full_name ? "✓ Added" : "❌ Missing"} Name
                </p>
              </div>
              {!profile?.full_name && (
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/dashboard/profile")}
                >
                  Add
                </Button>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Profile Image</p>
                <p className="text-sm text-muted-foreground">
                  {profile?.avatar_url ? "✓ Added" : "❌ Missing"} Profile Image
                </p>
              </div>
              {!profile?.avatar_url && (
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/dashboard/profile")}
                >
                  Add
                </Button>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Projects</p>
                <p className="text-sm text-muted-foreground">
                  {projects.length > 0 ? `✓ Added ${projects.length} project(s)` : "❌ No projects added"}
                </p>
              </div>
              {projects.length === 0 && (
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/dashboard/projects")}
                >
                  Add
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Project, Education, Experience } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Share2,
  Briefcase,
  GraduationCap,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";

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
          <div className="w-12 h-12 rounded-full border-4 border-black border-t-transparent animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate profile completion percentage
  const checklistItems = [
    { name: "Full Name", completed: !!profile?.full_name },
    { name: "Profile Image", completed: !!profile?.avatar_url },
    { name: "Bio", completed: !!profile?.bio },
    { name: "Projects", completed: projects.length > 0 },
    { name: "Education", completed: education.length > 0 },
    { name: "Experience", completed: experience.length > 0 },
  ];

  const completedItems = checklistItems.filter((item) => item.completed).length;
  const completionPercentage = Math.round(
    (completedItems / checklistItems.length) * 100,
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight mb-1">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1 text-lg">Manage and update your portfolio</p>
        </div>
        <Button
          onClick={() => navigate(`/portfolio/${user?.id}`)}
          variant="premium"
          className="flex items-center gap-2"
        >
          <Share2 size={16} />
          View Public Portfolio
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
        {[
          {
            title: "Projects",
            count: projects.length,
            icon: <FileText size={18} className="text-blue-500" />,
            path: "/dashboard/projects",
            color: "bg-blue-50 text-blue-500",
          },
          {
            title: "Education",
            count: education.length,
            icon: <GraduationCap size={18} className="text-purple-500" />,
            path: "/dashboard/education",
            color: "bg-purple-50 text-purple-500",
          },
          {
            title: "Experience",
            count: experience.length,
            icon: <Briefcase size={18} className="text-emerald-500" />,
            path: "/dashboard/experience",
            color: "bg-emerald-50 text-emerald-500",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="rounded-md shadow-md bg-white/90 backdrop-blur-md border border-gray-100 hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-medium text-gray-700">
                  {stat.title}
                </CardTitle>
                <div
                  className={`w-8 h-8 rounded-full ${stat.color} flex items-center justify-center`}
                >
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold text-gray-900">
                  {stat.count}
                </p>
                <p className="text-gray-500 text-sm mt-1">Total entries</p>
                <Button
                  variant="premium"
                  className="w-full mt-4 text-sm"
                  onClick={() => navigate(stat.path)}
                >
                  Manage {stat.title}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Profile Completion Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card className="rounded-md shadow-md bg-white/90 backdrop-blur-md border border-gray-100 hover:shadow-xl transition-all duration-300 mt-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-900">
              Profile Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">
                  {completionPercentage}% Complete
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {completedItems}/{checklistItems.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-black h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                />
              </div>
            </div>

            <div className="space-y-3">
              {checklistItems.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    {item.completed ? (
                      <CheckCircle size={18} className="text-green-500" />
                    ) : (
                      <XCircle size={18} className="text-gray-300" />
                    )}
                    <p className="font-medium text-gray-700">{item.name}</p>
                  </div>
                  {!item.completed && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-black hover:bg-gray-100 text-xs h-8"
                      onClick={() => {
                        if (
                          item.name === "Full Name" ||
                          item.name === "Profile Image" ||
                          item.name === "Bio"
                        ) {
                          navigate("/dashboard/profile");
                        } else if (item.name === "Projects") {
                          navigate("/dashboard/projects");
                        } else if (item.name === "Education") {
                          navigate("/dashboard/education");
                        } else if (item.name === "Experience") {
                          navigate("/dashboard/experience");
                        }
                      }}
                    >
                      Add
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

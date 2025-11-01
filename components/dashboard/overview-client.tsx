"use client";

import { useAuth } from '@/supabase/auth';
import { useDashboardData } from '../../app/(dashboard)/dashboard/dashboard-shell';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { IconShare, IconBriefcase, IconSchool, IconFileText, IconCheck, IconX, IconBook } from '@tabler/icons-react';
import { motion } from "framer-motion";
import { RefreshButton } from '@/components/ui/refresh-button';
import { generatePortfolioUrl } from '@/lib/utils/portfolio-url';
import type { Project, Education, Experience, Profile, Blog } from '@/supabase/types';

export default function OverviewClient() {
  const { user } = useAuth();
  const router = useRouter();

  // Get preloaded dashboard data from context
  const dashboardData = useDashboardData();

  // Extract data from preloaded context
  const projects = dashboardData?.projects || [];
  const education = dashboardData?.education || [];
  const experience = dashboardData?.experience || [];
  const blogs = dashboardData?.blogs || [];
  const profile = dashboardData?.profile || null;

  // Loading state - data should be instantly available from preloaded context
  const loading = !dashboardData;

  // Show loading state while data is being preloaded
  if (loading) {
    return (
      <div className="space-y-4 mt-16 md:mt-0 pt-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-7 w-24" />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-border">
          <Skeleton className="h-7 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-lg mt-8" />
      </div>
    );
  }

  // Calculate profile completion percentage
  const checklistItems = [
    { name: "Full Name", completed: !!(user?.user_metadata?.full_name || user?.user_metadata?.name) },
    { name: "Profile Image", completed: !!(user?.user_metadata?.avatar_url || user?.user_metadata?.picture) },
    { name: "Bio", completed: !!(profile?.bio) },
    { name: "Projects", completed: projects.length > 0 },
    { name: "Education", completed: education.length > 0 },
    { name: "Experience", completed: experience.length > 0 },
    { name: "Blog Posts", completed: blogs.length > 0 },
  ];

  const completedItems = checklistItems.filter((item) => item.completed).length;
  const completionPercentage = Math.round(
    (completedItems / checklistItems.length) * 100,
  );

  // Stats from actual data arrays

  return (
    <div className="space-y-4 mt-16 md:mt-0 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium">Dashboard Overview</h1>
        <RefreshButton size="sm" variant="ghost" />
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-border">
        <Button
          onClick={() => router.push(generatePortfolioUrl(user, profile))}
          variant="secondary"
          size="sm"
          className="flex items-center text-xs rounded-full border-border hover:bg-accent hover:text-accent-foreground"
        >
          <IconShare size={16} className="mr-1"/>
          View Public Portfolio
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        {[
          {
            title: "Projects",
            count: projects.length,
            icon: <IconFileText size={18} className="text-primary" />,
            path: "/dashboard/projects",
            description: "Manage and showcase your portfolio projects",
          },
          {
            title: "Education",
            count: education.length,
            icon: <IconSchool size={18} className="text-primary" />,
            path: "/dashboard/education",
            description: "Academic background and certifications"
          },
          {
            title: "Experience",
            count: experience.length,
            icon: <IconBriefcase size={18} className="text-primary" />,
            path: "/dashboard/experience",
            description: "Work history and professional experience"
          },
          {
            title: "Blog Posts",
            count: blogs.length,
            icon: <IconBook size={18} className="text-primary" />,
            path: "/dashboard/blogs",
            description: "Write and share your thoughts and insights"
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card hover gradient className="h-full">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-medium">
                  {stat.title}
                </CardTitle>
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-medium mb-2">
                  {stat.count}
                </p>
                <p className="text-muted-foreground text-sm mb-6">{stat.description}</p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full rounded-full cursor-pointer"
                  onClick={() => router.push(stat.path)}
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
        transition={{ duration: 0.3, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card hover className="mt-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              Profile Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  {completionPercentage}% Complete
                </span>
                <span className="text-sm font-medium">
                  {completedItems}/{checklistItems.length}
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <motion.div
                  className={`${completionPercentage > 70 ? 'bg-success' : 'bg-primary'} h-2 rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>

            <div className="space-y-2 divide-y divide-border/60">
              {checklistItems.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-3 first:pt-0 group"
                >
                  <div className="flex items-center gap-3">
                    {item.completed ? (
                      <IconCheck size={16} className="text-success" />
                    ) : (
                      <IconX size={16} className="text-muted-foreground opacity-50" />
                    )}
                    <p className={`font-medium ${item.completed ? 'text-foreground' : 'text-muted-foreground'}`}>{item.name}</p>
                  </div>
                  {!item.completed && (
                    <Button
                      variant="default"
                      size="sm"
                      className="opacity-80 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
                      onClick={() => {
                        if (
                          item.name === "Full Name" ||
                          item.name === "Profile Image" ||
                          item.name === "Bio"
                        ) {
                          router.push("/dashboard/profile-settings");
                        } else if (item.name === "Projects") {
                          router.push("/dashboard/projects");
                        } else if (item.name === "Education") {
                          router.push("/dashboard/education");
                        } else if (item.name === "Experience") {
                          router.push("/dashboard/experience");
                        } else if (item.name === "Blog Posts") {
                          router.push("/dashboard/blogs");
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

"use client"

import { useState, useEffect } from "react";
import { useUser } from '@clerk/nextjs';
import { useClerkSupabaseClient } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

type Template = {
  id: string;
  name: string;
  description: string;
  previewImage: string;
};

const TEMPLATES: Template[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and simple design with focus on content.",
    previewImage: "https://placehold.co/300x200/000000/FFFFFF?text=Minimal",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary design with bold typography.",
    previewImage: "https://placehold.co/300x200/333333/FFFFFF?text=Modern",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Expressive design for creative professionals.",
    previewImage: "https://placehold.co/300x200/666666/FFFFFF?text=Creative",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Traditional corporate style for business profiles.",
    previewImage: "https://placehold.co/300x200/1A1F2C/FFFFFF?text=Professional",
  },
];

export default function Templates() {
  const supabase = useClerkSupabaseClient();
  const { user } = useUser();
  const [selectedTemplate, setSelectedTemplate] = useState<string>("minimal");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.unsafeMetadata?.selected_template) {
      setSelectedTemplate(user.unsafeMetadata.selected_template as string);
    }
  }, [user]);

  // Show loading spinner if supabase client is not ready
  if (!supabase) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
          <p className="mt-3 text-xs text-gray-500">Loading Templates...</p>
        </div>
      </div>
    );
  }

  const handleTemplateSelect = async (templateId: string) => {
    if (!user || !supabase) return;
    if (templateId === selectedTemplate) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ selected_template: templateId })
        .eq("id", user.id);

      if (error) throw error;

      setSelectedTemplate(templateId);
      await user.update({ unsafeMetadata: { ...user.unsafeMetadata, selected_template: templateId } });
      toast.success(
        `Template changed to ${TEMPLATES.find((t) => t.id === templateId)?.name}`,
      );
    } catch (error: any) {
      toast.error(error.message || "Error changing template");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 mt-16 md:mt-0 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium">Templates</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEMPLATES.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className={`overflow-hidden border-gray-200 shadow-none transition-all duration-200 hover:shadow-sm ${
              selectedTemplate === template.id
                ? "ring-2 ring-black"
                : ""
            }`}>
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={template.previewImage}
                  alt={template.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-sm font-medium">{template.name}</h3>
                <p className="mt-1 text-xs text-gray-500">
                  {template.description}
                </p>
              </CardContent>
              <CardFooter className="border-t border-gray-100 p-3">
                {selectedTemplate === template.id ? (
                  <Button className="h-7 w-full rounded-full text-xs" disabled
                  // className="h-7 rounded-full border-gray-200 px-3 text-xs hover:bg-gray-50 hover:text-black"
                  >
                    <Check className="mr-1.5 h-3.5 w-3.5" /> Selected
                  </Button>
                ) : (
                  <Button
                    className="h-7 w-full rounded-full text-xs"
                    onClick={() => handleTemplateSelect(template.id)}
                    disabled={loading}
                  >
                    Use Template
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
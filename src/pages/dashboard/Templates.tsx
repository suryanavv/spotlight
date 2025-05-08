import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";

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
    previewImage:
      "https://placehold.co/300x200/1A1F2C/FFFFFF?text=Professional",
  },
];

export default function Templates() {
  const { user, profile, refreshProfile } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<string>("minimal");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile?.selected_template) {
      setSelectedTemplate(profile.selected_template);
    }
  }, [profile]);

  const handleTemplateSelect = async (templateId: string) => {
    if (!user) return;
    if (templateId === selectedTemplate) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ selected_template: templateId })
        .eq("id", user.id);

      if (error) throw error;

      setSelectedTemplate(templateId);
      await refreshProfile();
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
    <div className="space-y-12">
      <div className="pb-4 border-b border-gray-100">
        <h1 className="text-3xl font-extrabold text-black tracking-tight mb-1">Choose a Template</h1>
        <p className="text-gray-500 mt-1 text-lg">Select a template for your public portfolio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
        {TEMPLATES.map((template) => (
          <Card
            key={template.id}
            className={`rounded-md shadow-md bg-white/90 backdrop-blur-md border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden ${
              selectedTemplate === template.id
                ? "ring-2 ring-black ring-offset-2"
                : "hover:shadow-md"
            }`}
          >
            <img
              src={template.previewImage}
              alt={template.name}
              className="w-full h-40 object-cover"
            />
            <CardContent className="pt-4">
              <h3 className="font-medium text-lg">{template.name}</h3>
              <p className="text-muted-foreground text-sm mt-1">
                {template.description}
              </p>
            </CardContent>
            <CardFooter className="border-t p-4">
              {selectedTemplate === template.id ? (
                <Button variant="premium" className="w-full" disabled>
                  <Check className="mr-2 h-4 w-4" /> Selected
                </Button>
              ) : (
                <Button
                  variant="premium"
                  className="w-full"
                  onClick={() => handleTemplateSelect(template.id)}
                  disabled={loading}
                >
                  Use This Template
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

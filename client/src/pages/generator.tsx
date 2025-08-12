import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SessionForm } from "@/components/session/session-form";
import { SessionPreview } from "@/components/session/session-preview";
import { SessionResults } from "@/components/session/session-results";
import type { SessionGeneration } from "@shared/schema";

export default function Generator() {
  const { toast } = useToast();
  const [generatedSession, setGeneratedSession] = useState<any>(null);
  
  const generateMutation = useMutation({
    mutationFn: async (params: SessionGeneration) => {
      const res = await apiRequest("POST", "/api/sessions/generate", params);
      return await res.json();
    },
    onSuccess: (session) => {
      setGeneratedSession(session);
      toast({
        title: "Session Generated!",
        description: "Your training session has been created successfully.",
      });
    },
    onError: (error: any) => {
      const errorMessage = error.message.includes("Generation limit reached") 
        ? "You've reached your monthly generation limit. Upgrade to Pro for unlimited sessions."
        : "Failed to generate session. Please try again.";
      
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleGenerate = (params: SessionGeneration) => {
    generateMutation.mutate(params);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Generate Training Session</h1>
          <p className="text-slate-600">Create a customized football training session plan</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-2">
            <SessionForm 
              onGenerate={handleGenerate}
              isGenerating={generateMutation.isPending}
            />
          </div>

          {/* Preview Column */}
          <div className="lg:col-span-1">
            <SessionPreview />
          </div>
        </div>

        {/* Generation Results */}
        {generatedSession && (
          <SessionResults 
            session={generatedSession} 
            onClose={() => setGeneratedSession(null)}
          />
        )}
      </main>

      <MobileNav />
    </div>
  );
}

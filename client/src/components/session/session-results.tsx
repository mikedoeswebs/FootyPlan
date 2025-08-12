import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EquipmentIcons, PracticeEquipmentSummary } from "@/components/ui/equipment-icons";
import { Download, Save, X, Clock, Users, Target } from "lucide-react";

interface SessionResultsProps {
  session: any;
  onClose: () => void;
}

export function SessionResults({ session, onClose }: SessionResultsProps) {
  const { toast } = useToast();

  const saveMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      console.log("Saving session data:", sessionData);
      const res = await apiRequest("POST", "/api/sessions", sessionData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      toast({
        title: "Session Saved!",
        description: "Your training session has been saved successfully.",
      });
    },
    onError: (error) => {
      console.error("Save session error:", error);
      toast({
        title: "Save Failed",
        description: "Failed to save session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    console.log("Save button clicked, session data:", session);
    
    // Transform the session data to match the database schema
    const sessionToSave = {
      title: session.title,
      sessionType: session.session_type || session.sessionType,
      sessionFocus: session.session_focus || session.sessionFocus,
      durationMinutes: session.duration_minutes || session.durationMinutes,
      participants: session.participants,
      level: session.level,
      objectives: session.objectives || [],
      equipment: session.equipment || [],
      safetyNotes: session.safety_notes || session.safetyNotes || [],
      warmup: session.warmup || {},
      practices: session.practices || [],
      smallSidedGame: session.small_sided_game || session.smallSidedGame || {},
      cooldown: session.cooldown || {},
      diagrams: session.diagrams || {}
    };
    
    console.log("Transformed session to save:", sessionToSave);
    saveMutation.mutate(sessionToSave);
  };

  const handleDownloadPDF = () => {
    // In a real implementation, this would generate and download a PDF
    toast({
      title: "PDF Download",
      description: "PDF download functionality will be implemented soon.",
    });
  };



  return (
    <div className="mt-8" data-testid="session-results">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Generated Session</h2>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleDownloadPDF}
                data-testid="button-download-pdf"
              >
                <Download className="mr-2 w-4 h-4" />
                Download PDF
              </Button>
              <Button
                onClick={handleSave}
                disabled={saveMutation.isPending}
                data-testid="button-save-session"
              >
                <Save className="mr-2 w-4 h-4" />
                Save Session
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                data-testid="button-close-results"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Session Header */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-2" data-testid="session-title">
              {session.title}
            </h3>
            
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{session.duration_minutes} minutes</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{session.participants} players</span>
              </Badge>
              <Badge variant="outline" className="capitalize">
                {session.session_type}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {session.session_focus}
              </Badge>
              {session.level && (
                <Badge variant="outline" className="capitalize">
                  {session.level}
                </Badge>
              )}
            </div>
          </div>

          {/* Session Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
                <Target className="mr-2 w-4 h-4" />
                Objectives
              </h4>
              <ul className="text-sm space-y-1 text-slate-600">
                {session.objectives?.map((objective: string, index: number) => (
                  <li key={index}>• {objective}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-2">Equipment</h4>
              <EquipmentIcons equipment={session.equipment || []} />
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-2">Safety Notes</h4>
              <ul className="text-sm space-y-1 text-slate-600">
                {session.safety_notes?.map((note: string, index: number) => (
                  <li key={index}>• {note}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Session Structure */}
          <div className="space-y-6">
            {/* Warm-up */}
            {session.warmup && (
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-slate-900 mb-2">
                  Warm-up ({session.warmup.duration_minutes} minutes)
                </h4>
                <p className="text-slate-700">{session.warmup.description}</p>
              </div>
            )}

            {/* Main Practices */}
            {session.practices?.map((practice: any, index: number) => (
              <div key={index} className="border-l-4 border-primary pl-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-slate-900">
                    Practice {index + 1}: {practice.name} ({practice.duration_minutes} min)
                  </h4>
                  <Badge variant="outline">
                    Difficulty: {practice.difficulty_level}/5
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Setup:</p>
                    <p className="text-slate-700">{practice.setup_description}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Area:</p>
                    <p className="text-slate-700">
                      {practice.area_meters?.[0]} x {practice.area_meters?.[1]} meters
                    </p>
                  </div>
                </div>

                <PracticeEquipmentSummary practice={practice} />

                {practice.steps && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-slate-600 mb-2">Steps:</p>
                    <ol className="list-decimal list-inside text-slate-700 space-y-1">
                      {practice.steps.map((step: string, stepIndex: number) => (
                        <li key={stepIndex}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {practice.coaching_points && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-slate-600 mb-2">Coaching Points:</p>
                    <ul className="list-disc list-inside text-slate-700 space-y-1">
                      {practice.coaching_points.map((point: string, pointIndex: number) => (
                        <li key={pointIndex}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {practice.diagram_svg && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-slate-600 mb-2">Diagram:</p>
                    <div className="bg-white border rounded p-4 max-w-md">
                      <div 
                        dangerouslySetInnerHTML={{ __html: practice.diagram_svg }} 
                        className="[&_svg]:w-full [&_svg]:h-auto"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Small-sided Game */}
            {session.small_sided_game && (
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-slate-900 mb-2">
                  Small-sided Game ({session.small_sided_game.duration_minutes} minutes)
                </h4>
                <p className="text-slate-700">{session.small_sided_game.description}</p>
              </div>
            )}

            {/* Cool-down */}
            {session.cooldown && (
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-slate-900 mb-2">
                  Cool-down ({session.cooldown.duration_minutes} minutes)
                </h4>
                <p className="text-slate-700">{session.cooldown.description}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

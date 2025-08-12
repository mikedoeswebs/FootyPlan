import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Clock, Users, Target } from "lucide-react";

export default function SessionView() {
  const [location, setLocation] = useLocation();
  const sessionId = location.split('/')[2]; // Extract ID from /sessions/:id

  const { data: session, isLoading } = useQuery<any>({
    queryKey: [`/api/sessions/${sessionId}`],
    enabled: !!sessionId,
  });

  const handleDownloadJSON = () => {
    if (!session) return;
    
    const dataStr = JSON.stringify(session, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${session.title}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <MobileNav />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Session Not Found</h2>
              <p className="text-slate-600 mb-6">The requested training session could not be found.</p>
              <Button onClick={() => setLocation('/sessions')}>
                Back to Sessions
              </Button>
            </CardContent>
          </Card>
        </div>
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation('/sessions')}
            className="flex items-center space-x-2"
            data-testid="button-back-to-sessions"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sessions</span>
          </Button>
        </div>

        <Card data-testid="session-view">
          <CardContent className="p-6">
            {/* Session Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2" data-testid="session-title">
                  {session.title}
                </h1>
                <p className="text-slate-600">
                  Created on {new Date(session.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Button
                onClick={handleDownloadJSON}
                variant="outline"
                data-testid="button-download-session"
              >
                <Download className="mr-2 w-4 h-4" />
                Download JSON
              </Button>
            </div>

            {/* Session Info Badges */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{session.durationMinutes} minutes</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{session.participants} players</span>
              </Badge>
              <Badge 
                variant="outline" 
                className={`capitalize ${
                  session.sessionType === 'outfield' 
                    ? 'bg-primary/10 text-primary border-primary/20' 
                    : 'bg-secondary/10 text-secondary border-secondary/20'
                }`}
              >
                {session.sessionType}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {session.sessionFocus}
              </Badge>
              {session.level && (
                <Badge variant="outline" className="capitalize">
                  {session.level}
                </Badge>
              )}
            </div>

            {/* Session Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                  <Target className="mr-2 w-4 h-4" />
                  Objectives
                </h3>
                <ul className="text-sm space-y-1 text-slate-600">
                  {session.objectives?.map((objective: string, index: number) => (
                    <li key={index}>• {objective}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-3">Equipment</h3>
                <ul className="text-sm space-y-1 text-slate-600">
                  {session.equipment?.map((item: string, index: number) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-3">Safety Notes</h3>
                <ul className="text-sm space-y-1 text-slate-600">
                  {session.safetyNotes?.map((note: string, index: number) => (
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
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Warm-up ({session.warmup.duration_minutes} minutes)
                  </h3>
                  <h4 className="font-medium text-slate-800 mb-1">{session.warmup.name}</h4>
                  <p className="text-slate-700">{session.warmup.description}</p>
                </div>
              )}

              {/* Main Practices */}
              {session.practices?.map((practice: any, index: number) => (
                <div key={index} className="border-l-4 border-primary pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-900">
                      Practice {index + 1}: {practice.name} ({practice.duration_minutes} min)
                    </h3>
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
                      <p className="text-sm font-medium text-slate-600 mb-1">Area & Players:</p>
                      <p className="text-slate-700">
                        {practice.area_meters?.[0]} x {practice.area_meters?.[1]} meters • {practice.players_required} players
                      </p>
                    </div>
                  </div>

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

                  {practice.aims && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-slate-600 mb-2">Aims:</p>
                      <ul className="list-disc list-inside text-slate-700 space-y-1">
                        {practice.aims.map((aim: string, aimIndex: number) => (
                          <li key={aimIndex}>{aim}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {practice.diagram_svg && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-slate-600 mb-2">Diagram:</p>
                      <div className="bg-white border rounded p-4">
                        <div dangerouslySetInnerHTML={{ __html: practice.diagram_svg }} />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Small-sided Game */}
              {session.smallSidedGame && (
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Small-sided Game ({session.smallSidedGame.duration_minutes} minutes)
                  </h3>
                  <p className="text-slate-700">{session.smallSidedGame.description}</p>
                </div>
              )}

              {/* Cool-down */}
              {session.cooldown && (
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Cool-down ({session.cooldown.duration_minutes} minutes)
                  </h3>
                  <p className="text-slate-700">{session.cooldown.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  );
}

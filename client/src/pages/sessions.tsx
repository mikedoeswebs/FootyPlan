import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Download, 
  Eye, 
  Trash2, 
  Clock, 
  Users, 
  Calendar,
  FolderOpen
} from "lucide-react";

export default function Sessions() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [focusFilter, setFocusFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");

  const { data: sessions = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/sessions"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      await apiRequest("DELETE", `/api/sessions/${sessionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
      toast({
        title: "Session Deleted",
        description: "Training session has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Delete Failed",
        description: "Failed to delete session. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Filter sessions
  const filteredSessions = sessions.filter((session: any) => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || session.sessionType === typeFilter;
    const matchesFocus = focusFilter === "all" || session.sessionFocus === focusFilter;
    const matchesDuration = durationFilter === "all" || session.durationMinutes.toString() === durationFilter;
    
    return matchesSearch && matchesType && matchesFocus && matchesDuration;
  });

  const handleDelete = (sessionId: string) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      deleteMutation.mutate(sessionId);
    }
  };

  const handleDownloadJSON = (session: any) => {
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

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">My Sessions</h1>
              <p className="text-slate-600">Manage and view your generated training sessions</p>
            </div>
            <Button
              onClick={() => setLocation('/generate')}
              className="mt-4 md:mt-0"
              data-testid="button-new-session"
            >
              <Plus className="mr-2 w-4 h-4" />
              New Session
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="block text-sm font-medium text-slate-700 mb-2">Filter by Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger data-testid="filter-type">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="outfield">Outfield</SelectItem>
                    <SelectItem value="goalkeeping">Goalkeeping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-slate-700 mb-2">Focus Area</Label>
                <Select value={focusFilter} onValueChange={setFocusFilter}>
                  <SelectTrigger data-testid="filter-focus">
                    <SelectValue placeholder="All Focus Areas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Focus Areas</SelectItem>
                    <SelectItem value="passing">Passing</SelectItem>
                    <SelectItem value="defending">Defending</SelectItem>
                    <SelectItem value="shooting">Shooting</SelectItem>
                    <SelectItem value="diving">Diving</SelectItem>
                    <SelectItem value="handling">Handling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-slate-700 mb-2">Duration</Label>
                <Select value={durationFilter} onValueChange={setDurationFilter}>
                  <SelectTrigger data-testid="filter-duration">
                    <SelectValue placeholder="All Durations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Durations</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-slate-700 mb-2">Search</Label>
                <Input
                  type="text"
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  data-testid="input-search"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sessions List */}
        {filteredSessions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FolderOpen className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Sessions Found</h3>
              <p className="text-slate-600 mb-6">
                {sessions.length === 0 
                  ? "You haven't generated any training sessions yet."
                  : "No sessions match your current filters."
                }
              </p>
              {sessions.length === 0 && (
                <Button onClick={() => setLocation('/generate')} data-testid="button-create-first-session">
                  <Plus className="mr-2 w-4 h-4" />
                  Create Your First Session
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((session: any) => (
              <Card key={session.id} data-testid={`session-card-${session.id}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-slate-900 mb-1">
                            {session.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-slate-600">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Created {new Date(session.createdAt).toLocaleDateString()}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{session.durationMinutes} minutes</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{session.participants} players</span>
                            </span>
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={session.sessionType === 'outfield' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-secondary/10 text-secondary border-secondary/20'}
                        >
                          {session.sessionType === 'outfield' ? 'Outfield' : 'Goalkeeping'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-slate-600">
                        <span>
                          <strong>Focus:</strong> <span className="capitalize">{session.sessionFocus}</span>
                        </span>
                        {session.level && (
                          <span>
                            <strong>Level:</strong> <span className="capitalize">{session.level}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadJSON(session)}
                        title="Download JSON"
                        data-testid={`button-download-${session.id}`}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setLocation(`/sessions/${session.id}`)}
                        title="View Session"
                        data-testid={`button-view-${session.id}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(session.id)}
                        title="Delete Session"
                        className="text-red-400 hover:text-red-600"
                        data-testid={`button-delete-${session.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <MobileNav />
    </div>
  );
}

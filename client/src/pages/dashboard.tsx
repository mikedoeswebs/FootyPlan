import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { 
  ClipboardList, 
  Calendar, 
  Battery, 
  Crown, 
  ArrowRight,
  Users,
  HandMetal,
  Eye,
  ChartLine,
  PlusCircle,
  Folder,
  CreditCard
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: stats } = useQuery<any>({
    queryKey: ["/api/user/stats"],
  });

  const { data: sessions } = useQuery<any[]>({
    queryKey: ["/api/sessions"],
  });

  const recentSessions = sessions?.slice(0, 3) || [];

  const quickGenerate = (type: string, focus: string) => {
    setLocation(`/generate?type=${type}&focus=${focus}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {user?.username}
          </h1>
          <p className="text-slate-600">Generate and manage your football training sessions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card data-testid="card-total-sessions">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Sessions Generated</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats?.totalSessions || 0}
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <ClipboardList className="text-primary text-xl w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-monthly-sessions">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">This Month</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats?.monthlyGenerations || 0}
                  </p>
                </div>
                <div className="p-3 bg-secondary/10 rounded-full">
                  <Calendar className="text-secondary text-xl w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-remaining-sessions">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Remaining</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats?.remainingGenerations === -1 
                      ? "∞" 
                      : stats?.remainingGenerations || 0
                    }
                  </p>
                </div>
                <div className="p-3 bg-warning/10 rounded-full">
                  <Battery className="text-warning text-xl w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-plan-status">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Plan Status</p>
                  <p className="text-lg font-semibold text-slate-900 capitalize">
                    {user?.planType || 'Free'} Plan
                  </p>
                </div>
                <div className="p-3 bg-success/10 rounded-full">
                  <Crown className="text-success text-xl w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card data-testid="card-quick-generate">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Generate</h2>
              <p className="text-slate-600 mb-6">Generate a training session with common settings</p>
              
              <div className="space-y-4">
                <Button
                  onClick={() => quickGenerate('outfield', 'passing')}
                  variant="outline"
                  className="w-full flex items-center justify-between p-4 h-auto bg-primary/5 hover:bg-primary/10 border-primary/20"
                  data-testid="button-quick-outfield"
                >
                  <div className="flex items-center space-x-3">
                    <Users className="text-primary w-5 h-5" />
                    <span className="font-medium text-slate-900">Outfield Passing</span>
                  </div>
                  <ArrowRight className="text-primary w-4 h-4" />
                </Button>
                
                <Button
                  onClick={() => quickGenerate('goalkeeping', 'shot-stopping')}
                  variant="outline"
                  className="w-full flex items-center justify-between p-4 h-auto bg-secondary/5 hover:bg-secondary/10 border-secondary/20"
                  data-testid="button-quick-goalkeeping"
                >
                  <div className="flex items-center space-x-3">
                    <HandMetal className="text-secondary w-5 h-5" />
                    <span className="font-medium text-slate-900">GK Shot-stopping</span>
                  </div>
                  <ArrowRight className="text-secondary w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-recent-sessions">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Sessions</h2>
              
              {recentSessions.length === 0 ? (
                <div className="text-center py-6 text-slate-500">
                  <ClipboardList className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="font-medium mb-1">No sessions yet</p>
                  <p className="text-sm">Generate your first training session to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentSessions.map((session: any) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                      data-testid={`session-${session.id}`}
                    >
                      <div>
                        <h3 className="font-medium text-slate-900">{session.title}</h3>
                        <p className="text-sm text-slate-500">
                          {new Date(session.createdAt).toLocaleDateString()} • {session.durationMinutes} min • {session.participants} players
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setLocation(`/sessions/${session.id}`)}
                        data-testid={`button-view-session-${session.id}`}
                      >
                        <Eye className="text-primary w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <Button
                variant="ghost"
                className="w-full mt-4 text-primary hover:text-primary/80 font-medium"
                onClick={() => setLocation('/sessions')}
                data-testid="button-view-all-sessions"
              >
                View All Sessions <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Upgrade Banner for Free Users */}
        {user?.planType === 'free' && (
          <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-semibold mb-2">Unlock Unlimited Sessions</h3>
                <p className="text-white/90">Upgrade to Pro for unlimited session generations and premium features</p>
              </div>
              <Button
                onClick={() => setLocation('/billing')}
                className="bg-white text-primary hover:bg-slate-50"
                data-testid="button-upgrade"
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        )}
      </main>

      <MobileNav />
    </div>
  );
}

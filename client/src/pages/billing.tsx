import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  Check, 
  X, 
  Info,
  Receipt,
  AlertTriangle
} from "lucide-react";

export default function Billing() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ["/api/user/stats"],
  });

  const upgradeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/create-subscription");
      return await res.json();
    },
    onSuccess: (data) => {
      if (data.clientSecret) {
        // In a real implementation, this would redirect to Stripe Checkout
        // or use Stripe Elements for payment processing
        toast({
          title: "Upgrade Process",
          description: "Stripe integration would handle payment processing here.",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: any) => {
      toast({
        title: "Upgrade Failed",
        description: error.message || "Failed to start upgrade process",
        variant: "destructive",
      });
    },
  });

  const handleUpgrade = () => {
    setIsUpgrading(true);
    upgradeMutation.mutate();
    setIsUpgrading(false);
  };

  const resetDate = user?.resetDate ? new Date(user.resetDate) : new Date();

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Billing & Subscription</h1>
          <p className="text-slate-600">Manage your subscription and billing information</p>
        </div>

        {/* Current Plan */}
        <Card className="mb-8" data-testid="current-plan-card">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-slate-900 capitalize">
                  {user?.planType || 'Free'} Plan
                </h3>
                <p className="text-slate-600">
                  {user?.planType === 'pro' 
                    ? 'Unlimited session generations' 
                    : '5 session generations per month'
                  }
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {user?.planType === 'pro' ? (
                    `Unlimited generations available`
                  ) : (
                    `${user?.generationsUsed || 0} of ${user?.generationsLimit || 5} generations used this month`
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-slate-900">
                  {user?.planType === 'pro' ? '$19' : '$0'}
                </p>
                <p className="text-slate-600">per month</p>
              </div>
            </div>

            {user?.planType === 'free' && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Info className="text-blue-500 mt-0.5 w-4 h-4" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium">Usage resets monthly</p>
                    <p>Your generation count will reset on {resetDate.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}

            {user?.planType === 'pro' && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Crown className="text-green-500 mt-0.5 w-4 h-4" />
                  <div className="text-sm text-green-700">
                    <p className="font-medium">Pro Plan Active</p>
                    <p>You have unlimited access to all FootyPlan features</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Free Plan */}
          <Card data-testid="free-plan-card">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Free Plan</h3>
                <p className="text-3xl font-bold text-slate-900">
                  $0<span className="text-lg font-normal text-slate-600">/month</span>
                </p>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-3">
                  <Check className="text-success w-4 h-4" />
                  <span className="text-slate-700">5 training sessions per month</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="text-success w-4 h-4" />
                  <span className="text-slate-700">PDF export</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="text-success w-4 h-4" />
                  <span className="text-slate-700">Basic session customization</span>
                </li>
                <li className="flex items-center space-x-3">
                  <X className="text-slate-400 w-4 h-4" />
                  <span className="text-slate-400">Unlimited generations</span>
                </li>
                <li className="flex items-center space-x-3">
                  <X className="text-slate-400 w-4 h-4" />
                  <span className="text-slate-400">Priority support</span>
                </li>
              </ul>
              
              <Button 
                disabled 
                variant="outline"
                className="w-full cursor-not-allowed"
                data-testid="current-plan-button"
              >
                {user?.planType === 'free' ? 'Current Plan' : 'Downgrade Available'}
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-2 border-primary relative" data-testid="pro-plan-card">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-white px-4 py-1">
                Recommended
              </Badge>
            </div>
            
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Pro Plan</h3>
                <p className="text-3xl font-bold text-slate-900">
                  $19<span className="text-lg font-normal text-slate-600">/month</span>
                </p>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-3">
                  <Check className="text-success w-4 h-4" />
                  <span className="text-slate-700">Unlimited training sessions</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="text-success w-4 h-4" />
                  <span className="text-slate-700">PDF & JSON export</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="text-success w-4 h-4" />
                  <span className="text-slate-700">Advanced customization</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="text-success w-4 h-4" />
                  <span className="text-slate-700">Session templates</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="text-success w-4 h-4" />
                  <span className="text-slate-700">Priority support</span>
                </li>
              </ul>
              
              {user?.planType === 'pro' ? (
                <Button 
                  disabled 
                  variant="outline"
                  className="w-full cursor-not-allowed"
                  data-testid="current-pro-plan-button"
                >
                  Current Plan
                </Button>
              ) : (
                <Button
                  onClick={handleUpgrade}
                  disabled={isUpgrading || upgradeMutation.isPending}
                  className="w-full bg-primary hover:bg-primary/90"
                  data-testid="upgrade-to-pro-button"
                >
                  {isUpgrading || upgradeMutation.isPending ? 'Processing...' : 'Upgrade to Pro'}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stripe Integration Notice */}
        {!import.meta.env.VITE_STRIPE_PUBLIC_KEY && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="text-warning w-5 h-5 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Stripe Integration Required</h3>
                  <p className="text-slate-600 mb-4">
                    To enable subscription billing, please configure your Stripe API keys:
                  </p>
                  <div className="bg-slate-50 p-4 rounded-lg text-sm">
                    <ol className="list-decimal list-inside space-y-2 text-slate-700">
                      <li>Go to <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="text-primary underline">dashboard.stripe.com/apikeys</a></li>
                      <li><code className="bg-slate-200 px-1 rounded">VITE_STRIPE_PUBLIC_KEY</code> - copy your "Publishable key" (starts with <code>pk_</code>)</li>
                      <li><code className="bg-slate-200 px-1 rounded">STRIPE_SECRET_KEY</code> - copy your "Secret key" (starts with <code>sk_</code>)</li>
                      <li><code className="bg-slate-200 px-1 rounded">STRIPE_PRICE_ID</code> - get from <a href="https://dashboard.stripe.com/products" target="_blank" rel="noopener noreferrer" className="text-primary underline">dashboard.stripe.com/products</a> (starts with <code>price_</code>)</li>
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Billing History */}
        <Card data-testid="billing-history-card">
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-slate-500">
              <Receipt className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium mb-2">No billing history</h3>
              <p>Your billing history will appear here once you upgrade to a paid plan.</p>
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  );
}

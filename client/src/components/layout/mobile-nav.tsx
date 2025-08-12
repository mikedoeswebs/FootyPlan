import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChartLine, PlusCircle, Folder, CreditCard } from "lucide-react";

export function MobileNav() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { path: "/", icon: ChartLine, label: "Dashboard", testId: "mobile-nav-dashboard" },
    { path: "/generate", icon: PlusCircle, label: "Generate", testId: "mobile-nav-generate" },
    { path: "/sessions", icon: Folder, label: "Sessions", testId: "mobile-nav-sessions" },
    { path: "/billing", icon: CreditCard, label: "Billing", testId: "mobile-nav-billing" },
  ];

  return (
    <div className="md:hidden bg-white border-t border-slate-200 fixed bottom-0 left-0 right-0 z-50">
      <div className="flex">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              onClick={() => setLocation(item.path)}
              className={`flex-1 flex flex-col items-center py-2 h-auto ${
                isActive ? "text-primary" : "text-slate-400"
              }`}
              data-testid={item.testId}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

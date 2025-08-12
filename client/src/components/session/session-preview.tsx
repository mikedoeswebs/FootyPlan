import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Info } from "lucide-react";

export function SessionPreview() {
  const { user } = useAuth();
  
  const remainingGenerations = user?.planType === 'pro' 
    ? -1 
    : Math.max(0, (user?.generationsLimit || 5) - (user?.generationsUsed || 0));

  return (
    <div className="space-y-6">
      <Card data-testid="session-preview">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Session Preview</h3>
          
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Type:</span>
              <span className="font-medium text-slate-900" data-testid="preview-type">Outfield</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Focus:</span>
              <span className="font-medium text-slate-900" data-testid="preview-focus">Passing</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Duration:</span>
              <span className="font-medium text-slate-900" data-testid="preview-duration">60 minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Players:</span>
              <span className="font-medium text-slate-900" data-testid="preview-players">14 participants</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h4 className="font-medium text-slate-900 mb-2">Expected Structure:</h4>
            <ul className="space-y-1 text-sm text-slate-600">
              <li>• Warm-up (10-15 min)</li>
              <li>• Main practices (3-4 drills)</li>
              <li>• Small-sided game (10-15 min)</li>
              <li>• Cool down (5-10 min)</li>
            </ul>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-2">
              <Info className="text-blue-500 mt-0.5 w-4 h-4" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">AI Generated Content</p>
                <p>Each session is uniquely generated using advanced AI to ensure fresh, relevant training content.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Reminder */}
      {user?.planType === 'free' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4" data-testid="usage-warning">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="text-yellow-600 w-4 h-4" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800">Free Plan Limit</p>
              <p className="text-yellow-700">
                {remainingGenerations} generation{remainingGenerations !== 1 ? 's' : ''} remaining this month
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

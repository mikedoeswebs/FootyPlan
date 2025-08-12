import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Zap } from "lucide-react";

interface LoadingOverlayProps {
  isVisible: boolean;
  phrases: string[];
}

export function LoadingOverlay({ isVisible, phrases }: LoadingOverlayProps) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentPhrase, setCurrentPhrase] = useState(phrases[0] || "Generating session...");

  useEffect(() => {
    if (!isVisible || phrases.length === 0) return;

    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 2000); // Change phrase every 2 seconds

    return () => clearInterval(interval);
  }, [isVisible, phrases.length]);

  useEffect(() => {
    setCurrentPhrase(phrases[currentPhraseIndex] || "Generating session...");
  }, [currentPhraseIndex, phrases]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="loading-overlay">
      <Card className="w-96 mx-4">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="relative">
              <Zap className="w-16 h-16 mx-auto text-primary mb-4" />
              <Loader2 className="w-6 h-6 absolute top-0 right-1/2 translate-x-1/2 animate-spin text-primary" />
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Generating Your Session
          </h3>
          
          <div className="min-h-[3rem] flex items-center justify-center">
            <p className="text-slate-600 text-center transition-all duration-500 ease-in-out">
              {currentPhrase}
            </p>
          </div>
          
          <div className="mt-6">
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
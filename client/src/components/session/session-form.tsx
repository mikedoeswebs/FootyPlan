import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Wand2, Users, HandMetal } from "lucide-react";
import type { SessionGeneration } from "@shared/schema";

interface SessionFormProps {
  onGenerate: (params: SessionGeneration) => void;
  isGenerating: boolean;
}

export function SessionForm({ onGenerate, isGenerating }: SessionFormProps) {
  const [sessionType, setSessionType] = useState<"outfield" | "goalkeeping">("outfield");
  const [sessionFocus, setSessionFocus] = useState("passing");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [participants, setParticipants] = useState(14);
  const [level, setLevel] = useState("");

  const outfieldOptions = [
    { value: "passing", label: "Passing" },
    { value: "receiving", label: "Receiving" },
    { value: "dribbling", label: "Dribbling" },
    { value: "crossing", label: "Crossing" },
    { value: "shooting", label: "Shooting/Finishing" },
    { value: "defending", label: "Defending" },
    { value: "pressing", label: "Pressing" },
    { value: "possession", label: "Possession/Rondos" },
    { value: "transition", label: "Transition" },
    { value: "setpieces", label: "Set Pieces" }
  ];

  const goalkeepingOptions = [
    { value: "handling", label: "Handling" },
    { value: "distribution", label: "Distribution" },
    { value: "diving", label: "Diving" },
    { value: "footwork", label: "Footwork" },
    { value: "crosses", label: "Crosses" },
    { value: "highballs", label: "High Balls" },
    { value: "shotstopping", label: "Shot-stopping" },
    { value: "onevsone", label: "1v1" },
    { value: "positioning", label: "Positioning" },
    { value: "reactions", label: "Reaction/Reflex" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      sessionType,
      sessionFocus,
      durationMinutes,
      participants,
      level: level || undefined,
    });
  };

  const handleTypeChange = (newType: "outfield" | "goalkeeping") => {
    setSessionType(newType);
    // Reset focus to first option of new type
    setSessionFocus(newType === "outfield" ? "passing" : "handling");
  };

  return (
    <Card data-testid="session-form">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Session Type */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-3 block">Session Type</Label>
            <RadioGroup 
              value={sessionType} 
              onValueChange={handleTypeChange}
              className="grid grid-cols-2 gap-4"
            >
              <div className={`flex items-center space-x-2 p-4 border-2 rounded-lg cursor-pointer ${
                sessionType === "outfield" 
                  ? "border-primary bg-primary/5" 
                  : "border-slate-200 hover:border-slate-300"
              }`}>
                <RadioGroupItem value="outfield" id="outfield" data-testid="radio-outfield" />
                <Label htmlFor="outfield" className="cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <Users className={sessionType === "outfield" ? "text-primary" : "text-slate-600"} size={20} />
                    <div>
                      <div className="font-medium text-slate-900">Outfield</div>
                      <div className="text-sm text-slate-600">Field players training</div>
                    </div>
                  </div>
                </Label>
              </div>
              
              <div className={`flex items-center space-x-2 p-4 border-2 rounded-lg cursor-pointer ${
                sessionType === "goalkeeping" 
                  ? "border-primary bg-primary/5" 
                  : "border-slate-200 hover:border-slate-300"
              }`}>
                <RadioGroupItem value="goalkeeping" id="goalkeeping" data-testid="radio-goalkeeping" />
                <Label htmlFor="goalkeeping" className="cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <HandMetal className={sessionType === "goalkeeping" ? "text-primary" : "text-slate-600"} size={20} />
                    <div>
                      <div className="font-medium text-slate-900">Goalkeeping</div>
                      <div className="text-sm text-slate-600">Goalkeeper specific</div>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Session Focus */}
          <div>
            <Label htmlFor="sessionFocus" className="block text-sm font-medium text-slate-700 mb-2">
              Session Focus
            </Label>
            <Select value={sessionFocus} onValueChange={setSessionFocus}>
              <SelectTrigger data-testid="select-session-focus">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(sessionType === "outfield" ? outfieldOptions : goalkeepingOptions).map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Session Length and Participants */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="sessionLength" className="block text-sm font-medium text-slate-700 mb-2">
                Session Length
              </Label>
              <Select value={durationMinutes.toString()} onValueChange={(value) => setDurationMinutes(parseInt(value))}>
                <SelectTrigger data-testid="select-duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="75">75 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="participants" className="block text-sm font-medium text-slate-700 mb-2">
                Number of Participants
              </Label>
              <Input
                id="participants"
                type="number"
                min="1"
                max="30"
                value={participants}
                onChange={(e) => setParticipants(parseInt(e.target.value))}
                data-testid="input-participants"
              />
            </div>
          </div>

          {/* Age Group */}
          <div>
            <Label htmlFor="ageGroup" className="block text-sm font-medium text-slate-700 mb-2">
              Age Group / Level (Optional)
            </Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger data-testid="select-age-group">
                <SelectValue placeholder="Select age group..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Select age group...</SelectItem>
                <SelectItem value="youth-u10">Youth U10</SelectItem>
                <SelectItem value="youth-u12">Youth U12</SelectItem>
                <SelectItem value="youth-u14">Youth U14</SelectItem>
                <SelectItem value="youth-u16">Youth U16</SelectItem>
                <SelectItem value="youth-u18">Youth U18</SelectItem>
                <SelectItem value="academy">Academy</SelectItem>
                <SelectItem value="adult-amateur">Adult Amateur</SelectItem>
                <SelectItem value="adult-semi-pro">Adult Semi-Pro</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Generate Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isGenerating}
              data-testid="button-generate-session"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Session...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Training Session
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

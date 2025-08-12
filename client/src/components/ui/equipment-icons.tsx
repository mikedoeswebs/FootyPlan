import { Circle, Square, Triangle, Target, Flag, Users } from "lucide-react";

interface EquipmentIconsProps {
  equipment: string[];
  className?: string;
}

export function EquipmentIcons({ equipment, className = "" }: EquipmentIconsProps) {
  const getEquipmentIcon = (item: string) => {
    const lowercaseItem = item.toLowerCase();
    
    if (lowercaseItem.includes('ball') || lowercaseItem.includes('football')) {
      return <Circle className="w-4 h-4 text-orange-500" />;
    }
    if (lowercaseItem.includes('cone')) {
      return <Triangle className="w-4 h-4 text-yellow-500" />;
    }
    if (lowercaseItem.includes('goal')) {
      return <Target className="w-4 h-4 text-green-500" />;
    }
    if (lowercaseItem.includes('bib') || lowercaseItem.includes('vest')) {
      return <Square className="w-4 h-4 text-blue-500" />;
    }
    if (lowercaseItem.includes('flag') || lowercaseItem.includes('marker')) {
      return <Flag className="w-4 h-4 text-red-500" />;
    }
    if (lowercaseItem.includes('mannequin') || lowercaseItem.includes('dummy')) {
      return <Users className="w-4 h-4 text-purple-500" />;
    }
    
    // Default icon for unrecognized equipment
    return <Circle className="w-4 h-4 text-slate-500" />;
  };

  const parseEquipmentCount = (item: string) => {
    const match = item.match(/(\d+)\s*x?\s*/i);
    return match ? parseInt(match[1]) : 1;
  };

  const getEquipmentName = (item: string) => {
    return item.replace(/^\d+\s*x?\s*/i, '').trim();
  };

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {equipment.map((item, index) => {
        const count = parseEquipmentCount(item);
        const name = getEquipmentName(item);
        const icon = getEquipmentIcon(item);
        
        return (
          <div
            key={index}
            className="flex items-center space-x-1 bg-slate-50 px-2 py-1 rounded-md border"
          >
            {icon}
            <span className="text-sm text-slate-700">
              {count > 1 && <span className="font-medium">{count}x </span>}
              {name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function PracticeEquipmentSummary({ practice }: { practice: any }) {
  // Extract equipment from practice setup description
  const extractEquipmentFromSetup = (setup: string): string[] => {
    const equipment: string[] = [];
    
    // Common equipment patterns in setup descriptions
    const patterns = [
      /(\d+)\s*(cones?)/gi,
      /(\d+)\s*(balls?|footballs?)/gi,
      /(\d+)\s*(goals?)/gi,
      /(\d+)\s*(mannequins?)/gi,
      /(\d+)\s*(markers?)/gi,
      /(\d+)\s*(poles?)/gi,
    ];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(setup)) !== null) {
        equipment.push(`${match[1]} x ${match[2]}`);
      }
    });
    
    // If no specific equipment found, provide defaults based on area and players
    if (equipment.length === 0) {
      const area = practice.area_meters;
      if (area) {
        const perimeterCones = Math.ceil((area[0] + area[1]) * 2 / 5); // Rough estimate
        equipment.push(`${perimeterCones} x Cones`);
      }
      if (practice.players_required) {
        const ballsNeeded = Math.ceil(practice.players_required / 2);
        equipment.push(`${ballsNeeded} x Footballs`);
      }
    }
    
    return equipment;
  };

  const practiceEquipment = extractEquipmentFromSetup(practice.setup_description || "");
  
  if (practiceEquipment.length === 0) return null;

  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-slate-600 mb-2">Equipment needed:</p>
      <EquipmentIcons equipment={practiceEquipment} />
    </div>
  );
}
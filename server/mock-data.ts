// Mock data generator for development to avoid using OpenAI credits
import type { SessionGenerationRequest } from "./openai";

const MOCK_SESSIONS: Record<string, Record<string, any>> = {
  outfield: {
    passing: {
      title: "Passing & Receiving Workshop",
      level: "Youth U12",
      session_type: "outfield",
      session_focus: "passing",
      duration_minutes: 60,
      participants: 14,
      objectives: [
        "Improve passing accuracy under pressure",
        "Develop first touch and ball control",
        "Build confidence in possession"
      ],
      equipment: [
        "20 x Footballs",
        "16 x Cones",
        "4 x Training goals", 
        "8 x Mannequins",
        "Bibs (3 colors)"
      ],
      warmup: {
        name: "Dynamic Movement",
        duration_minutes: 10,
        description: "Light jogging followed by dynamic stretches including leg swings, high knees, and ball touches. Players work in pairs with simple passing while moving."
      },
      practices: [
        {
          name: "Short Passing Accuracy",
          duration_minutes: 15,
          players_required: 14,
          area_meters: [20, 15],
          setup_description: "Set up 4 stations with cones 10 meters apart. Players work in pairs, focusing on accurate ground passes.",
          steps: [
            "Players face each other 10m apart",
            "Pass with inside of foot, receive with first touch",
            "Progress to one-touch passing",
            "Add pressure with passive defender"
          ],
          coaching_points: [
            "Keep head up before passing",
            "Use inside of foot for accuracy",
            "Receive across your body",
            "Communicate with your partner"
          ],
          aims: [
            "Improve passing accuracy to 85%",
            "Develop consistent first touch",
            "Build passing confidence under pressure"
          ],
          difficulty_level: 2,
          diagram_svg: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="180" height="130" fill="none" stroke="#2c3e50" stroke-width="2"/>
            <circle cx="50" cy="75" r="8" fill="#3498db"/>
            <circle cx="150" cy="75" r="8" fill="#e74c3c"/>
            <path d="M 58 75 L 142 75" stroke="#2c3e50" stroke-width="2" marker-end="url(#arrowhead)"/>
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#2c3e50"/>
              </marker>
            </defs>
            <text x="100" y="95" text-anchor="middle" font-size="12" fill="#2c3e50">10m</text>
          </svg>`
        },
        {
          name: "Triangle Passing",
          duration_minutes: 20,
          players_required: 12,
          area_meters: [15, 15],
          setup_description: "Create triangles with 3 players, 5 meters apart. Focus on quick, accurate passing and movement.",
          steps: [
            "Form triangles of 3 players",
            "Pass clockwise, then counter-clockwise",
            "Add movement after each pass",
            "Introduce two-ball exercise"
          ],
          coaching_points: [
            "Pass and move to create angles",
            "Receive on back foot when possible",
            "Keep the tempo high",
            "Support your teammates"
          ],
          aims: [
            "Develop quick passing rhythm",
            "Improve off-ball movement",
            "Build team passing patterns"
          ],
          difficulty_level: 3,
          diagram_svg: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
            <polygon points="100,30 50,120 150,120" fill="none" stroke="#2c3e50" stroke-width="2"/>
            <circle cx="100" cy="30" r="8" fill="#3498db"/>
            <circle cx="50" cy="120" r="8" fill="#e74c3c"/>
            <circle cx="150" cy="120" r="8" fill="#f39c12"/>
            <path d="M 100 38 L 58 112" stroke="#2c3e50" stroke-width="2" marker-end="url(#arrowhead)"/>
            <path d="M 58 120 L 142 120" stroke="#2c3e50" stroke-width="2" marker-end="url(#arrowhead)"/>
            <path d="M 150 112 L 108 38" stroke="#2c3e50" stroke-width="2" marker-end="url(#arrowhead)"/>
            <text x="100" y="140" text-anchor="middle" font-size="12" fill="#2c3e50">5m each side</text>
          </svg>`
        }
      ],
      small_sided_game: {
        duration_minutes: 10,
        description: "4v4 possession game in 20x20m area. Team keeps ball for 6 consecutive passes to score a point. Focus on quick passing and creating space."
      },
      cooldown: {
        duration_minutes: 5,
        description: "Light jogging around the pitch followed by static stretching. Focus on hamstrings, calves, and quadriceps. Players walk and discuss key points from the session."
      },
      safety_notes: [
        "Check pitch for holes or dangerous objects",
        "Ensure proper warm-up before intense activities",
        "Keep hydration available at all times",
        "Monitor player fatigue levels"
      ],
      diagrams: [
        {
          practice_name: "Short Passing Accuracy",
          svg: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">...</svg>`
        }
      ]
    }
  },
  goalkeeping: {
    handling: {
      title: "Goalkeeping Handling Workshop",
      level: "Youth U12",
      session_type: "goalkeeping",
      session_focus: "handling",
      duration_minutes: 60,
      participants: 6,
      objectives: [
        "Improve catching technique for various ball heights",
        "Develop safe handling under pressure",
        "Build confidence in 1v1 situations"
      ],
      equipment: [
        "15 x Footballs",
        "2 x Full-size goals",
        "12 x Cones",
        "4 x Agility poles",
        "2 x Rebounders"
      ],
      warmup: {
        name: "Goalkeeper Mobility",
        duration_minutes: 10,
        description: "Dynamic warm-up including arm circles, leg swings, and diving preparation. Progress to basic catching with thrown balls."
      },
      practices: [
        {
          name: "Basic Catching Technique",
          duration_minutes: 20,
          players_required: 6,
          area_meters: [18, 6],
          setup_description: "Goalkeepers work in pairs, one throwing balls at various heights while the other practices catching technique.",
          steps: [
            "Start with underarm throws at chest height",
            "Progress to balls thrown at head height",
            "Add balls thrown to either side",
            "Introduce bouncing balls"
          ],
          coaching_points: [
            "Get body behind the ball",
            "Use the 'W' shape with hands",
            "Secure the ball to chest quickly",
            "Stay on balls of feet"
          ],
          aims: [
            "Perfect the basic catching position",
            "Develop muscle memory for safe handling",
            "Build confidence with ball handling"
          ],
          difficulty_level: 2,
          diagram_svg: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="20" width="160" height="110" fill="none" stroke="#2c3e50" stroke-width="2"/>
            <circle cx="60" cy="75" r="10" fill="#3498db"/>
            <circle cx="140" cy="75" r="10" fill="#e74c3c"/>
            <circle cx="100" cy="50" r="4" fill="#f39c12"/>
            <path d="M 70 75 L 96 54" stroke="#2c3e50" stroke-width="2" marker-end="url(#arrowhead)"/>
            <text x="100" y="145" text-anchor="middle" font-size="12" fill="#2c3e50">6m apart</text>
          </svg>`
        }
      ],
      small_sided_game: {
        duration_minutes: 15,
        description: "2v2 game with goalkeepers. Focus on handling under pressure and quick distribution to teammates."
      },
      cooldown: {
        duration_minutes: 5,
        description: "Light stretching focusing on shoulders, back, and legs. Review key handling points and discuss session highlights."
      },
      safety_notes: [
        "Ensure goals are properly secured",
        "Check for proper glove fit",
        "Clear the goal area of obstacles",
        "Progress diving exercises gradually"
      ],
      diagrams: []
    }
  }
};

const LOADING_PHRASES = [
  "Analyzing tactics from legendary coaches...",
  "Getting my coaching hat on...",
  "Studying professional training methods...",
  "Ingesting real-life sessions...",
  "Consulting with football experts...",
  "Reviewing championship-winning drills...",
  "Crafting the perfect session...",
  "Drawing inspiration from the pitch...",
  "Tailoring drills to your players...",
  "Building your training masterpiece..."
];

export function getMockSession(params: SessionGenerationRequest): any {
  // Simulate processing time with rotating phrases
  const sessionTypeData = MOCK_SESSIONS[params.sessionType];
  const sessionData = sessionTypeData?.[params.sessionFocus] || 
                     MOCK_SESSIONS["outfield"]["passing"];
  
  // Customize the mock data based on parameters
  if (!sessionData) {
    return MOCK_SESSIONS["outfield"]["passing"];
  }
  
  return {
    ...sessionData,
    duration_minutes: params.durationMinutes,
    participants: params.participants,
    level: params.level || sessionData.level || "General",
    session_type: params.sessionType,
    session_focus: params.sessionFocus
  };
}

export function getRandomLoadingPhrase(): string {
  return LOADING_PHRASES[Math.floor(Math.random() * LOADING_PHRASES.length)];
}

export { LOADING_PHRASES };
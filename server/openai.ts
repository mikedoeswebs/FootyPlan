import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

const SYSTEM_PROMPT = `You are an expert football coach. Produce a single-session training plan following the JSON schema below, plus a human-readable Markdown version. Use the given inputs (session_type, session_focus, total_minutes, participants, level, random_seed). Follow session structure rules: warm-up 10–20%, main practices 2–4, small-sided game 10–25%, cool down 5–10%. Each practice must have setup, steps, coaching points, aims, difficulty, and an SVG diagram. Use the random_seed to vary drills. Keep language concise, coach-friendly, and progression logical.

JSON Schema:
{
  "title": "string",
  "level": "string", 
  "session_type": "goalkeeping|outfield",
  "session_focus": "string",
  "duration_minutes": number,
  "participants": number,
  "objectives": ["string","string","string"],
  "equipment": ["string", "..."],
  "warmup": { "name": "string", "duration_minutes": number, "description": "string" },
  "practices": [
    {
      "name": "string",
      "duration_minutes": number,
      "players_required": number,
      "area_meters": [length, width],
      "setup_description": "string",
      "steps": ["string", "..."],
      "coaching_points": ["string", "..."],
      "aims": ["string", "..."],
      "difficulty_level": number,
      "diagram_svg": "string"
    }
  ],
  "small_sided_game": { "duration_minutes": number, "description": "string" },
  "cooldown": { "duration_minutes": number, "description": "string" },
  "safety_notes": ["string", "..."],
  "diagrams": [{"practice_name": "string", "svg": "string"}]
}

Respond with valid JSON only.`;

export interface SessionGenerationRequest {
  sessionType: "outfield" | "goalkeeping";
  sessionFocus: string;
  durationMinutes: number;
  participants: number;
  level?: string;
}

export async function generateTrainingSession(params: SessionGenerationRequest): Promise<any> {
  const randomSeed = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const userPrompt = `Generate a football training session.
session_type: ${params.sessionType}
session_focus: ${params.sessionFocus}
total_minutes: ${params.durationMinutes}
participants: ${params.participants}
level: ${params.level || 'General'}
random_seed: ${randomSeed}
Include measurable aims, pitch area in meters, required equipment, and SVG diagrams.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to generate training session");
  }
}

'use server';

import { GoogleGenAI, Type } from '@google/genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function generateScenesAction(theme: string, length: string, asmristDesc: string, model: string = 'gemini-3.1-pro-preview') {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  const prompt = `
Role: You are an expert ASMR scriptwriter and an AI Video Generation Director.
Task: I need you to create a deeply relaxing ASMR script based on the theme provided below. You will then break this script down into strict 8-second scenes, formatted as a single JSON array of objects.

Theme/Vibe: ${theme}
Total Length: ${length}
ASMRist Description: ${asmristDesc}

CRITICAL INSTRUCTIONS FOR AI VIDEO GENERATION:
1. Zero-Context Generation: Assume the AI video generator has no memory of the previous scene. Every single scene's JSON object MUST contain a full, highly detailed physical description of the character (face, hair, clothes) and the background environment. Do not use shorthand. Use the provided ASMRist Description.
2. The 8-Second Rule: The dialogue and actions for each scene must realistically fit within exactly 8 seconds. Do not overload a scene with too many words.
3. Entry and Exit Animations (Crucial for Editing): To ensure smooth cuts when stitching the video together, the character's dialogue must never start at second 0:00 or end at second 0:08.
* Entry Animation: A 1-second physical action (e.g., hands entering frame, continuing a smile, leaning in) that bridges the gap before she speaks.
* Exit Animation: A 1-second physical action (e.g., reaching for an object, slowly blinking, hands resting) after she finishes speaking to lead into the next scene.
`;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            scene_number: { type: Type.INTEGER },
            duration: { type: Type.STRING },
            character_description: { type: Type.STRING },
            scene_description: { type: Type.STRING },
            entry_animation: { type: Type.STRING },
            dialogue_words: { type: Type.STRING },
            audio_visual_triggers: { type: Type.STRING },
            exit_animation: { type: Type.STRING },
          },
          required: [
            "scene_number", "duration", "character_description", "scene_description",
            "entry_animation", "dialogue_words", "audio_visual_triggers", "exit_animation"
          ]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("Failed to parse JSON response", e);
    throw new Error("Failed to parse AI response.");
  }
}

interface VideoGenerationOptions {
  model?: string;
  resolution?: string;
  aspectRatio?: string;
}

export async function startVideoGenerationAction(scenePrompt: string, options?: VideoGenerationOptions) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  const operation = await ai.models.generateVideos({
    model: options?.model || 'veo-3.1-fast-generate-preview',
    prompt: scenePrompt,
    config: {
      numberOfVideos: 1,
      resolution: options?.resolution || '1080p',
      aspectRatio: options?.aspectRatio || '16:9'
    }
  });

  return operation.name;
}

export async function checkVideoOperationAction(operationName: string) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1alpha/${operationName}?key=${GEMINI_API_KEY}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to check video operation: ${response.statusText}`);
  }

  const operation = await response.json();
  return operation;
}

export async function downloadVideoAsBase64Action(uri: string) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }
  
  const response = await fetch(uri, {
    method: 'GET',
    headers: {
      'x-goog-api-key': GEMINI_API_KEY,
    },
  });

  if (!response.ok) throw new Error("Failed to download video from URI on server.");

  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  const contentType = response.headers.get('content-type') || 'video/mp4';

  return { base64, contentType };
}

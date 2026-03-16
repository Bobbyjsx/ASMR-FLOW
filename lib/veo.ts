import { GoogleGenAI } from '@google/genai';
import { GEMINI_API_KEY } from './environment';

interface VideoGenerationOptions {
  model?: string;
  resolution?: string;
  aspectRatio?: string;
}

export const startVideoGeneration = async (scenePrompt: string, options?: VideoGenerationOptions) => {
  // @ts-ignore
  if (window.aistudio && !await window.aistudio.hasSelectedApiKey()) {
    // @ts-ignore
    await window.aistudio.openSelectKey();
  }

  // @ts-ignore
  if (window.aistudio && !await window.aistudio.hasSelectedApiKey()) {
     throw new Error("API Key not selected. Please select a Google Cloud project with billing enabled.");
  }

  if (!GEMINI_API_KEY) throw new Error("API Key not found in environment after selection.");

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
};

export const checkVideoOperation = async (operationName: string) => {
  if (!GEMINI_API_KEY) throw new Error("API Key not found in environment.");
  
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
};

export const downloadVideoBlob = async (uri: string) => {
  if (!GEMINI_API_KEY) throw new Error("API Key not found in environment.");
  
  const response = await fetch(uri, {
    method: 'GET',
    headers: {
      'x-goog-api-key': GEMINI_API_KEY,
    },
  });

  if (!response.ok) throw new Error("Failed to download video from URI.");

  return await response.blob();
};

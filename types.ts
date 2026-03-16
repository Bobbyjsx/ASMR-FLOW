export interface ASMRist {
  id: string;
  name: string;
  description: string;
}

export interface Scene {
  scene_number: number;
  duration: string;
  character_description: string;
  scene_description: string;
  entry_animation: string;
  dialogue_words: string;
  audio_visual_triggers: string;
  exit_animation: string;
  videoUrl?: string;
  isGeneratingVideo?: boolean;
  videoError?: string;
}

export interface Project {
  id: string;
  name: string;
  theme: string;
  length: string;
  asmristId: string;
  scenes: Scene[];
  llmModel?: string;
  videoModel?: string;
  videoResolution?: string;
  videoAspectRatio?: string;
  createdAt: number;
}

export interface Settings {
  preferredInput: 'text' | 'json';
  preferredOutput: 'text' | 'json';
}

export const AVAILABLE_LLM_MODELS = [
  // Latest / Most Capable
  { 
    label: 'Gemini 3.1 Pro Preview', 
    value: 'gemini-3.1-pro-preview',
    description: 'Best reasoning / complex tasks.' 
  },
  { 
    label: 'Gemini 3 Pro Preview', 
    value: 'gemini-3-pro-preview',
    description: 'Strong general model.' 
  },
  { 
    label: 'Gemini 3 Flash Preview', 
    value: 'gemini-3-flash-preview',
    description: 'Faster + cheaper.' 
  },
  // Lightweight but Good
  { 
    label: 'Gemini 3.1 Flash Lite Preview', 
    value: 'gemini-3.1-flash-lite-preview',
    description: 'Newest lightweight.' 
  },
  { 
    label: 'Gemini 2.5 Flash', 
    value: 'gemini-2.5-flash',
    description: 'Stable + fast.' 
  },
  { 
    label: 'Gemini 2.5 Flash Lite', 
    value: 'gemini-2.5-flash-lite',
    description: 'Cheapest.' 
  },
];

export const AVAILABLE_VIDEO_MODELS = [
  { 
    label: 'Veo 3.1 Generate Preview', 
    value: 'veo-3.1-generate-preview',
    description: 'Best quality.' 
  },
  { 
    label: 'Veo 3.1 Fast Generate Preview', 
    value: 'veo-3.1-fast-generate-preview',
    description: 'Fastest.' 
  },
  { 
    label: 'Veo 3.0 Generate', 
    value: 'veo-3.0-generate-001',
    description: 'Medium speed, good quality.' 
  },
  { 
    label: 'Veo 3.0 Fast Generate', 
    value: 'veo-3.0-fast-generate-001',
    description: 'Fast speed, slightly lower quality.' 
  },
  { 
    label: 'Veo 2.0 Generate', 
    value: 'veo-2.0-generate-001',
    description: 'Slow, older model.' 
  },
];

export const AVAILABLE_RESOLUTIONS = [
  { label: '1080p', value: '1080p' },
  { label: '720p', value: '720p' },
];

export const AVAILABLE_ASPECT_RATIOS = [
  { label: '16:9 (Landscape)', value: '16:9' },
  { label: '9:16 (Portrait)', value: '9:16' },
  { label: '1:1 (Square)', value: '1:1' },
];

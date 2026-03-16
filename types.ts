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
  createdAt: number;
}

export interface Settings {
  preferredInput: 'text' | 'json';
  preferredOutput: 'text' | 'json';
}


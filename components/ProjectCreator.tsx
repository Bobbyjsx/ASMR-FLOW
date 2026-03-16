'use client';

import { useState, useEffect } from 'react';
import { Doc } from '@/convex/_generated/dataModel';
import { AVAILABLE_LLM_MODELS, AVAILABLE_VIDEO_MODELS, AVAILABLE_RESOLUTIONS, AVAILABLE_ASPECT_RATIOS } from '@/types';
import { getASMRists, saveProject } from '@/lib/store';
import { generateScenes } from '@/lib/gemini';
import { Loader2, ArrowRight } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { anyApi } from 'convex/server';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ProjectCreatorProps {
  onProjectCreated: (projectId: string) => void;
  onCancel: () => void;
}

export default function ProjectCreator({ onProjectCreated, onCancel }: ProjectCreatorProps) {
  const { userId } = useAuth();
  const asmrists = useQuery(anyApi.asmrists.get, userId ? { userId } : "skip") as Doc<"asmrists">[] | undefined;
  const projects = useQuery(anyApi.projects.get, userId ? { userId } : "skip") as Doc<"projects">[] | undefined;
  const createProject = useMutation(anyApi.projects.create);
  const configs = useQuery(anyApi.configurations.listEnabled) as Doc<"configurations">[] | undefined;

  const [selectedAsmristId, setSelectedAsmristId] = useState('');
  const [theme, setTheme] = useState('');
  const [length, setLength] = useState('1 minute (8 scenes)');
  const [name, setName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  // Advanced settings state
  const [llmModel, setLlmModel] = useState('');
  const [videoModel, setVideoModel] = useState('');
  const [videoResolution, setVideoResolution] = useState('');
  const [videoAspectRatio, setVideoAspectRatio] = useState('');

  useEffect(() => {
    if (asmrists && asmrists.length > 0 && !selectedAsmristId) {
      setSelectedAsmristId(asmrists[0]._id);
    }
  }, [asmrists, selectedAsmristId]);

  // Set default configurations
  useEffect(() => {
    if (configs && configs.length > 0) {
      const llmModels = configs.filter((c: Doc<"configurations">) => c.type === 'llm_model');
      const videoModels = configs.filter((c: Doc<"configurations">) => c.type === 'video_model');
      const resolutions = configs.filter((c: Doc<"configurations">) => c.type === 'video_resolution');
      const aspectRatios = configs.filter((c: Doc<"configurations">) => c.type === 'video_aspect_ratio');

      const defaultLlm = llmModels.find((c: Doc<"configurations">) => c.is_default) || llmModels[0];
      const defaultVideo = videoModels.find((c: Doc<"configurations">) => c.is_default) || videoModels[0];
      const defaultResolution = resolutions.find((c: Doc<"configurations">) => c.is_default) || resolutions[0];
      const defaultAspectRatio = aspectRatios.find((c: Doc<"configurations">) => c.is_default) || aspectRatios[0];

      if (defaultLlm && !llmModel) setLlmModel(defaultLlm.value);
      if (defaultVideo && !videoModel) setVideoModel(defaultVideo.value);
      if (defaultResolution && !videoResolution) setVideoResolution(defaultResolution.value);
      if (defaultAspectRatio && !videoAspectRatio) setVideoAspectRatio(defaultAspectRatio.value);
    }
  }, [configs, llmModel, videoModel, videoResolution, videoAspectRatio]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !theme || !selectedAsmristId || !userId) {
      setError('Please fill in all fields.');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const selectedAsmrist = asmrists?.find((a: Doc<"asmrists">) => a._id === selectedAsmristId);
      if (!selectedAsmrist) throw new Error("ASMRist not found");

      // Check project creation limit
      const maxProjectsConfig = configs?.find((c: Doc<"configurations">) => c.type === 'max_project_creation');
      const maxProjects = maxProjectsConfig ? parseInt(maxProjectsConfig.value, 10) : Infinity;
      
      if ((projects?.length || 0) >= maxProjects) {
        throw new Error(`Project limit reached (${maxProjects}). Please delete an existing project before creating a new one.`);
      }

      const scenes = await generateScenes(theme, length, selectedAsmrist.description, llmModel);

      if (!scenes || scenes.length === 0) {
        throw new Error("Failed to generate scenes. Please try again.");
      }

      const projectId = await createProject({
        name,
        theme,
        length,
        asmristId: selectedAsmristId,
        userId,
        scenes,
        llmModel,
        videoModel,
        videoResolution,
        videoAspectRatio,
        createdAt: Date.now()
      });

      onProjectCreated(projectId as string);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!asmrists) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center bg-card rounded-2xl border border-dashed border-border mt-12 shadow-sm">
        <Loader2 className="animate-spin mx-auto mb-4 text-primary" size={32} />
        <p className="text-muted-foreground">Loading ASMRists...</p>
      </div>
    );
  }

  if (asmrists.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center bg-card rounded-2xl border border-dashed border-border mt-12 shadow-sm">
        <h2 className="text-xl font-semibold text-card-foreground mb-4">No ASMRists Found</h2>
        <p className="text-muted-foreground mb-6">You need to create an ASMRist character before generating a video script.</p>
        <Button onClick={onCancel} className="bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:-translate-y-0.5">
          Go to ASMRists
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 mt-4 md:mt-8">
      <Card className="border-border shadow-md bg-card transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight text-card-foreground">New ASMR Project</CardTitle>
          <CardDescription className="text-muted-foreground">Generate a perfectly timed script with entry and exit animations.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-xl mb-6 text-sm border border-destructive/20">
              {error}
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Project Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Cyberpunk Checkup"
                className="bg-background border-border focus-visible:ring-primary text-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="asmrist" className="text-foreground">Select ASMRist</Label>
              <Select
                value={selectedAsmristId}
                onValueChange={(val) => setSelectedAsmristId(val || '')}
                required
                placeholder="Select an ASMRist"
                triggerClassName="bg-background border-border text-foreground"
                options={asmrists?.map((a: any) => ({ label: a.name, value: a._id })) || []}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme" className="text-foreground">Theme / Vibe</Label>
              <Textarea
                id="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="e.g., A futuristic cyber-clinic cranial nerve exam, OR A rainy medieval tavern map-reading..."
                className="h-32 bg-background border-border focus-visible:ring-primary text-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="length" className="text-foreground">Total Length</Label>
              <Select
                value={length}
                onValueChange={(val) => setLength(val || '')}
                required
                placeholder="Select length"
                triggerClassName="bg-background border-border text-foreground"
                options={[
                  { label: "30 seconds (4 scenes)", value: "30 seconds (4 scenes)" },
                  { label: "1 minute (8 scenes)", value: "1 minute (8 scenes)" },
                  { label: "2 minutes (16 scenes)", value: "2 minutes (16 scenes)" },
                  { label: "3 minutes (24 scenes)", value: "3 minutes (24 scenes)" },
                ]}
              />
            </div>

            {/* Advanced Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Script Settings</h3>
                <div className="space-y-2">
                  <Label htmlFor="llmModel" className="text-foreground">AI Script Model</Label>
                  <Select
                    value={llmModel}
                    onValueChange={(val) => setLlmModel(val || '')}
                    required
                    placeholder="Select Model"
                    triggerClassName="bg-background border-border text-foreground h-auto text-left"
                    options={configs?.filter(c => c.type === 'llm_model').map(c => ({ label: c.label, value: c.value })) || []}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Video Settings</h3>
                <div className="space-y-2">
                  <Label htmlFor="videoModel" className="text-foreground">AI Video Model</Label>
                  <Select
                    value={videoModel}
                    onValueChange={(val) => setVideoModel(val || '')}
                    required
                    placeholder="Select Video Model"
                    triggerClassName="bg-background border-border text-foreground h-auto text-left"
                    options={configs?.filter(c => c.type === 'video_model').map(c => ({ label: c.label, value: c.value })) || []}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="resolution" className="text-foreground">Resolution</Label>
                    <Select
                      value={videoResolution}
                      onValueChange={(val) => setVideoResolution(val || '')}
                      required
                      placeholder="Resolution"
                      triggerClassName="bg-background border-border text-foreground"
                      options={configs?.filter(c => c.type === 'video_resolution').map(c => ({ label: c.label, value: c.value })) || []}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aspectRatio" className="text-foreground">Aspect Ratio</Label>
                    <Select
                      value={videoAspectRatio}
                      onValueChange={(val) => setVideoAspectRatio(val || '')}
                      required
                      placeholder="Ratio"
                      triggerClassName="bg-background border-border text-foreground"
                      options={configs?.filter(c => c.type === 'video_aspect_ratio').map(c => ({ label: c.label, value: c.value })) || []}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-between items-center border-t border-border">
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={isGenerating}
                className="text-muted-foreground hover:bg-accent/10 hover:text-foreground transition-colors"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isGenerating}
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Generating Script...
                  </>
                ) : (
                  <>
                    Generate Scenes
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Project, Scene } from '@/types';
import { getProjects, updateProject, getSettings } from '@/lib/store';
import { startVideoGeneration } from '@/lib/veo';
import { Copy, Video, Loader2, AlertCircle, PlayCircle, FileText, Braces, ArrowLeft, History } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { anyApi } from 'convex/server';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProjectViewerProps {
  projectId: string;
  onBack: () => void;
}

export default function ProjectViewer({ projectId, onBack }: ProjectViewerProps) {
  const { userId } = useAuth();
  const projects = useQuery(anyApi.projects.get, userId ? { userId } : "skip") || [];
  const project = projects.find((p: any) => p._id === projectId);

  const createVideo = useMutation(anyApi.videos.create);
  const allVideos = useQuery(anyApi.videos.list) || [];
  const projectVideos = allVideos.filter((v: any) => v.projectId === projectId);
  
  const projectGeneratingVideos = projectVideos.filter((v: any) => v.status === 'generating');

  const [localGeneratingState, setLocalGeneratingState] = useState<Record<number, boolean>>({});
  const [localErrorState, setLocalErrorState] = useState<Record<number, string | undefined>>({});
  const [selectedVideoIds, setSelectedVideoIds] = useState<Record<number, string>>({});

  const handleGenerateVideo = async (sceneIndex: number) => {
    if (!project) return;

    setLocalGeneratingState(prev => ({ ...prev, [sceneIndex]: true }));
    setLocalErrorState(prev => ({ ...prev, [sceneIndex]: undefined }));

    try {
      const scene = project.scenes[sceneIndex];
      const prompt = `
Character: ${scene.character_description}
Scene: ${scene.scene_description}
Action: ${scene.entry_animation} Then they say: "${scene.dialogue_words}" ${scene.exit_animation}
Triggers: ${scene.audio_visual_triggers}
      `.trim();

      const operationId = await startVideoGeneration(prompt);

      await createVideo({
        projectId: projectId as any,
        sceneIndex,
        operationId
      });

    } catch (error: any) {
      console.error(error);
      setLocalErrorState(prev => ({ ...prev, [sceneIndex]: error.message || "Failed to initiate video generation" }));
      setLocalGeneratingState(prev => ({ ...prev, [sceneIndex]: false }));
    }
  };

  const handleCopyText = (scene: Scene) => {
    const prompt = `
Character: ${scene.character_description}
Scene: ${scene.scene_description}
Action: ${scene.entry_animation} Then they say: "${scene.dialogue_words}" ${scene.exit_animation}
Triggers: ${scene.audio_visual_triggers}
    `.trim();
    navigator.clipboard.writeText(prompt);
    alert("Text prompt copied to clipboard!");
  };

  const handleCopyJSON = (scene: Scene) => {
    navigator.clipboard.writeText(JSON.stringify(scene, null, 2));
    alert("JSON prompt copied to clipboard!");
  };

  const handleCopyDefault = (scene: Scene) => {
    const settings = getSettings();
    if (settings.preferredOutput === 'json') {
      handleCopyJSON(scene);
    } else {
      handleCopyText(scene);
    }
  };

  if (!project) return <div className="p-8 text-center text-muted-foreground">Loading project...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground gap-2 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{project.name}</h1>
        <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30 border-transparent">
          {project.theme}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {project.scenes.map((scene: any, index: number) => {
          const sceneVideos = projectVideos.filter((v: any) => v.sceneIndex === index);
          const completedVideos = sceneVideos.filter((v: any) => v.status === 'completed' && v.url);
          // Sort by newest first
          completedVideos.sort((a: any, b: any) => b._creationTime - a._creationTime);
          
          const activeVideo = projectGeneratingVideos.find((v: any) => v.sceneIndex === index);
          const isGenerating = localGeneratingState[index] || !!activeVideo;
          const error = localErrorState[index] || sceneVideos.find((v:any) => v.status === 'error')?.error;
          const progress = activeVideo ? Math.round(activeVideo.progress || 0) : 0;
          
          // Determine the video url to show
          let displayUrl = scene.videoUrl;
          if (selectedVideoIds[index]) {
            displayUrl = completedVideos.find((v: any) => v._id === selectedVideoIds[index])?.url || displayUrl;
          } else if (completedVideos.length > 0) {
            displayUrl = completedVideos[0].url;
          }

          return (
            <Card key={index} className="overflow-hidden flex flex-col border-border shadow-sm bg-card hover:shadow-md transition-shadow">
              {/* Video or Placeholder Area */}
              <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden border-b border-border">
                {displayUrl ? (
                  <video
                    src={displayUrl}
                    controls
                    className="w-full h-full object-cover"
                    loop
                  />
                ) : isGenerating ? (
                  <div className="flex flex-col items-center text-white/70">
                    <Loader2 className="animate-spin mb-2" size={32} />
                    <span className="text-sm font-medium tracking-wide">Generating Video... {progress > 0 && `${progress}%`}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-white/30">
                    <PlayCircle size={48} strokeWidth={1} />
                    <span className="text-xs uppercase tracking-widest mt-2">{scene.duration}</span>
                  </div>
                )}

                {/* Error Overlay */}
                {error && (
                  <div className="absolute inset-0 bg-red-900/90 flex flex-col items-center justify-center p-4 text-center">
                    <AlertCircle className="text-red-200 mb-2" size={32} />
                    <p className="text-red-100 text-sm">{error}</p>
                  </div>
                )}
              </div>

              {/* Content Area */}
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold text-card-foreground">Scene {scene.scene_number}</CardTitle>
                  <Badge variant="outline" className="font-mono text-muted-foreground bg-accent/5 border-border">{scene.duration}</Badge>
                </div>
                
                {/* Generation Selector */}
                {completedVideos.length > 1 && (
                  <div className="mt-3 flex items-center gap-2">
                    <History size={14} className="text-muted-foreground" />
                    <select 
                      className="text-xs bg-muted border-border rounded p-1 text-foreground flex-1 cursor-pointer"
                      value={selectedVideoIds[index] || completedVideos[0]._id}
                      onChange={(e) => setSelectedVideoIds(prev => ({ ...prev, [index]: e.target.value }))}
                    >
                      {completedVideos.map((v: any, i: number) => (
                        <option key={v._id} value={v._id}>
                          Generation {completedVideos.length - i} {i === 0 ? '(Latest)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </CardHeader>
              <CardContent className="flex-grow space-y-4 text-sm mt-2">
                <div>
                  <span className="font-semibold text-foreground block text-xs uppercase tracking-wider mb-1">Entry</span>
                  <p className="text-muted-foreground">{scene.entry_animation}</p>
                </div>
                <div className="bg-background p-3 rounded-lg border border-border">
                  <span className="font-semibold text-foreground block text-xs uppercase tracking-wider mb-1">Dialogue</span>
                  <p className="text-card-foreground italic">&quot;{scene.dialogue_words}&quot;</p>
                </div>
                <div>
                  <span className="font-semibold text-foreground block text-xs uppercase tracking-wider mb-1">Exit</span>
                  <p className="text-muted-foreground">{scene.exit_animation}</p>
                </div>
                <div>
                  <span className="font-semibold text-foreground block text-xs uppercase tracking-wider mb-1">Triggers</span>
                  <p className="text-muted-foreground/80 text-xs">{scene.audio_visual_triggers}</p>
                </div>
              </CardContent>

              {/* Actions */}
              <CardFooter className="pt-4 border-t border-border flex flex-col gap-2">
                <Button
                  onClick={() => handleGenerateVideo(index)}
                  disabled={isGenerating}
                  className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:-translate-y-0.5"
                >
                  {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Video size={16} />}
                  {scene.videoUrl ? 'Regenerate Video' : 'Generate Video'}
                </Button>
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    onClick={() => handleCopyText(scene)}
                    className="flex-1 gap-1.5 text-xs text-muted-foreground border-border hover:bg-accent/10 hover:text-foreground transition-colors"
                    title="Copy as Text"
                  >
                    <FileText size={14} />
                    Copy Text
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleCopyJSON(scene)}
                    className="flex-1 gap-1.5 text-xs text-muted-foreground border-border hover:bg-accent/10 hover:text-foreground transition-colors"
                    title="Copy as JSON"
                  >
                    <Braces size={14} />
                    Copy JSON
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  );
}

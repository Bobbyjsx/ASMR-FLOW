'use client';

import { useState, useEffect } from 'react';
import { Project, Scene } from '@/types';
import { getProjects, updateProject, getSettings } from '@/lib/store';
import { startVideoGeneration } from '@/lib/veo';
import { Copy, Video, Loader2, AlertCircle, PlayCircle, FileText, Braces, ArrowLeft, History, RefreshCw } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { anyApi } from 'convex/server';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VideoPlayer } from '@/components/ui/video-player';

interface ProjectViewerProps {
  projectId: string;
  onBack: () => void;
}

export default function ProjectViewer({ projectId, onBack }: ProjectViewerProps) {
  const { userId } = useAuth();
  const projects = useQuery(anyApi.projects.get, userId ? { userId } : "skip") || [];
  const project = projects.find((p: any) => p._id === projectId);

  const createVideo = useMutation(anyApi.videos.create);
  const retryGeneration = useMutation(anyApi.videos.retryGeneration);
  const allVideos = useQuery(anyApi.videos.list, userId ? { userId } : "skip") || [];
  const configs = useQuery(anyApi.configurations.listEnabled);
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
      // Check video generation limit
      const maxVideosConfig = configs?.find(c => c.type === 'max_video_generation');
      const maxVideos = maxVideosConfig ? parseInt(maxVideosConfig.value, 10) : Infinity;
      
      if ((project.videos_generated || 0) >= maxVideos) {
        throw new Error(`Video limit reached for this project (${maxVideos}).`);
      }

      const scene = project.scenes[sceneIndex];
      const prompt = `
Character: ${scene.character_description}
Scene: ${scene.scene_description}
Action: ${scene.entry_animation} Then they say: "${scene.dialogue_words}" ${scene.exit_animation}
Triggers: ${scene.audio_visual_triggers}
      `.trim();

      const operationId = await startVideoGeneration(prompt, {
        model: project.videoModel,
        resolution: project.videoResolution,
        aspectRatio: project.videoAspectRatio
      });

      await createVideo({
        projectId: projectId as any,
        sceneIndex,
        operationId
      });

      // Clear the local state so it relies on the Convex query for generating status
      setLocalGeneratingState(prev => ({ ...prev, [sceneIndex]: false }));

    } catch (error: any) {
      console.error(error);
      setLocalErrorState(prev => ({ ...prev, [sceneIndex]: error.message || "Failed to initiate video generation" }));
      setTimeout(() => {
        setLocalGeneratingState(prev => ({ ...prev, [sceneIndex]: false }));
      }, 1000);
    }
  };

  const handleRetryVideo = async (sceneIndex: number) => {
    if (!project) return;

    // Find the video for this scene that has an error
    const sceneVideos = projectVideos.filter((v: any) => v.sceneIndex === sceneIndex);
    const failedVideo = sceneVideos.find((v: any) => v.status === 'error');

    if (!failedVideo) return;

    setLocalGeneratingState(prev => ({ ...prev, [sceneIndex]: true }));
    setLocalErrorState(prev => ({ ...prev, [sceneIndex]: undefined }));

    try {
      await retryGeneration({ id: failedVideo._id });
      // Clear the local state so it relies on the Convex query for generating status
      setLocalGeneratingState(prev => ({ ...prev, [sceneIndex]: false }));
    } catch (error: any) {
      console.error(error);
      setLocalErrorState(prev => ({ ...prev, [sceneIndex]: error.message || "Failed to retry video generation" }));
      setTimeout(() => {
        setLocalGeneratingState(prev => ({ ...prev, [sceneIndex]: false }));
      }, 1000);
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
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-500 font-medium hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl transition-colors shrink-0"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight md:leading-none">
            {project.name}
          </h1>
        </div>
      </div>

      <div className="inline-flex self-start mb-10 mt-3">
        <span className="bg-slate-100/80 border border-slate-200/60 text-slate-600 px-3 py-1 rounded-full text-sm text-left break-words max-w-full">
          {project.theme}
        </span>
      </div>

      {/* Grid of Scenes */}
      <div className="flex flex-wrap gap-6 md:gap-8">
        {project.scenes.map((scene: any, index: number) => {
          const durationStr = scene.duration || "0";
          const durationSeconds = durationStr.includes(':') 
            ? parseInt(durationStr.split(':')[0], 10) * 60 + parseInt(durationStr.split(':')[1], 10) 
            : parseInt(durationStr, 10) || 0;

          const sceneVideos = projectVideos.filter((v: any) => v.sceneIndex === index);
          const completedVideos = sceneVideos.filter((v: any) => v.status === 'completed' && v.url);
          completedVideos.sort((a: any, b: any) => b._creationTime - a._creationTime);

          const activeVideo = projectGeneratingVideos.find((v: any) => v.sceneIndex === index);
          const isGenerating = localGeneratingState[index] || !!activeVideo;
          const error = localErrorState[index] || sceneVideos.find((v: any) => v.status === 'error')?.error;
          const progress = activeVideo ? Math.round(activeVideo.progress || 0) : 0;

          let displayUrl = scene.videoUrl;
          if (selectedVideoIds[index]) {
            displayUrl = completedVideos.find((v: any) => v._id === selectedVideoIds[index])?.url || displayUrl;
          } else if (completedVideos.length > 0) {
            displayUrl = completedVideos[0].url;
          }

          return (
            <div key={index} className="flex-1 min-w-[300px] md:min-w-[320px] max-w-full flex flex-col bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden">
              {/* Media Section */}
              <div className="aspect-[4/3] bg-black relative flex flex-col items-center justify-center overflow-hidden">
                {displayUrl ? (
                  <VideoPlayer
                    src={displayUrl}
                    className="w-full h-full"
                    loop
                  />
                ) : isGenerating ? (
                  <div className="flex flex-col items-center text-white/70">
                    <Loader2 className="animate-spin mb-3" size={32} />
                    <span className="text-xs font-semibold tracking-widest uppercase">
                      Generating {progress > 0 && `${progress}%`}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-white/40">
                    <PlayCircle size={64} strokeWidth={1} />
                    <span className="text-xs font-semibold tracking-widest uppercase mt-4">
                      {durationSeconds} SECONDS
                    </span>
                  </div>
                )}

                {error && (
                  <div className="absolute inset-0 bg-red-950/90 flex flex-col items-center justify-center p-6 text-center">
                    <AlertCircle className="text-red-400 mb-3" size={32} />
                    <p className="text-red-200 text-sm font-medium">{error}</p>
                  </div>
                )}
              </div>

              {/* Scene Info */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900">Scene {scene.scene_number}</h3>
                  <div className="border border-slate-200 text-slate-500 text-xs px-3 py-1 rounded-full font-medium">
                    <span className="text-slate-900 font-bold">{durationSeconds}</span> seconds
                  </div>
                </div>

                {completedVideos.length > 1 && (
                  <div className="mb-6 flex items-center gap-2">
                    <History size={14} className="text-slate-400 shrink-0" />
                    <select
                      className="text-xs bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-700 w-full cursor-pointer outline-none focus:ring-2 focus:ring-slate-900"
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

                {/* Text Content Blocks */}
                <div className="space-y-6 flex-grow">
                  <div>
                    <span className="text-[11px] font-bold text-slate-900 uppercase tracking-widest block mb-1">Entry</span>
                    <p className="text-slate-500 text-[15px] leading-relaxed">{scene.entry_animation}</p>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-900 uppercase tracking-widest block mb-1">Dialogue</span>
                    <div className="border border-slate-100 rounded-2xl p-4 mt-1 bg-white">
                      <p className="text-slate-900 italic font-medium">&quot;{scene.dialogue_words}&quot;</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-900 uppercase tracking-widest block mb-1">Exit</span>
                    <p className="text-slate-500 text-[15px] leading-relaxed">{scene.exit_animation}</p>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-900 uppercase tracking-widest block mb-1">Triggers</span>
                    <p className="text-slate-400 text-sm leading-relaxed">{scene.audio_visual_triggers}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 space-y-3">
                  {error ? (
                    <div className="w-full flex flex-col items-center gap-2">
                      <div className="text-red-500 text-sm font-medium w-full text-center bg-red-50 py-2 rounded-lg">
                        {error}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRetryVideo(index)}
                        disabled={isGenerating}
                        className="w-full bg-slate-900 text-white font-semibold flex items-center justify-center gap-2 h-12 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                        Retry Generation
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleGenerateVideo(index)}
                      disabled={isGenerating}
                      className="w-full bg-slate-900 text-white font-semibold flex items-center justify-center gap-2 h-12 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-70"
                    >
                      {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Video size={18} />}
                      {scene.videoUrl ? 'Regenerate Video' : 'Generate Video'}
                    </button>
                  )}
                  <div className="flex gap-3 w-full">
                    <button
                      type="button"
                      onClick={() => handleCopyText(scene)}
                      className="flex-1 border border-slate-200 text-slate-600 font-medium flex items-center justify-center gap-2 h-10 rounded-xl hover:bg-slate-50 transition-colors text-sm"
                    >
                      <FileText size={14} />
                      Copy Text
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyJSON(scene)}
                      className="flex-1 border border-slate-200 text-slate-600 font-medium flex items-center justify-center gap-2 h-10 rounded-xl hover:bg-slate-50 transition-colors text-sm"
                    >
                      <Braces size={14} />
                      Copy JSON
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Doc } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { anyApi } from 'convex/server';
import { useAuth } from '@/components/AuthProvider';
import { Skeleton } from '@/components/ui/skeleton';
import { VideoPlayer } from '@/components/ui/video-player';
import { Loader2, AlertCircle, PlayCircle, Video as VideoIcon, Folder, ChevronRight, ArrowLeft, Clock, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function timeAgo(dateInput: number) {
  const seconds = Math.floor((Date.now() - dateInput) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return interval + " years ago";
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return interval + " months ago";
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return interval + " days ago";
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return interval + " hours ago";
  interval = Math.floor(seconds / 60);
  if (interval > 1) return interval + " mins ago";
  return Math.floor(seconds) + " seconds ago";
}

export default function VideoManager() {
  const { userId } = useAuth();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const videos = useQuery(anyApi.videos.list, userId ? { userId } : "skip") as Doc<"videos">[] | undefined;
  const projects = useQuery(anyApi.projects.get, userId ? { userId } : "skip") as Doc<"projects">[] | undefined;

  const isLoading = videos === undefined;
  const videoList = videos || [];

  // Group videos by project
  const projectGroups = videoList.reduce((acc: Record<string, Doc<"videos">[]>, video) => {
    if (!acc[video.projectId]) {
      acc[video.projectId] = [];
    }
    acc[video.projectId].push(video);
    return acc;
  }, {});

  const selectedProject = projects?.find((p: Doc<"projects">) => p._id === selectedProjectId);
  const filteredVideos = selectedProjectId ? (projectGroups[selectedProjectId] || []) : [];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-12">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-primary/5 rounded-[2rem] p-8 md:p-12 border border-primary/10">
        <div className="relative z-10 max-w-2xl">
          {selectedProjectId && (
            <button
              onClick={() => setSelectedProjectId(null)}
              className="flex items-center gap-2 text-primary hover:opacity-80 transition-all text-sm font-bold uppercase tracking-widest mb-6 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Projects
            </button>
          )}
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-4 leading-tight">
            Video <span className="text-primary italic">Library</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-2 max-w-md">
            {selectedProjectId 
              ? `Exploring generations for "${selectedProject?.name}"`
              : "Access all your AI-generated ASMR scenes and production assets in one place."}
          </p>
          {selectedProjectId && (
            <div className="flex items-center gap-2 text-primary font-bold bg-primary/10 w-fit px-4 py-1.5 rounded-full text-sm mt-4 border border-primary/20">
              <History size={14} />
              {filteredVideos.length} Total Generations
            </div>
          )}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-accent/10 rounded-full blur-2xl" />
      </section>

      <div className="px-4">
        {/* Skeleton State */}
        {isLoading && (
          <div className="flex flex-wrap gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex-1 min-w-[320px] max-w-full flex flex-col bg-card border border-border rounded-[2.5rem] p-0 overflow-hidden">
                <Skeleton className="aspect-[4/3] w-full rounded-none" />
                <div className="p-8 space-y-6">
                  <Skeleton className="h-8 w-2/3 rounded-xl" />
                  <Skeleton className="h-4 w-1/3 rounded-full" />
                  <div className="pt-6 border-t border-border space-y-3">
                    <Skeleton className="h-4 w-full rounded-full" />
                    <Skeleton className="h-4 w-5/6 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && videoList.length === 0 && (
          <div className="w-full flex flex-col items-center justify-center py-24 text-center bg-card/50 rounded-[3rem] border border-dashed border-border/60">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6 border border-border/40">
              <VideoIcon size={40} className="text-muted-foreground/30" />
            </div>
            <h3 className="text-3xl font-serif font-bold text-foreground mb-3">No Videos Yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto italic">Start generating scenes from your projects to populate your library.</p>
          </div>
        )}

        {/* Project Folders View */}
        {!isLoading && !selectedProjectId && videoList.length > 0 && (
          <div className="flex flex-wrap gap-8">
            {Object.entries(projectGroups).map(([projectId, groupVideos]) => {
              const project = projects?.find((p: Doc<"projects">) => p._id === projectId);
              const projectName = project ? project.name : "Unknown Project";

              return (
                <button
                  key={projectId}
                  onClick={() => setSelectedProjectId(projectId)}
                  className="flex-1 min-w-[320px] max-w-full group flex flex-col bg-card border border-border/60 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-[0_32px_64px_-16px_rgba(99,102,241,0.12)] hover:border-primary/30 text-left cursor-pointer"
                >
                  <div className="p-10 flex items-center gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                    
                    <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-inner relative z-10">
                      <Folder size={36} />
                    </div>
                    <div className="flex-1 min-w-0 relative z-10">
                      <h3 className="text-2xl font-serif font-bold text-foreground group-hover:text-primary transition-colors duration-300 truncate">
                        {projectName}
                      </h3>
                      <p className="text-primary font-bold flex items-center gap-2 mt-2 text-sm uppercase tracking-widest">
                        {groupVideos.length} {groupVideos.length === 1 ? 'scene' : 'scenes'}
                        <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                      </p>
                    </div>
                  </div>
                  <div className="px-10 pb-8 mt-auto">
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden border border-border/20">
                      <div className="h-full bg-primary/20 w-full" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Scene List View (Inside Folder) */}
        {!isLoading && selectedProjectId && (
          <div className="flex flex-wrap gap-8">
            {filteredVideos.map((video: Doc<"videos">) => {
              return (
                <div key={video._id} className="flex-1 min-w-[320px] max-w-full group flex flex-col bg-card border border-border/60 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-[0_32px_64px_-16px_rgba(99,102,241,0.12)] hover:border-primary/30">
                  {/* Media Area */}
                  <div className="aspect-[4/3] bg-black relative flex items-center justify-center overflow-hidden">
                    {video.status === 'completed' && video.url ? (
                      <VideoPlayer
                        src={video.url}
                        className="w-full h-full"
                      />
                    ) : video.status === 'generating' ? (
                      <div className="flex flex-col items-center text-white/70">
                        <Loader2 className="animate-spin mb-3 text-white" size={32} />
                        <span className="text-xs font-semibold tracking-widest uppercase">
                          Generating {(video?.progress || 0) > 0 && `${Math.round(video.progress || 0)}%`}
                        </span>
                      </div>
                    ) : video.status === 'error' ? (
                      <div className="flex flex-col items-center text-red-400 p-6 text-center">
                        <AlertCircle className="mb-3" size={40} />
                        <span className="text-sm font-bold tracking-widest uppercase text-red-200">Production Error</span>
                      </div>
                    ) : (
                      <PlayCircle className="text-white/20" size={80} strokeWidth={1} />
                    )}

                    {/* Status Badge Overlays */}
                    <div className="absolute top-6 right-6 flex gap-2">
                      {video.status === 'generating' && (
                        <div className="bg-primary/90 backdrop-blur-md text-primary-foreground border border-white/10 shadow-lg flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Building
                        </div>
                      )}
                      {video.status === 'completed' && (
                        <div className="bg-accent/90 backdrop-blur-md text-accent-foreground border border-white/10 shadow-lg flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
                          <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                          Ready
                        </div>
                      )}
                      {video.status === 'error' && (
                        <div className="bg-destructive/90 backdrop-blur-md text-destructive-foreground border border-white/10 shadow-lg flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
                          <AlertCircle className="h-3 w-3" />
                          Failed
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Details Area */}
                  <div className="p-10 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h3 className="text-2xl font-serif font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                          Scene {video.sceneIndex}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock size={12} className="text-muted-foreground" />
                          <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                            Generated {timeAgo(video._creationTime || Date.now())}
                          </span>
                        </div>
                      </div>
                      <div className="bg-muted px-3 py-1.5 rounded-xl text-muted-foreground text-[10px] font-bold tracking-widest uppercase border border-border/40 shrink-0">
                        ID:{video._id.slice(-4)}
                      </div>
                    </div>

                    <div className="pt-8 border-t border-border/40 flex-grow">
                      {video.error ? (
                        <div className="bg-destructive/5 text-destructive text-sm p-5 rounded-2xl border border-destructive/10 font-medium italic leading-relaxed">
                          &quot;{video.error}&quot;
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center bg-muted/30 p-4 rounded-2xl border border-border/40">
                            <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Generation Status</span>
                            <span className={cn(
                              "text-sm font-bold px-3 py-1 rounded-full",
                              video.status === 'completed' ? "text-accent bg-accent/10" : "text-primary bg-primary/10"
                            )}>
                              {video.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

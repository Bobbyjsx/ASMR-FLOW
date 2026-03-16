'use client';

import { useState } from 'react';
import { useQuery } from 'convex/react';
import { anyApi } from 'convex/server';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { VideoPlayer } from '@/components/ui/video-player';
import { Loader2, AlertCircle, PlayCircle, Video as VideoIcon, Folder, ChevronRight, ArrowLeft } from 'lucide-react';

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
  const videos = useQuery(anyApi.videos.list, userId ? { userId } : "skip");
  const projects = useQuery(anyApi.projects.get, userId ? { userId } : "skip") || [];

  const isLoading = videos === undefined;
  const videoList = videos || [];

  // Group videos by project
  const projectGroups = videoList.reduce((acc: Record<string, any[]>, video) => {
    if (!acc[video.projectId]) {
      acc[video.projectId] = [];
    }
    acc[video.projectId].push(video);
    return acc;
  }, {});

  const selectedProject = projects.find((p: any) => p._id === selectedProjectId);
  const filteredVideos = selectedProjectId ? (projectGroups[selectedProjectId] || []) : [];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
        <div className="flex flex-col gap-2">
          {selectedProjectId && (
             <button 
               onClick={() => setSelectedProjectId(null)}
               className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium mb-2 group"
             >
               <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
               Back to Projects
             </button>
          )}
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-none">
            {selectedProjectId ? selectedProject?.name : "Video Manager"}
          </h1>
          {selectedProjectId && (
            <p className="text-slate-500 font-medium">
              {filteredVideos.length} {filteredVideos.length === 1 ? 'scene' : 'scenes'} generated
            </p>
          )}
        </div>
      </div>

      {/* Skeleton State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col bg-white border border-slate-200 rounded-[24px] shadow-sm p-0 overflow-hidden space-y-4">
              <Skeleton className="aspect-[4/3] w-full rounded-none" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && videoList.length === 0 && (
        <div className="col-span-full text-center py-24 text-slate-500 bg-slate-50/50 rounded-[24px] border border-dashed border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <VideoIcon size={48} className="mb-4 text-slate-300" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No videos yet</h3>
          <p className="text-slate-500 max-w-sm">Videos you generate for your project scenes will appear here.</p>
        </div>
      )}

      {/* Project Folders View */}
      {!isLoading && !selectedProjectId && videoList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {Object.entries(projectGroups).map(([projectId, groupVideos]) => {
            const project = projects.find((p: any) => p._id === projectId);
            const projectName = project ? project.name : "Unknown Project";
            
            return (
              <button
                key={projectId}
                onClick={() => setSelectedProjectId(projectId)}
                className="group flex flex-col bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-slate-300 text-left cursor-pointer"
              >
                <div className="p-8 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300 shadow-inner">
                    <Folder size={32} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-slate-900 truncate group-hover:text-slate-900 transition-colors">
                      {projectName}
                    </h3>
                    <p className="text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                      {groupVideos.length} {groupVideos.length === 1 ? 'scene' : 'scenes'}
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                  </div>
                </div>
                <div className="px-8 pb-6 mt-auto">
                   <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-900/10 w-full" />
                   </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Scene List View (Inside Folder) */}
      {!isLoading && selectedProjectId && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredVideos.map((video: any) => {
            return (
              <div key={video._id} className="flex flex-col bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-slate-300">
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
                        Generating {video.progress > 0 && `${Math.round(video.progress)}%`}
                      </span>
                    </div>
                  ) : video.status === 'error' ? (
                    <div className="flex flex-col items-center text-red-400">
                      <AlertCircle className="mb-2" size={32} />
                      <span className="text-xs font-semibold tracking-widest uppercase text-red-200">Failed</span>
                    </div>
                  ) : (
                    <PlayCircle className="text-white/30" size={64} strokeWidth={1} />
                  )}
                  
                  {/* Status Badge Overlays */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    {video.status === 'generating' && (
                      <div className="bg-slate-900/80 backdrop-blur-md text-white border border-white/10 shadow-sm flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wide">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Generating
                      </div>
                    )}
                    {video.status === 'completed' && (
                      <div className="bg-slate-900/80 backdrop-blur-md text-white border border-white/10 shadow-sm flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wide">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                        Ready
                      </div>
                    )}
                    {video.status === 'error' && (
                      <div className="bg-red-950/80 backdrop-blur-md text-red-200 border border-red-500/30 shadow-sm flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wide">
                        <AlertCircle className="h-3 w-3" />
                        Error
                      </div>
                    )}
                  </div>
                </div>

                {/* Details Area */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-bold text-slate-900 line-clamp-1 pr-4">
                      Scene {video.sceneIndex}
                    </h3>
                    <div className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider shrink-0">
                      #{video._id.slice(-4)}
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-100 flex-grow">
                    {video.error ? (
                      <div className="bg-red-50 text-red-700 text-sm p-4 rounded-xl border border-red-100 font-medium">
                        {video.error}
                      </div>
                    ) : (
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-medium">Status</span>
                          <span className="capitalize font-bold text-slate-900">{video.status}</span>
                        </div>
                        {video._creationTime && (
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">Created</span>
                            <span className="text-slate-900 font-medium">{timeAgo(video._creationTime)}</span>
                          </div>
                        )}
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
  );
}

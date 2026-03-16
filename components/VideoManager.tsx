'use client';

import { useQuery } from 'convex/react';
import { anyApi } from 'convex/server';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, AlertCircle, PlayCircle, Video as VideoIcon } from 'lucide-react';

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
  const videos = useQuery(anyApi.videos.list, userId ? { userId } : "skip");
  const projects = useQuery(anyApi.projects.get, userId ? { userId } : "skip") || [];

  const isLoading = videos === undefined;
  const videoList = videos || [];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <VideoIcon size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Video Manager</h1>
          <p className="text-muted-foreground mt-1">Manage and view all your generated scene videos.</p>
        </div>
      </div>

      {/* Skeleton State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden flex flex-col border-border bg-card">
              <Skeleton className="aspect-video w-full" />
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/3 mt-1" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && videoList.length === 0 && (
        <div className="text-center py-20 px-4 bg-muted/30 rounded-xl border border-dashed border-border">
          <VideoIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground">No videos yet</h3>
          <p className="text-muted-foreground mt-2 max-w-sm mx-auto">Videos you generate for your project scenes will appear here.</p>
        </div>
      )}

      {/* Video Grid */}
      {!isLoading && videoList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoList.map((video: any) => {
            const project = projects.find((p: any) => p._id === video.projectId);
            const projectName = project ? project.name : "Unknown Project";
            
            return (
              <Card key={video._id} className="overflow-hidden flex flex-col border-border shadow-sm bg-card transition-all hover:shadow-md hover:border-primary/20">
                {/* Media Area */}
                <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden border-b border-border">
                  {video.status === 'completed' && video.url ? (
                    <video 
                      src={video.url} 
                      controls 
                      className="w-full h-full object-cover"
                    />
                  ) : video.status === 'generating' ? (
                    <div className="flex flex-col items-center text-white/70">
                      <Loader2 className="animate-spin mb-3 text-primary" size={32} />
                      <span className="text-sm font-medium tracking-wide">
                        Generating... {video.progress > 0 && `${Math.round(video.progress)}%`}
                      </span>
                    </div>
                  ) : video.status === 'error' ? (
                    <div className="flex flex-col items-center text-red-400">
                      <AlertCircle className="mb-2" size={32} />
                      <span className="text-sm font-medium">Failed</span>
                    </div>
                  ) : (
                    <PlayCircle className="text-white/30" size={48} />
                  )}
                  
                  {/* Status Badge Overlays */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    {video.status === 'generating' && (
                      <Badge variant="outline" className="bg-blue-500/20 text-blue-200 border-blue-500/50 backdrop-blur-sm shadow-sm gap-1.5 px-2.5 py-0.5 whitespace-nowrap">
                        <Loader2 className="h-3 w-3 animate-spin inline-block" />
                        Generating
                      </Badge>
                    )}
                    {video.status === 'completed' && (
                      <Badge variant="outline" className="bg-green-500/20 text-green-200 border-green-500/50 backdrop-blur-sm shadow-sm gap-1.5 px-2.5 py-0.5 whitespace-nowrap">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                        Ready
                      </Badge>
                    )}
                    {video.status === 'error' && (
                      <Badge variant="outline" className="bg-red-500/20 text-red-200 border-red-500/50 backdrop-blur-sm shadow-sm gap-1.5 px-2.5 py-0.5 whitespace-nowrap">
                        <AlertCircle className="h-3 w-3 inline-block" />
                        Error
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Details Area */}
                <CardHeader className="pb-3 bg-secondary/30">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-base font-semibold text-foreground line-clamp-1">
                        {projectName}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium">
                          Scene {video.sceneIndex}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-4 flex-grow">
                  {video.error ? (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
                      {video.error}
                    </div>
                  ) : (
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between items-center py-1">
                        <span className="text-muted-foreground">ID</span>
                        <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded text-foreground">{video._id.slice(-8)}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-muted-foreground">Status</span>
                        <span className="capitalize font-medium text-foreground">{video.status}</span>
                      </div>
                      {video._creationTime && (
                        <div className="flex justify-between items-center py-1">
                          <span className="text-muted-foreground">Created</span>
                          <span className="text-foreground">{timeAgo(video._creationTime)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { Doc } from '@/convex/_generated/dataModel';
import { anyApi } from 'convex/server';
import { checkVideoOperation, downloadVideoBlob } from '@/lib/veo';
import { useAuth } from '@/components/AuthProvider';
import { successToast, errorToast } from '@/lib/toast';

export default function VideoPollingManager() {
  const { userId } = useAuth();
  const generatingVideos = useQuery(anyApi.videos.getGenerating, userId ? { userId } : "skip") as Doc<"videos">[] | undefined;
  const markError = useMutation(anyApi.videos.markError);
  const completeVideo = useMutation(anyApi.videos.completeVideo);
  const generateUploadUrl = useMutation(anyApi.videos.generateUploadUrl);
  
  const pollingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!generatingVideos) return;
    generatingVideos.forEach((video: Doc<"videos">) => {
      if (!video.operationId || pollingRef.current.has(video._id)) return;
      
      const poll = async () => {
        pollingRef.current.add(video._id);
        
        try {
          // Add a small delay so we don't spam checks instantly
          await new Promise(resolve => setTimeout(resolve, 5000));
          
          while (true) {
            const operation = await checkVideoOperation(video.operationId);
            
            if (operation.done) {
              const uri = operation.response?.generatedVideos?.[0]?.video?.uri || 
                          operation.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;
              
              if (!uri) {
                console.error("Operation completed but no URI found:", operation);
                throw new Error("No video URI in completed operation");
              }
              
              const blob = await downloadVideoBlob(uri);
              
              // Upload to Convex
              const uploadUrl = await generateUploadUrl();
              const result = await fetch(uploadUrl, {
                method: "POST",
                headers: { "Content-Type": blob.type },
                body: blob,
              });
              
              if (!result.ok) throw new Error("Failed to upload video to storage");
              const { storageId } = await result.json();
              
              // Complete
              await completeVideo({ id: video._id, storageId });
              successToast("Video generation complete! 🎬");
              break;
            } else {
              await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
            }
          }
        } catch (error: any) {
          console.error("Polling error for video:", video._id, error);
          await markError({ id: video._id, error: error.message || "Failed to generate" });
        } finally {
          pollingRef.current.delete(video._id);
        }
      };

      poll();
    });
  }, [generatingVideos, markError, completeVideo, generateUploadUrl]);

  return null; // Invisible
}

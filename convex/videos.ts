import { mutationGeneric as mutation, queryGeneric as query } from "convex/server";
import { v } from "convex/values";

// Generate an upload URL for the client to push the blob directly to Convex storage
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Create a new video generation record
export const create = mutation({
  args: {
    projectId: v.id("projects"),
    sceneIndex: v.number(),
    operationId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("videos", {
      projectId: args.projectId,
      sceneIndex: args.sceneIndex,
      operationId: args.operationId,
      status: "generating",
      progress: 0,
    });
  },
});

// Update the progress of an ongoing generation
export const updateProgress = mutation({
  args: {
    id: v.id("videos"),
    progress: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { progress: args.progress });
  },
});

// Mark video generation as error
export const markError = mutation({
  args: {
    id: v.id("videos"),
    error: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { 
      status: "error",
      error: args.error
    });
  },
});

// Complete video generation and link the video to the project scene
export const completeVideo = mutation({
  args: {
    id: v.id("videos"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) throw new Error("Could not construct storage URL");

    const video = await ctx.db.get(args.id);
    if (!video) throw new Error("Video record not found");

    // Update the video record
    await ctx.db.patch(args.id, {
      status: "completed",
      storageId: args.storageId,
      url,
      progress: 100,
    });

    // Update the corresponding project scene with the new video URL
    const project = await ctx.db.get(video.projectId);
    if (project) {
      const scenes = [...project.scenes];
      if (scenes[video.sceneIndex]) {
        scenes[video.sceneIndex] = {
          ...scenes[video.sceneIndex],
          videoUrl: url,
        };
        await ctx.db.patch(video.projectId, { scenes });
      }
    }
    
    return url;
  },
});

// List all videos for a user (via their projects)
export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const videos = await ctx.db.query("videos").order("desc").collect();
    
    // Filter to only videos belonging to the user's projects
    const result = await Promise.all(
      videos.map(async (video) => {
        const project = await ctx.db.get(video.projectId);
        if (!project || project.userId !== args.userId) return null;
        return video;
      })
    );
    
    return result.filter(Boolean);
  },
});

// Get actively generating videos for a user
export const getGenerating = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const videos = await ctx.db
      .query("videos")
      .filter((q) => q.eq(q.field("status"), "generating"))
      .collect();

    const result = await Promise.all(
      videos.map(async (video) => {
        const project = await ctx.db.get(video.projectId);
        if (!project || project.userId !== args.userId) return null;
        return video;
      })
    );

    return result.filter(Boolean);
  },
});

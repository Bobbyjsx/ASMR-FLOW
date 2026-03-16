import { mutationGeneric as mutation, queryGeneric as query } from "convex/server";
import { v } from "convex/values";

export const get = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    theme: v.string(),
    length: v.string(),
    asmristId: v.string(),
    userId: v.string(),
    scenes: v.array(
      v.object({
        scene_number: v.number(),
        duration: v.string(),
        character_description: v.string(),
        scene_description: v.string(),
        entry_animation: v.string(),
        dialogue_words: v.string(),
        audio_visual_triggers: v.string(),
        exit_animation: v.string(),
        videoUrl: v.optional(v.string()),
        isGeneratingVideo: v.optional(v.boolean()),
        videoError: v.optional(v.string()),
      })
    ),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("projects", {
      name: args.name,
      theme: args.theme,
      length: args.length,
      asmristId: args.asmristId,
      userId: args.userId,
      scenes: args.scenes,
      createdAt: args.createdAt,
    });
  },
});

export const updateSceneVideo = mutation({
  args: {
    projectId: v.id("projects"),
    userId: v.string(),
    sceneIndex: v.number(),
    videoUrl: v.optional(v.string()),
    isGeneratingVideo: v.optional(v.boolean()),
    videoError: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error("Project not found.");
    if (project.userId !== args.userId) throw new Error("Not authorized.");
    
    const scenes = [...project.scenes];
    scenes[args.sceneIndex] = {
      ...scenes[args.sceneIndex],
      ...(args.videoUrl !== undefined && { videoUrl: args.videoUrl }),
      ...(args.isGeneratingVideo !== undefined && { isGeneratingVideo: args.isGeneratingVideo }),
      ...(args.videoError !== undefined && { videoError: args.videoError }),
    };
    
    await ctx.db.patch(args.projectId, { scenes });
  },
});

export const remove = mutation({
  args: { id: v.id("projects"), userId: v.string() },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);
    if (!project) throw new Error("Project not found.");
    if (project.userId !== args.userId) throw new Error("Not authorized.");
    await ctx.db.delete(args.id);
  },
});

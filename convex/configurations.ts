import { mutationGeneric as mutation, queryGeneric as query } from "convex/server";
import { v } from "convex/values";

export const listEnabled = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("configurations")
      .withIndex("by_enabled", (q) => q.eq("enabled", true))
      .collect();
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const configs = [
      // LLM Models
      { type: "llm_model", label: "Gemini 3.1 Pro Preview", value: "gemini-3.1-pro-preview", enabled: true },
      { type: "llm_model", label: "Gemini 3 Pro Preview", value: "gemini-3-pro-preview", enabled: true, is_default: true },
      { type: "llm_model", label: "Gemini 3 Flash Preview", value: "gemini-3-flash-preview", enabled: true },
      { type: "llm_model", label: "Gemini 3.1 Flash Lite Preview", value: "gemini-3.1-flash-lite-preview", enabled: true },
      { type: "llm_model", label: "Gemini 2.5 Flash", value: "gemini-2.5-flash", enabled: true },
      { type: "llm_model", label: "Gemini 2.5 Flash Lite", value: "gemini-2.5-flash-lite", enabled: true },
      
      // Video Models
      { type: "video_model", label: "Veo 3.1 Generate Preview", value: "veo-3.1-generate-preview", enabled: true, is_default: true },
      { type: "video_model", label: "Veo 3.1 Fast Generate Preview", value: "veo-3.1-fast-generate-preview", enabled: true },
      { type: "video_model", label: "Veo 3.0 Generate", value: "veo-3.0-generate-001", enabled: true },
      { type: "video_model", label: "Veo 3.0 Fast Generate", value: "veo-3.0-fast-generate-001", enabled: true },
      { type: "video_model", label: "Veo 2.0 Generate", value: "veo-2.0-generate-001", enabled: true },
      
      // Resolutions
      { type: "video_resolution", label: "1080p", value: "1080p", enabled: true },
      { type: "video_resolution", label: "720p", value: "720p", enabled: true },
      
      // Aspect Ratios
      { type: "video_aspect_ratio", label: "16:9 (Landscape)", value: "16:9", enabled: true },
      { type: "video_aspect_ratio", label: "9:16 (Portrait)", value: "9:16", enabled: true },
      { type: "video_aspect_ratio", label: "1:1 (Square)", value: "1:1", enabled: true },
      
      // Limits
      { type: "max_project_creation", label: "Max Projects", value: "5", enabled: true },
      { type: "max_video_generation", label: "Max Video Scenes", value: "20", enabled: true },
    ];

    for (const config of configs) {
      const existingConfig = await ctx.db
        .query("configurations")
        .withIndex("by_type", (q) => q.eq("type", config.type as any))
        .filter((q) => q.eq(q.field("value"), config.value))
        .unique();

      if (existingConfig) {
        await ctx.db.patch(existingConfig._id, { 
          label: config.label, 
          enabled: config.enabled,
          is_default: (config as any).is_default ?? false
        });
      } else {
        await ctx.db.insert("configurations", config as any);
      }
    }
    
    return "Seeded and updated successfully";
  },
});

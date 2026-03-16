import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    username: v.string(),
    passwordHash: v.string(),
  }).index("by_email", ["email"]).index("by_username", ["username"]),
  
  asmrists: defineTable({
    name: v.string(),
    description: v.string(),
    userId: v.string(),
  }).index("by_user", ["userId"]),
  
  projects: defineTable({
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
  }).index("by_user", ["userId"]),
  
  videos: defineTable({
    projectId: v.id("projects"),
    sceneIndex: v.number(),
    operationId: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
    url: v.optional(v.string()),
    status: v.union(v.literal("generating"), v.literal("completed"), v.literal("error")),
    error: v.optional(v.string()),
    progress: v.optional(v.number()),
  }).index("by_project", ["projectId"]).index("by_project_scene", ["projectId", "sceneIndex"]),
});

import { mutationGeneric as mutation, queryGeneric as query } from "convex/server";
import { v } from "convex/values";

export const get = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("asmrists")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("asmrists", {
      name: args.name,
      description: args.description,
      userId: args.userId,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("asmrists"), userId: v.string() },
  handler: async (ctx, args) => {
    const asmrist = await ctx.db.get(args.id);
    if (!asmrist) throw new Error("ASMRist not found.");
    if (asmrist.userId !== args.userId) throw new Error("Not authorized.");
    await ctx.db.delete(args.id);
  },
});

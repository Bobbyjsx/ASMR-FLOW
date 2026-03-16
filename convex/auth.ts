import { mutationGeneric as mutation, queryGeneric as query, actionGeneric as action } from "convex/server";
import { v } from "convex/values";

// A simple SHA-256 hash function using Web Crypto API available in Convex edge environment
async function hashPassword(password: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

export const signup = mutation({
  args: { email: v.string(), username: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existingEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
      
    if (existingEmail) {
      throw new Error("An account with this email already exists.");
    }

    // Check if username already exists
    const existingUsername = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    if (existingUsername) {
      throw new Error("This username is already taken.");
    }
    
    // Hash password
    const passwordHash = await hashPassword(args.password);
    
    // Create new user
    return await ctx.db.insert("users", { 
      email: args.email, 
      username: args.username,
      passwordHash 
    });
  },
});

export const login = mutation({
  args: { identifier: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    // Try to find user by email first
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.identifier))
      .first();
      
    // If not found by email, try by username
    if (!user) {
      user = await ctx.db
        .query("users")
        .withIndex("by_username", (q) => q.eq("username", args.identifier))
        .first();
    }
      
    if (!user) {
      throw new Error("Invalid email/username or password.");
    }

    // Hash provided password and compare
    const inputHash = await hashPassword(args.password);
    
    if (user.passwordHash !== inputHash) {
      throw new Error("Invalid email/username or password.");
    }
    
    return user._id;
  },
});

export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

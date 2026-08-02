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

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function generateResetToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const requestPasswordReset = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error("No account found with that email address.");
    }

    const token = generateResetToken();
    const tokenHash = await hashPassword(token);

    await ctx.db.patch(user._id, {
      resetTokenHash: tokenHash,
      resetTokenExpiresAt: Date.now() + RESET_TOKEN_TTL_MS,
    });

    return token;
  },
});

export const resetPassword = mutation({
  args: { token: v.string(), newPassword: v.string() },
  handler: async (ctx, args) => {
    const tokenHash = await hashPassword(args.token);

    const user = await ctx.db
      .query("users")
      .withIndex("by_reset_token", (q) => q.eq("resetTokenHash", tokenHash))
      .first();

    if (!user) {
      throw new Error("Invalid or expired reset token.");
    }

    if (!user.resetTokenExpiresAt || user.resetTokenExpiresAt < Date.now()) {
      throw new Error("This reset token has expired. Please request a new one.");
    }

    const passwordHash = await hashPassword(args.newPassword);

    await ctx.db.patch(user._id, {
      passwordHash,
      resetTokenHash: undefined,
      resetTokenExpiresAt: undefined,
    });
  },
});

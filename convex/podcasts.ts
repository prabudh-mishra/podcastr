import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getURL = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const createPodcast = mutation({
  args: {
    podcastTitle: v.string(),
    podcastDescription: v.string(),
    audioURL: v.string(),
    imageURL: v.string(),
    voiceType: v.string(),
    voicePrompt: v.string(),
    imagePrompt: v.string(),
    audioDuration: v.number(),
    views: v.number(),
    audioStorageId: v.id("_storage"),
    imageStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("User not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .collect();

    if (user.length === 0) {
      throw new ConvexError("User not found");
    }

    const podcast = await ctx.db.insert("podcasts", {
      ...args,
      user: user[0]._id,
      author: user[0].name,
      authorId: user[0].clerkId,
      authorImageURL: user[0].imageURL,
    });

    return podcast;
  },
});

export const getTrendingPodcasts = query({
  handler: async (ctx) => {
    const podcasts = await ctx.db.query("podcasts").collect();

    return podcasts;
  },
});

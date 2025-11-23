import { v } from "convex/values";
import { query } from "./_generated/server";
import { mutation } from "./functions";
import { r2 } from "./r2";
import { api } from "./_generated/api";

export const getTestimonials = query({
  args: { searchQuery: v.optional(v.string()) },
  handler: async (ctx, { searchQuery }) => {
    const user = await ctx.runQuery(api.auth.getCurrentUser);

    if (!user) {
      throw new Error("Unauthorized");
    }

    let filterredQuery = ctx.db
      .query("testimonials")
      .filter((q) => q.neq(q.field("title"), undefined))
      .filter((q) => q.neq(q.field("summary"), undefined))
      .filter((q) => q.neq(q.field("testimonialText"), undefined));

    if (user.role === "user") {
      filterredQuery = filterredQuery.filter((q) =>
        q.eq(q.field("approved"), true)
      );
    }

    const trimmedSearchQuery = searchQuery?.trim() || "";

    const finishedQuery =
      trimmedSearchQuery.length > 0
        ? filterredQuery.withSearchIndex("search_posts", (q) =>
            q.search("searchText", trimmedSearchQuery)
          )
        : filterredQuery.order("desc");

    const testimonials = await finishedQuery.collect();

    const testimonialsWithMedia = await Promise.all(
      testimonials.map(async (t) => {
        const mediaUrl = t.storageId ? await r2.getUrl(t.storageId) : undefined;
        return { ...t, mediaUrl };
      })
    );

    return testimonialsWithMedia;
  },
});

export const postTestimonial = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
    storageId: v.optional(v.string()),
    media_type: v.string(),
    text: v.string(),
  },
  handler: async (ctx, { name, email, storageId, media_type, text }) => {
    const id = await ctx.db.insert("testimonials", {
      name,
      email,
      storageId,
      media_type,
      testimonialText: text,
      createdAt: Date.now(),
    });
    return id;
  },
});

export const updateTestimonialApproval = mutation({
  args: {
    id: v.id("testimonials"),
    approved: v.boolean(),
  },
  handler: async (ctx, { id, approved }) => {
    const permissionCheck = await ctx.runQuery(api.auth.checkUserPermissions, {
      permissions: { testimonial: ["approve"] },
    });

    if (!permissionCheck.success) {
      throw new Error("Forbidden");
    }

    await ctx.db.patch(id, { approved });
    return { id, approved };
  },
});

export const getTestimonialById = query({
  args: { id: v.id("testimonials") },
  handler: async (ctx, { id }) => {
    const testimonial = await ctx.db.get(id);

    if (!testimonial) {
      return undefined;
    }

    const mediaUrl = testimonial.storageId
      ? await r2.getUrl(testimonial.storageId)
      : undefined;
    return {
      ...testimonial,
      mediaUrl,
    };
  },
});

export const updateTranscription = mutation({
  args: {
    id: v.id("testimonials"),
    text: v.string(),
  },
  handler: async (ctx, { id, text }) => {
    await ctx.db.patch(id, { testimonialText: text });
  },
});

export const updateSummaryAndTitle = mutation({
  args: {
    id: v.id("testimonials"),
    summary: v.string(),
    title: v.string(),
  },
  handler: async (ctx, { id, summary, title }) => {
    await ctx.db.patch(id, { summary, title });
  },
});

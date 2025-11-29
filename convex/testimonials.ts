import { v } from "convex/values";
import { query } from "./_generated/server";
import { mutation } from "./functions";
import { r2 } from "./r2";
import { isModOrAdmin, Role } from "./lib/permissions";
import { paginationOptsValidator } from "convex/server";

export const getTestimonials = query({
  args: { paginationOpts: paginationOptsValidator, searchQuery: v.optional(v.string()) },
  handler: async (ctx, { paginationOpts, searchQuery }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!isModOrAdmin(identity?.role as Role | undefined)) {
      throw new Error("Unauthorized");
    }

    const testimonialQuery = ctx.db.query("testimonials");

    const testimonialQuerySearch = (searchQuery && searchQuery.trim() !== "")
      ? testimonialQuery.withSearchIndex("search_posts", (q) =>
          q.search("searchText", searchQuery)
        )
      : testimonialQuery.order("desc");

    const filteredTestimonialQuery = testimonialQuerySearch
      .filter((q) => q.neq(q.field("title"), undefined))
      .filter((q) => q.neq(q.field("summary"), undefined))
      .filter((q) => q.neq(q.field("testimonialText"), undefined));

    const testimonials = await filteredTestimonialQuery.paginate(paginationOpts);

    const testimonialsWithMedia = await Promise.all(
      testimonials.page.map(async (t) => {
        const mediaUrl = t.storageId ? await r2.getUrl(t.storageId) : undefined;
        return { ...t, mediaUrl };
      })
    );
    
    return { ...testimonials, page: testimonialsWithMedia };
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
      approved: false,
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
    const identity = await ctx.auth.getUserIdentity();
    if (!isModOrAdmin(identity?.role as Role | undefined)) {
      throw new Error("Unauthorized");
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

import { v } from "convex/values";
import { query } from "./_generated/server";
import { mutation } from "./functions";
import { r2 } from "./r2";
import { paginationOptsValidator, PaginationResult } from "convex/server";
import { api } from "./_generated/api";

export const getTestimonials = query({
  args: {
    paginationOpts: paginationOptsValidator,
    searchQuery: v.optional(v.string()),
  },
  handler: async (ctx, { paginationOpts, searchQuery }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        page: [] as never[],
        isDone: true,
        continueCursor: "",
      } satisfies PaginationResult<never>;
    }

    const testimonialQuery = ctx.db.query("testimonials");

    const testimonialQuerySearch =
      searchQuery && searchQuery.trim() !== ""
        ? testimonialQuery.withSearchIndex("search_posts", (q) =>
            q.search("searchText", searchQuery.trim()),
          )
        : testimonialQuery.order("desc");

    const canApprove = await ctx.runQuery(api.auth.checkUserPermissions, {
      permissions: {
        testimonial: ["approve"],
      },
    });

    const filteredTestimonialQuery = testimonialQuerySearch
      .filter((q) => q.neq(q.field("title"), undefined))
      .filter((q) => q.neq(q.field("summary"), undefined))
      .filter((q) => q.neq(q.field("testimonialText"), undefined))
      .filter((q) => (canApprove ? true : q.eq(q.field("approved"), true)));

    const { page, ...rest } =
      await filteredTestimonialQuery.paginate(paginationOpts);

    const testimonialsWithMedia = await Promise.all(
      page.map(async (t) => {
        const mediaUrl = t.storageId ? await r2.getUrl(t.storageId) : undefined;
        return { ...t, mediaUrl };
      }),
    );

    return { ...rest, page: testimonialsWithMedia };
  },
});

export const postTestimonial = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
    storageId: v.optional(v.string()),
    media_type: v.string(),
    text: v.string(),
    orgSlug: v.string(),
  },
  handler: async (ctx, { name, email, storageId, media_type, text, orgSlug }) => {
    const id = await ctx.db.insert("testimonials", {
      name,
      email,
      storageId,
      media_type,
      testimonialText: text,
      createdAt: Date.now(),
      orgSlug,
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
    const canApprove = await ctx.runQuery(api.auth.checkUserPermissions, {
      permissions: { testimonial: ["approve"] },
    });

    if (!canApprove) {
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

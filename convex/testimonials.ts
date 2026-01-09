import { type PaginationResult, paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { query } from "./_generated/server";
import { mutation } from "./functions";
import { processingStatusSchema } from "./schema";
import removeUndefinedFromRecord from "./utils";

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

    const r2PublicUrl = process.env.R2_PUBLIC_URL;

    const testimonialsWithMedia = await Promise.all(
      page.map(async (t) => {
        const mediaUrl = t.storageId
          ? `${r2PublicUrl}/${t.storageId}`
          : undefined;
        return { ...t, mediaUrl };
      }),
    );

    return { ...rest, page: testimonialsWithMedia };
  },
});

export const postTestimonial = mutation({
  args: {
    name: v.optional(v.string()),
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
      processingStatus: "ongoing",
    });
    return id;
  },
});

export const updateTestimonialStorageId = mutation({
  args: {
    id: v.id("testimonials"),
    storageId: v.string(),
  },
  handler: async (ctx, { id, storageId }) => {
    await ctx.db.patch(id, { storageId });
    return { id, storageId };
  },
});

export const updateTestimonialApproval = mutation({
  args: {
    id: v.id("testimonials"),
    approved: v.optional(v.boolean()),
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
    const r2PublicUrl = process.env.R2_PUBLIC_URL;

    if (!testimonial || !r2PublicUrl) {
      return undefined;
    }

    const mediaUrl = testimonial.storageId
      ? `${r2PublicUrl}/${testimonial.storageId}`
      : undefined;
    return {
      ...testimonial,
      mediaUrl,
    };
  },
});
export const updateTestimonial = mutation({
  args: {
    _id: v.id("testimonials"),
    storageId: v.optional(v.string()),
    testimonialText: v.optional(v.string()),
    processingStatus: v.optional(processingStatusSchema),
  },
  handler: async (ctx, args) => {
    const cleaned = removeUndefinedFromRecord(args);
    await ctx.db.patch(args._id, cleaned);
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

export const updateProcessingStatus = mutation({
  args: {
    id: v.id("testimonials"),
    processingStatus: processingStatusSchema,
  },
  handler: async (ctx, { id, processingStatus }) => {
    await ctx.db.patch(id, { processingStatus });
  },
});

export const retryProcessing = mutation({
  args: {
    id: v.id("testimonials"),
  },
  handler: async (ctx, { id }) => {
    const testimonial = await ctx.db.get(id);
    if (!testimonial) return;
    const status = testimonial.processingStatus;
    if (status !== "error") return;

    await ctx.db.patch(id, { processingStatus: "ongoing" });

    if (testimonial.storageId && !testimonial.testimonialText) {
      await ctx.scheduler.runAfter(0, api.mediaProcessing.processMedia, {
        mediaKey: testimonial.storageId,
        testimonialId: id,
      });
      return;
    }

    if (!testimonial.summary || !testimonial.title) {
      await ctx.scheduler.runAfter(0, api.ai.summarizeText, {
        testimonialId: id,
        text: testimonial.testimonialText || "",
      });
    }
  },
});

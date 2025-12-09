import { v } from "convex/values";
import { internalAction, query } from "../_generated/server";
import { mutation } from "../functions";
import { r2 } from "../r2";

export const foundMediaForMigrations = query({
  async handler(ctx) {
    const testimonials = await ctx.db
      .query("testimonials")
      .filter((q) => q.neq(q.field("media_id"), undefined))
      .filter((q) => q.eq(q.field("storageId"), undefined))
      .collect();

    const medias = await Promise.all(
      testimonials.map(async (t) => {
        const mediaType = await ctx.db.system.get(t.media_id!);
        return { _id: t._id, mediaType, mediaId: t.media_id };
      }),
    );

    return medias;
  },
});

export const updateStorageId = mutation({
  args: {
    testimonialId: v.id("testimonials"),
    mediaId: v.id("_storage"),
    storageId: v.string(),
  },
  async handler(ctx, { testimonialId, storageId }) {
    await ctx.db.patch(testimonialId, { storageId });
  },
});

export const uploadToR2Action = internalAction({
  args: {
    mediaId: v.id("_storage"),
    mediaType: v.optional(v.string()),
  },
  async handler(ctx, { mediaId, mediaType }) {
    const blob = await ctx.storage.get(mediaId);
    if (!blob) {
      return undefined;
    }
    const storageId = await r2.store(ctx, blob, { type: mediaType });
    return storageId;
  },
});

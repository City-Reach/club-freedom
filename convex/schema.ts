import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const processingStatusSchema = v.union(
  v.literal("ongoing"),
  v.literal("completed"),
  v.literal("error"),
);

export default defineSchema({
  testimonials: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    media_type: v.string(),
    storageId: v.optional(v.string()),
    title: v.optional(v.string()),
    testimonialText: v.optional(v.string()),
    summary: v.optional(v.string()),
    searchText: v.optional(v.string()),
    approved: v.optional(v.boolean()), // Whether the testimonial is approved for display
    processingStatus: v.optional(processingStatusSchema),
  })
    .index("by_name", {
      fields: ["name"],
    })
    .index("by_mediaType", {
      fields: ["media_type"],
    })
    .searchIndex("search_posts", {
      searchField: "searchText",
      filterFields: ["media_type", "_creationTime", "name"],
    }),
});

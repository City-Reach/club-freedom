import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  testimonials: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    media_type: v.string(),
    createdAt: v.optional(v.float64()),
    storageId: v.optional(v.string()),
    title: v.optional(v.string()),
    testimonialText: v.optional(v.string()),
    summary: v.optional(v.string()),
    searchText: v.optional(v.string()),
    approved: v.optional(v.boolean()), // Whether the testimonial is approved for display
  }).searchIndex("search_posts", {
    searchField: "searchText",
  }),
});

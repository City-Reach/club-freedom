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
    organizationId: v.optional(v.string()),
    approved: v.optional(v.boolean()),
    processingStatus: v.optional(processingStatusSchema),
  })
    .index("by_processingStatus_and_organizationId", {
      fields: ["processingStatus", "organizationId"],
    })
    .index("by_organizationId", {
      fields: ["organizationId"],
    })
    .searchIndex("search_posts", {
      searchField: "searchText",
      filterFields: ["processingStatus", "organizationId"],
    }),
});

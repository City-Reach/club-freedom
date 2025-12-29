import { v } from "convex/values";
import { doc } from "convex-helpers/validators";
import { query } from "./_generated/server";
import schema from "./schema";

export const getOrganization = query({
  args: { slug: v.string() },
  returns: v.union(v.null(), doc(schema, "organization")),
  handler: async (ctx, { slug }) => {
    const organization = await ctx.db
      .query("organization")
      .withIndex("slug", (q) => q.eq("slug", slug))
      .first();
    return organization;
  },
});

export const isInOrganization = query({
  args: {
    organizationId: v.string(),
    userId: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, { organizationId, userId }) => {
    const found = await ctx.db
      .query("member")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("organizationId"), organizationId))
      .first();

    return !!found;
  },
});

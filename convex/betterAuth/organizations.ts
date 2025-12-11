import { v } from "convex/values";
import { query } from "./_generated/server";

export const getOrgBySlug = query({
  args: { orgSlug: v.string() },
  handler: async (ctx, { orgSlug }) => {
    const organizationQuery = await ctx.db.query("organization")
      .withIndex("slug", (q) => q.eq("slug", orgSlug))
      .take(1);
    if (organizationQuery.length > 0) {
      return [organizationQuery[0].slug];
    }
    return organizationQuery //returns undefined while query is in progress and [] if nothing found
  },
});
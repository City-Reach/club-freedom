import { v } from "convex/values";
import { query } from "./_generated/server";
import { components } from "./_generated/api";

export const getOrganizationBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const organization = await ctx.runQuery(
      components.betterAuth.organization.getOrganization,
      { slug },
    );
    return organization;
  },
});

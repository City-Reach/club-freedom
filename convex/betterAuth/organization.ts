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
export type IAbbreviatedOrg = {
  name: string;
  slug: string;
};
export const getAllOrganizations = query({
  handler: async (ctx) => {
    const orgResults = await ctx.db
      .query("organization")
      .withIndex("name")
      .order("asc")
      .collect();
    const organizations: IAbbreviatedOrg[] = orgResults.map((org) => ({
      name: org.name,
      slug: org.slug,
    }));
    return organizations;
  },
});

import { v } from "convex/values";
import { components } from "./_generated/api";
import { query } from "./_generated/server";

export const getOrg = query({
  args: { orgSlug: v.string() },
  handler: async (ctx, args) => {
    return ctx.runQuery(components.betterAuth.organizations.getOrgBySlug, {
      orgSlug: args.orgSlug,
    });
  },
});

export const getAllOrgsWrapper = query({
  handler: async (ctx) => {
    return ctx.runQuery(components.betterAuth.organizations.getAllOrgs);
  },
});

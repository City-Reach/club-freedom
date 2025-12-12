import { query } from "./_generated/server";
import { components } from "./_generated/api";
import { v } from "convex/values";

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
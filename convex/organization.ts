import { v } from "convex/values";
import type { Doc } from "@/convex/betterAuth/_generated/dataModel";
import { components } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { authComponent, createAuth } from "./auth";

export const getOrganizationBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const organization = await ctx.runQuery(
      components.betterAuth.organization.getOrganization,
      { slug },
    );
    return organization as Doc<"organization">;
  },
});

export const getAllOrganizations = query({
  handler: async (ctx) => {
    const { headers, auth } = await authComponent.getAuth(createAuth, ctx);
    const organizations = auth.api.listOrganizations({
      headers,
    });
    return organizations;
  },
});

export const isUserInOrganization = query({
  args: { organizationId: v.string(), userId: v.string() },
  handler: async (ctx, { organizationId, userId }) => {
    return await ctx.runQuery(
      components.betterAuth.organization.isInOrganization,
      { organizationId, userId },
    );
  },
});

export const setActiveOrganization = mutation({
  args: {
    organizationSlug: v.optional(v.string()),
    organizationId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { headers, auth } = await authComponent.getAuth(createAuth, ctx);
    try {
      const data = await auth.api.setActiveOrganization({
        headers,
        body: {
          organizationId: args.organizationId,
          organizationSlug: args.organizationSlug,
        },
      });
      return data !== null;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
});

import { v } from "convex/values";
import type { Doc } from "@/convex/betterAuth/_generated/dataModel";
import type { OrganizationPermissionCheck } from "@/lib/auth/permissions/organization";
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
    return organization as Doc<"organization"> | null;
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

export const checkPermission = query({
  handler: async (
    ctx,
    args: {
      permissions: OrganizationPermissionCheck;
    },
  ) => {
    const { headers, auth } = await authComponent.getAuth(createAuth, ctx);
    try {
      const { success } = await auth.api.hasPermission({
        headers,
        body: {
          permissions: args.permissions,
        },
      });
      return success;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
});

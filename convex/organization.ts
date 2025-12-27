import { v } from "convex/values";
import type { Doc } from "@/convex/betterAuth/_generated/dataModel";
import { components } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { authComponent, createAuth } from "./auth";
import { r2 } from "./r2";

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

export const generateLogoUploadUrl = mutation({
  args: {
    organizationId: v.string(),
    oldUrl: v.optional(v.string()),
  },
  handler: async (ctx, { organizationId, oldUrl }) => {
    // Remove old logo if exists
    if (oldUrl?.startsWith(process.env.R2_PUBLIC_URL!)) {
      const oldKey = oldUrl.replace(`${process.env.R2_PUBLIC_URL}/`, "");
      await r2.deleteObject(ctx, oldKey);
    }

    const key = `assets/${organizationId}/logo-${Date.now()}`;
    const { url } = await r2.generateUploadUrl(key);
    const storageUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
    return {
      url,
      key,
      storageUrl,
    };
  },
});

export const generateIconUploadUrl = mutation({
  args: {
    organizationId: v.string(),
    oldUrl: v.optional(v.string()),
  },
  handler: async (ctx, { organizationId, oldUrl }) => {
    if (oldUrl?.startsWith(process.env.R2_PUBLIC_URL!)) {
      const oldKey = oldUrl.replace(`${process.env.R2_PUBLIC_URL}/`, "");
      await r2.deleteObject(ctx, oldKey);
    }
    const key = `assets/${organizationId}/icon-${Date.now()}`;
    const { url } = await r2.generateUploadUrl(key);
    const storageUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
    return {
      url,
      key,
      storageUrl,
    };
  },
});

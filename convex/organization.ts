import { v } from "convex/values";
import type { Doc } from "@/convex/betterAuth/_generated/dataModel";
import { components } from "./_generated/api";

import { query } from "./_generated/server";
import { authComponent, createAuth } from "./auth";
import type { IAbbreviatedOrg } from "./betterAuth/organization";

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

export const getAllUserOrganizations = query({
  handler: async (ctx) => {
    const { headers, auth } = await authComponent.getAuth(createAuth, ctx);
    const organizations = auth.api.listOrganizations({
      headers,
    });
    return organizations;
  },
});

export const getAllOrganizations = query({
  handler: async (ctx) => {
    const organizations = await ctx.runQuery(
      components.betterAuth.organization.getAllOrganizations,
    );
    return organizations as IAbbreviatedOrg[];
  },
});

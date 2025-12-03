import { v } from "convex/values";
import { query } from "./_generated/server";
import { authComponent, createAuth } from "./auth";

export const listOrganizations = query({
  handler: async (ctx) => {
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
    const data = await auth.api.listOrganizations({
      headers,
    });
    return data;
  },
});

export const getOrganizationBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
    const data = await auth.api.getFullOrganization({
      headers,
      query: {
        membersLimit: 0,
        organizationSlug: args.slug,
      },
    });
    return data;
  },
});

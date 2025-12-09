import { mutation } from "../functions";
import { authComponent, createAuth } from "@/convex/auth";
import { v } from "convex/values";

export const createOrganization = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    userId: v.string(),
    logo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { auth } = await authComponent.getAuth(createAuth, ctx);
    await auth.api.createOrganization({
        body: {
            name: args.name,
            slug: args.slug,
            logo: args.logo,
            userId: args.userId,
            keepCurrentActiveOrganization: true,
        },
    });
  },
});


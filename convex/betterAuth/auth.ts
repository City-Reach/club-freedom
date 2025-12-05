import { query } from "./_generated/server";
import { doc } from "convex-helpers/validators";
import schema from "./schema";
import { v } from "convex/values";
import { createAuth } from "../auth";
import { getStaticAuth } from "@convex-dev/better-auth";
import { Id } from "./_generated/dataModel";

// Export a static instance for Better Auth schema generation
export const auth = getStaticAuth(createAuth);

// Example of an in-component function
// Feel free to edit, omit, etc.
export const getUser = query({
  args: { userId: v.id("user") },
  returns: v.union(v.null(), doc(schema, "user")),
  handler: async (ctx, args) => {
    return ctx.db.get(args.userId);
  },
});

export const checkEmailExists = query({
  args: { email: v.string() },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("user")
      .withIndex("email_name", (q) => q.eq("email", args.email))
      .first();
    return !!user;
  },
});

export const findInvitationById = query({
  args: { invitationId: v.string() },
  returns: v.union(v.null(), doc(schema, "invitation")),
  handler: async (ctx, args) => {
    return ctx.db
      .query("invitation")
      .withIndex("by_id", (q) =>
        q.eq("_id", args.invitationId as Id<"invitation">),
      )
      .first();
  },
});

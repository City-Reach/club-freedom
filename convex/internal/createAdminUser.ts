import { v } from "convex/values";
import { authComponent, createAuth } from "../auth";
import { mutation } from "../functions";

export const createAdminUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const { auth } = await authComponent.getAuth(createAuth, ctx);
    return await auth.api.createUser({
      body: {
        name: args.name,
        email: args.email,
        password: args.password,
        role: "admin",
      },
    });
  },
});

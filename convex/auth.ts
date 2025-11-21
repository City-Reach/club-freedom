import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { requireActionCtx } from "@convex-dev/better-auth/utils";
import { convex } from "@convex-dev/better-auth/plugins";
import { components } from "@/convex/_generated/api";
import { DataModel } from "@/convex/_generated/dataModel";
import { query } from "@/convex/_generated/server";
import { betterAuth, BetterAuthOptions } from "better-auth";
import authSchema from "@/convex/betterAuth/schema";
import { v } from "convex/values";
import { sendResetPassword } from "./email";

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel, typeof authSchema>(
  components.betterAuth,
  {
    local: {
      schema: authSchema,
    },
    verbose: false,
  }
);

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false }
) => {
  const siteUrl = process.env.SITE_URL!;
  console.log("Creating Better Auth with site URL:", siteUrl);

  return betterAuth({
    user: {
      additionalFields: {
        role: {
          type: "string",
          required: false,
          defaultValue: "user",
          input: false, // don't allow user to set role
        },
      },
    },
    // disable logging when createAuth is called just to generate options.
    // this is not required, but there's a lot of noise in logs without it.
    logger: {
      disabled: optionsOnly,
    },
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    // Configure simple, non-verified email/password to get started
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      sendResetPassword: async ({ user, url }) => {
        await sendResetPassword(requireActionCtx(ctx), {
          to: user.email,
          url,
        });
      },
    },
    plugins: [
      // The Convex plugin is required for Convex compatibility
      convex(),
    ],
    trustedOrigins: [
      siteUrl
    ],
  } satisfies BetterAuthOptions);
};

// Example function for getting the current user
// Feel free to edit, omit, etc.
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await authComponent.getAuthUser(ctx);
    } catch (err: unknown) {
      // If the call failed because the user is not signed in, return null so client code can handle it.
      // Be conservative: only swallow unauthenticated errors; rethrow unexpected errors.
      const message = (err as any)?.message ?? "";
      if (
        message.toString().toLowerCase().includes("unauthenticated") ||
        (err as any)?.name === "Unauthenticated"
      ) {
        return null;
      }
      throw err;
    }
  },
});

// Get a user by their Better Auth user id with Local Install
export const getUserById = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return ctx.runQuery(components.betterAuth.auth.getUser, {
      userId: args.userId,
    });
  },
});

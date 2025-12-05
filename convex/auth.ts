import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import {
  requireActionCtx,
  requireQueryCtx,
} from "@convex-dev/better-auth/utils";
import { betterAuth, BetterAuthOptions } from "better-auth";
import { admin, organization } from "better-auth/plugins";
import { v } from "convex/values";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import authSchema from "./betterAuth/schema";
import { sendInvite, sendResetPassword } from "./email";
import {
  type PermissionCheck,
  Role,
  adminOptions,
} from "@/lib/auth/permissions/admin";
import { organizationOptions } from "@/lib/auth/permissions/organization";
import { api } from "./betterAuth/_generated/api";

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

  return betterAuth({
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
      autoSignIn: true,
    },
    plugins: [
      // The Convex plugin is required for Convex compatibility
      convex(),
      admin(adminOptions),
      organization({
        ...organizationOptions,
        allowUserToCreateOrganization: async (user) => {
          return user?.role === "admin";
        },
        sendInvitationEmail: async ({ id, organization, email }) => {
          await sendInvite(requireActionCtx(ctx), {
            to: email,
            subject: `You're invited to ${organization.name}`,
            url: `${siteUrl}/accept-invite?id=${id}&email=${encodeURIComponent(email)}`,
            organization: organization.name,
          });
        },
      }),
    ],
    databaseHooks: {
      user: {
        create: {
          before: async (user, context) => {
            const invitationId = context?.headers?.get("x-invitation-id");
            if (!invitationId) {
              return false;
            }
            const invitation = await requireActionCtx(ctx).runQuery(
              components.betterAuth.auth.findInvitationById,
              {
                invitationId,
              }
            );
            if (!invitation || invitation.email !== user.email) {
              return false;
            }
            return { data: user };
          },
        },
      },
    },
    trustedOrigins: [siteUrl],
  } satisfies BetterAuthOptions);
};

// Example function for getting the current user
// Feel free to edit, omit, etc.
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await authComponent.getAuthUser(ctx);
    } catch (err) {
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

export const checkEmailExists = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return ctx.runQuery(components.betterAuth.auth.checkEmailExists, {
      email: args.email,
    });
  },
});

export const checkUserPermissions = query({
  handler: async (
    ctx,
    args: {
      role?: Role;
      permissions?: PermissionCheck;
    }
  ) => {
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
    try {
      const { success } = await auth.api.userHasPermission({
        headers,
        body: {
          role: args.role,
          permissions: args.permissions || {},
        },
      });
      return success;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
});

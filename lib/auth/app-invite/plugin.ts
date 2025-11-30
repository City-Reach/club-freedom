import { BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint } from "better-auth/api";
import { z } from "zod";
import { adminMiddleware } from "./middlewares";
import { MODEL_NAME, roleSchema } from "./schema";
import { getAppInviteAdapter } from "./adapters";
import { AppInviteOption } from "./types";

export const appInvite = (option?: AppInviteOption) => {
  return {
    id: "app-invite",
    schema: {
      appInvite: {
        modelName: MODEL_NAME,
        fields: {
          id: {
            type: "string",
            required: true,
            input: false,
          },
          email: {
            type: "string",
            unique: true,
            required: true,
          },
          createdAt: {
            type: "date",
            required: true,
            input: false,
            defaultValue: () => new Date(),
          },
          role: {
            type: "string",
            required: true,
            validator: {
              input: roleSchema,
            },
          },
        },
      },
    },

    endpoints: {
      createAppInvitation: createAuthEndpoint(
        "/app-invite/create-invitation",
        {
          method: "POST",
          body: z.object({
            email: z.email(),
            role: roleSchema,
          }),
          use: [adminMiddleware],
          requireHeaders: true,
        },
        async ({ context, body, json, error }) => {
          if (context.user.email == body.email) {
            throw error("BAD_REQUEST", { message: "Cannot invite yourself" });
          }
          const user = await context.internalAdapter.findUserByEmail(
            body.email,
          );
          if (user) {
            throw error("BAD_REQUEST", { message: "User already exists" });
          }
          const adapter = getAppInviteAdapter(context);
          const invitation = await adapter.createInivitation({
            email: body.email,
            role: body.role,
          });
          await option?.sendInvitationEmail?.({
            invitation,
            issuer: context.user,
          });
          return json(invitation);
        },
      ),
      getAppInvitation: createAuthEndpoint(
        "/app-invite/get-invitation",
        {
          method: "GET",
          body: z.object({
            id: z.string(),
          }),
        },
        async ({ context, body }) => {
          const adapter = getAppInviteAdapter(context);
          return adapter.getInvitation(body.id);
        },
      ),
      acceptAppInvitation: createAuthEndpoint(
        "/app-invite/accept-invitation",
        {
          method: "POST",
          body: z.object({
            inviteId: z.string(),
            name: z.string(),
            password: z.string(),
          }),
        },
        async ({ context, body, json, error }) => {
          const { inviteId, name, password } = body;
          const adapter = getAppInviteAdapter(context);
          const invitation = await adapter.getInvitation(inviteId);

          if (!invitation) {
            throw error("NOT_FOUND", {
              message: "Invitation not found",
            });
          }

          const user = await context.internalAdapter.createUser({
            email: invitation.email,
            emailVerified: true,
            name,
            createdAt: new Date(),
            updatedAt: new Date(),
            role: invitation.role,
          });

          const hashedPassword = await context.password.hash(password);
          await context.internalAdapter.linkAccount({
            userId: user.id,
            accountId: user.id,
            providerId: "credential",
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          await adapter.deleteInvitation(inviteId);

          return json({ user });
        },
      ),
      listAppInvitations: createAuthEndpoint(
        "/app-invite/list-invitations",
        {
          method: "GET",
          use: [adminMiddleware],
          requireHeaders: true,
        },
        async ({ context, json }) => {
          const adapter = getAppInviteAdapter(context);
          const invitations = await adapter.listInvitations();

          return json({ invitations });
        },
      ),
      updateAppInvitationRole: createAuthEndpoint(
        "/app-invite/update-invitation-role",
        {
          method: "POST",
          body: z.object({
            id: z.string(),
            role: roleSchema,
          }),
          use: [adminMiddleware],
          requireHeaders: true,
        },
        async ({ context, body, json, error }) => {
          const { id, role } = body;
          const adapter = getAppInviteAdapter(context);
          const invitation = await adapter.getInvitation(id);

          if (!invitation) {
            throw error("NOT_FOUND", {
              message: "Invitation not found",
            });
          }

          await adapter.updateInvitation(id, { role });

          return json({ message: "Invitation role updated" });
        },
      ),
      deleteAppInvitation: createAuthEndpoint(
        "/app-invite/delete-invitation",
        {
          method: "POST",
          body: z.object({
            id: z.string(),
          }),
          use: [adminMiddleware],
          requireHeaders: true,
        },
        async ({ context, body, json, error }) => {
          const { id } = body;
          const adapter = getAppInviteAdapter(context);
          const invitation = await adapter.getInvitation(id);

          if (!invitation) {
            throw error("NOT_FOUND", {
              message: "Invitation not found",
            });
          }

          await adapter.deleteInvitation(id);
        },
      ),
    },
  } satisfies BetterAuthPlugin;
};

import { generateId } from "better-auth";
import z from "zod";
import { ALL_ROLES } from "../permissions";

export const MODEL_NAME = "appInvite";

export const roleSchema = z.enum(ALL_ROLES);

export const appInvitationSchema = z.object({
  id: z.string().default(generateId),
  email: z.email(),
  role: roleSchema,
  createdAt: z.date().default(() => new Date()),
});

export type AppInvitation = z.infer<typeof appInvitationSchema>;

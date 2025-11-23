import { v } from "convex/values";
import z from "zod";

/**
 * Role type represents the possible permission levels in the system.
 * It is derived from the keys of VALID_ROLES.
 */
export type Role = (typeof VALID_ROLES)[keyof typeof VALID_ROLES];

/**
 * Valid roles in the system, in order of increasing privileges:
 * - USER: Can view and modify data belonging to them
 * - ADMIN: Has full system access
 */
export const VALID_ROLES = {
  USER: "user",
  MODERATOR: "moderator",
  ADMIN: "admin",
} as const;

export const roles_schema = v.union(
  v.literal("user"),
  v.literal("admin"),
  v.literal("moderator")
);

export const allowedRoles = z.enum(["user", "moderator", "admin"]);

export function isModOrAdmin(role?: Role): boolean {
  return role === "admin" || role === "moderator";
}

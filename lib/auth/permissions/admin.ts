import { createAccessControl, type Subset } from "better-auth/plugins/access";
import type {
  AdminOptions,
  InferAdminRolesFromOption,
} from "better-auth/plugins/admin";
import {
  adminAc,
  defaultStatements,
  userAc,
} from "better-auth/plugins/admin/access";

const statement = {
  testimonial: ["view", "approve", "download", "delete"],
  ...defaultStatements,
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
  ...userAc.statements,
});

export const admin = ac.newRole({
  ...adminAc.statements,
});

export const roles = {
  user,
  admin,
} as const;

export const adminRBAC = {
  ac,
  roles,
} satisfies AdminOptions;

export type Role = InferAdminRolesFromOption<typeof adminRBAC>;

export const ALL_ROLES = Object.keys(roles) as Array<Role>;

export type AdminPermissionCheck = Partial<
  Subset<keyof typeof statement, typeof statement>
>;

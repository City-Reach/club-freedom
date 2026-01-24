import { createAccessControl, type Subset } from "better-auth/plugins/access";
import type { InferAdminRolesFromOption } from "better-auth/plugins/admin";
import {
  adminAc,
  defaultStatements,
  memberAc,
  type OrganizationOptions,
} from "better-auth/plugins/organization";

const statement = {
  testimonial: ["approve", "download"],
  ...defaultStatements,
} as const;

export const ac = createAccessControl(statement);

export const member = ac.newRole({
  testimonial: [],
  ...memberAc.statements,
});

export const admin = ac.newRole({
  testimonial: ["approve", "download"],
  ...adminAc.statements,
});

export const roles = {
  member,
  admin,
} as const;

export const adminOptions = {
  ac,
  roles,
} satisfies OrganizationOptions;

export type Role = InferAdminRolesFromOption<typeof adminOptions>;

export const ALL_ROLES = Object.keys(roles) as Array<Role>;

export type OrganizationPermissionCheck = Partial<
  Subset<keyof typeof statement, typeof statement>
>;

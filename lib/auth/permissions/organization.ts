import { createAccessControl, type Subset } from "better-auth/plugins/access";
import type { InferAdminRolesFromOption } from "better-auth/plugins/admin";
import type { OrganizationOptions } from "better-auth/plugins/organization";
import {
  adminAc,
  defaultStatements,
  memberAc,
  ownerAc,
} from "better-auth/plugins/organization/access";

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

export const owner = ac.newRole({
  testimonial: ["approve", "download"],
  ...ownerAc.statements,
});

export const roles = {
  member,
  admin,
} as const;

export const organizationRBAC = {
  ac,
  roles,
} satisfies OrganizationOptions;

export type Role = InferAdminRolesFromOption<typeof organizationRBAC>;

export const ALL_ROLES = Object.keys(roles) as Array<Role>;

export type OrganizationPermissionCheck = Partial<
  Subset<keyof typeof statement, typeof statement>
>;

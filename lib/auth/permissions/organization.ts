import type {
  InferOrganizationRolesFromOption,
  OrganizationOptions,
} from "better-auth/plugins";
import { createAccessControl, type Subset } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
  ownerAc,
} from "better-auth/plugins/organization/access";

const statement = {
  testimonial: ["approve", "download"],
  ...defaultStatements,
} as const;

const ac = createAccessControl(statement);

const owner = ac.newRole({
  testimonial: ["approve", "download"],
  ...ownerAc.statements,
});

const admin = ac.newRole({
  testimonial: ["approve", "download"],
  ...adminAc.statements,
});

const member = ac.newRole({
  testimonial: [],
});

export const roles = {
  owner,
  admin,
  member,
} as const;

export const organizationRBAC = {
  ac,
  roles,
} satisfies OrganizationOptions;

export type Role = InferOrganizationRolesFromOption<typeof organizationRBAC>;

export const ALL_ROLES = Object.keys(roles) as Array<Role>;

export type OrganizationPermissionCheck = Partial<
  Subset<keyof typeof statement, typeof statement>
>;

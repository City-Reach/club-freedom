import {
  InferOrganizationRolesFromOption,
  OrganizationOptions,
} from "better-auth/plugins";
import { createAccessControl, Subset } from "better-auth/plugins/access";
import {
  defaultStatements,
  adminAc,
  ownerAc,
} from "better-auth/plugins/organization/access";

const statement = {
  testimonial: ["approve"],
  ...defaultStatements,
} as const;

export const ac = createAccessControl(statement);

export const member = ac.newRole({
  testimonial: [],
});

export const admin = ac.newRole({
  testimonial: ["approve"],
  ...adminAc.statements,
});

export const owner = ac.newRole({
  testimonial: ["approve"],
  ...ownerAc.statements,
});

export const roles = {
  member,
  admin,
  owner,
} as const;

export const organizationOptions = {
  ac,
  roles,
} satisfies OrganizationOptions;

export type Role = InferOrganizationRolesFromOption<typeof organizationOptions>;

export const ALL_ROLES = Object.keys(roles) as Array<Role>;

export type PermissionCheck = Partial<
  Subset<keyof typeof statement, typeof statement>
>;

export const displayRole = (role: Role) => {
  switch (role) {
    case "admin":
      return "Admin";
    case "owner":
      return "Owner";
    case "member":
      return "Member";
  }
};

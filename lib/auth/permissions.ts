import { createAccessControl, Subset } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const statement = {
  testimonial: ["approve"],
  ...defaultStatements,
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
  testimonial: [],
});

export const moderator = ac.newRole({
  testimonial: ["approve"],
});

export const admin = ac.newRole({
  testimonial: ["approve"],
  ...adminAc.statements,
});

export const roles = {
  user,
  moderator,
  admin,
} as const;

export type Role = keyof typeof roles;
export type PermissionCheck = Partial<
  Subset<keyof typeof statement, typeof statement>
>;

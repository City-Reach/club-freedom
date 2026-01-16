import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
} from "better-auth/plugins/organization/access";

const statement = {
  testimonial: ["approve", "download"],
  ...defaultStatements,
} as const;

export const ac = createAccessControl(statement);

export const member = ac.newRole({
  testimonial: [],
});

export const admin = ac.newRole({
  testimonial: ["approve", "download"],
  ...adminAc.statements,
});

export const owner = ac.newRole({
  testimonial: ["approve", "download"],
  ...adminAc.statements,
});

export const roles = {
  member,
  admin,
  owner,
} as const;

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
  ...defaultStatements,
};

const ac = createAccessControl(statement);

const user = ac.newRole({
  ...userAc.statements,
});

const admin = ac.newRole({
  ...adminAc.statements,
});

const roles = {
  user,
  admin,
} as const;

export const adminRBAC = {
  ac,
  roles: {
    user,
    admin,
  },
} satisfies AdminOptions;

export type Role = InferAdminRolesFromOption<typeof adminRBAC>;

export const ALL_ROLES = Object.keys(roles) as Array<Role>;

export type PermissionCheck = Partial<
  Subset<keyof typeof statement, typeof statement>
>;

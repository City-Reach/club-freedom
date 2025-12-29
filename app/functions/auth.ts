import { createServerFn } from "@tanstack/react-start";
import { api } from "@/convex/_generated/api";
import { fetchAuthQuery } from "@/lib/auth/auth-server";

export const getCurrentUser = createServerFn().handler(() => {
  const user = fetchAuthQuery(api.auth.getCurrentUser, {});
  return user;
});

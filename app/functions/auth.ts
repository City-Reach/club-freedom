import { createServerFn } from "@tanstack/react-start";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "@/lib/auth/auth-server";

export const getCurrentUser = createServerFn().handler(() => {
  const user = fetchQuery(api.auth.getCurrentUser, {});
  return user;
});

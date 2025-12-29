import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { api } from "@/convex/_generated/api";
import { fetchAuthQuery } from "@/lib/auth/auth-server";

export const getCurrentUser = createServerFn().handler(() => {
  const user = fetchAuthQuery(api.auth.getCurrentUser, {});
  return user;
});

export const getUserById = createServerFn()
  .inputValidator(
    z.object({
      userId: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const user = await fetchQuery(api.auth.getUserById, {
      userId: data.userId,
    });
    return user;
  });

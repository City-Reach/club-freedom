import { api } from "@/convex/_generated/api";
import { fetchQuery } from "@/lib/auth/auth-server";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";

export const listOrganizations = createServerFn().handler(async () => {
  return await fetchQuery(api.organization.listOrganizations, {});
});

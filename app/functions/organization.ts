import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { api } from "@/convex/_generated/api";
import { fetchAuthMutation, fetchAuthQuery } from "@/lib/auth/auth-server";

export const setActiveOrganization = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      organizationId: z.string(),
    }),
  )
  .handler(async ({ data: { organizationId } }) => {
    const success = await fetchAuthMutation(
      api.organization.setActiveOrganization,
      {
        organizationId,
      },
    );
    return success;
  });

export const getAllOrganizations = createServerFn({ method: "GET" }).handler(
  async () => {
    const organizations = await fetchAuthQuery(
      api.organization.getAllOrganizations,
    );
    return organizations;
  },
);

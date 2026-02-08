import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { api } from "@/convex/_generated/api";

export const Route = createFileRoute("/o/$orgSlug")({
  component: Outlet,
  beforeLoad: async ({ context, params }) => {
    const organization = await context.queryClient.ensureQueryData(
      convexQuery(api.organization.getOrganizationBySlug, {
        slug: params.orgSlug,
      }),
    );
    if (!organization) {
      throw notFound();
    }

    return { organization };
  },
  loader: async ({ context }) => {
    return { organization: context.organization };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {};
    }
    const { organization } = loaderData;
    return {
      title: `${organization.name}`,
      meta: [{ name: "description", content: organization.name }],
    };
  },
});

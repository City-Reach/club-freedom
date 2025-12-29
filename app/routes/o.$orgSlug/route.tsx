import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import NotFound from "@/components/not-found";
import { api } from "@/convex/_generated/api";

export const Route = createFileRoute("/o/$orgSlug")({
  component: Outlet,
  notFoundComponent: NotFound,
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
  head: (ctx) => {
    const organization = ctx.loaderData?.organization;
    if (!organization) {
      return {};
    }
    return {
      meta: [
        {
          title: organization.name,
        },
      ],
      links: [
        organization.icon
          ? {
              rel: "icon",
              href: organization.icon,
            }
          : undefined,
      ].filter(Boolean),
    };
  },
});

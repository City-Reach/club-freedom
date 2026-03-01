import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { api } from "@/convex/_generated/api";
import { applyTheme, organizationThemes } from "@/themes/default_themes";

export const Route = createFileRoute("/o/$orgSlug")({
  component: Outlet,
  beforeLoad: async ({ context, params }) => {
    const organization = await context.queryClient.ensureQueryData(
      convexQuery(api.organization.getOrganizationBySlug, {
        slug: params.orgSlug,
      }),
    );

    if (organization && organization['slug'] === 'organization-2') {
      const theme = organizationThemes.bam;
      applyTheme(theme);
    }


    if (!organization) {
      throw notFound();
    }

    return { organization };
  },
  onLeave: () => {
    console.log("test");
    const theme = organizationThemes.default;
    applyTheme(theme);
  },
  head: ({ matches }) => {
    const routeMatch = matches.find((match) => match.routeId === "/o/$orgSlug");
    if (!routeMatch?.context?.organization) {
      return {};
    }
    const { organization } = routeMatch.context;
    return {
      meta: [{ title: organization.name }],
    };
  },
});

import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Link,
  useLoaderData,
  useParams,
  useRouteContext,
} from "@tanstack/react-router";
import { Building, Building2, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { api } from "@/convex/_generated/api";

export default function OrganizationSwitcher() {
  const { isMobile } = useSidebar();
  const { slug } = useParams({
    from: "/o/$slug",
  });

  const preloadOrganization = useRouteContext({
    from: "/o/$slug",
  }).organization;

  const preloadOrganizations = useLoaderData({
    from: "/o/$slug/_dashboard",
  }).organizations;

  const { data: liveOrganization } = useSuspenseQuery(
    convexQuery(api.organization.getOrganizationBySlug, {
      slug,
    }),
  );

  const { data: liveOrganizations } = useSuspenseQuery(
    convexQuery(api.organization.getAllOrganizations, {}),
  );

  const currentOrganization = liveOrganization || preloadOrganization;
  const organizations = liveOrganizations || preloadOrganizations;

  const others = organizations.filter(
    (org) => org.slug !== currentOrganization.slug,
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Building className="size-4" />
              </div>
              <span className="truncate font-medium">
                {currentOrganization.name}
              </span>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Organizations
            </DropdownMenuLabel>
            <DropdownMenuItem className="gap-2 p-2" asChild>
              <Link
                to="/o/$slug/settings"
                params={{ slug: currentOrganization.slug }}
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <Building2 className="size-3.5 shrink-0" />
                </div>
                {currentOrganization.name} <Badge>Current</Badge>
              </Link>
            </DropdownMenuItem>
            {others.length > 0 && <DropdownMenuSeparator />}
            {others.map((org) => (
              <DropdownMenuItem key={org.name} className="gap-2 p-2" asChild>
                <Link to="/o/$slug/settings" params={{ slug: org.slug }}>
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <Building2 className="size-3.5 shrink-0" />
                  </div>
                  {org.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

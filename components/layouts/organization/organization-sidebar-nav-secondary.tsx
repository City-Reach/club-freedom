import { Link, useLoaderData, useRouteContext } from "@tanstack/react-router";
import { ExternalLink, Settings, UserRoundCog } from "lucide-react";
import type { ComponentProps } from "react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import HasOrganizationPermission from "@/components/organization/has-organization-permission";

export default function OrganizationSidebarNavSecondary(
  props: ComponentProps<typeof SidebarGroup>,
) {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });
  const { user } = useLoaderData({
    from: "/o/$orgSlug/_dashboard",
  });

  return (
    <SidebarGroup {...props}>
      <SidebarMenu>
        <HasOrganizationPermission permissions={{ organization: ["update"] }}>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings" asChild>
              <Link
                to="/o/$orgSlug/settings"
                params={{ orgSlug: organization.slug }}
                className="[&.active]:not-hover:bg-muted"
              >
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </HasOrganizationPermission>
        {/* Admin Role */}
        {user.role === "admin" && (
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={{
                children: (
                  <p className="flex gap-2 items-center">
                    Admin <ExternalLink className="size-3" />
                  </p>
                ),
              }}
              asChild
            >
              <Link to="/admin">
                <UserRoundCog />
                <span>Admin</span>
                <ExternalLink className="ml-auto" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

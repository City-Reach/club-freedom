import { Link, useLoaderData, useParams } from "@tanstack/react-router";
import { ExternalLink, Settings, UserRoundCog } from "lucide-react";
import type { ComponentProps } from "react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export default function OrganizationSidebarNavSecondary(
  props: ComponentProps<typeof SidebarGroup>,
) {
  const { slug } = useParams({
    from: "/o/$slug",
  });
  const { user } = useLoaderData({
    from: "/o/$slug/_dashboard",
  });

  return (
    <SidebarGroup {...props}>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Settings" asChild>
            <Link
              to="/o/$slug/settings"
              params={{ slug }}
              className="[&.active]:not-hover:bg-muted"
            >
              <Settings />
              <span>Settings</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {user?.role === "admin" && (
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

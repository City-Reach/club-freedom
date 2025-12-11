import { Settings, Shield, UserRoundCog } from "lucide-react";
import { Link, useLoaderData, useParams } from "@tanstack/react-router";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ComponentProps } from "react";

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
            <Link to="/o/$slug/settings" params={{ slug }}>
              <Settings />
              <span>Settings</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {user?.role === "admin" && (
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Admin" asChild>
              <Link to="/admin">
                <UserRoundCog />
                <span>Admin</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

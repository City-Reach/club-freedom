import { Settings, Shield, Users2 } from "lucide-react";
import { Link, useLoaderData, useParams } from "@tanstack/react-router";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ComponentProps } from "react";

export default function OrganizationSidebarSecondaryNav(
  props: ComponentProps<typeof SidebarGroup>,
) {
  const { user } = useLoaderData({
    from: "/o/$slug",
  });
  const { slug } = useParams({
    from: "/o/$slug",
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
        {user.role === "admin" && (
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Admin" asChild>
              <Link to="/admin">
                <Shield />
                <span>Admin</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

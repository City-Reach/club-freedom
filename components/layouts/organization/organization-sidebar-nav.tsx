import { Settings, Users2 } from "lucide-react";
import { Link, useParams } from "@tanstack/react-router";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export default function OrganizationSidebarNav() {
  const { slug } = useParams({
    from: "/o/$slug",
  });
  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Settings" asChild>
            <Link to="/o/$slug/settings" params={{ slug }}>
              <Settings />
              <span>Settings</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Members" asChild>
            <Link to="/o/$slug/members" params={{ slug }}>
              <Users2 />
              <span>Members</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

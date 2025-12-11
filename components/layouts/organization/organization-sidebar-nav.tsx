import { MessageSquare, Shield, ShieldCheck, Users2 } from "lucide-react";
import { Link, useParams } from "@tanstack/react-router";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ComponentProps } from "react";

export default function OrganizationSidebarNav(
  props: ComponentProps<typeof SidebarGroup>,
) {
  const { slug } = useParams({
    from: "/o/$slug",
  });
  return (
    <SidebarGroup {...props}>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Feeds" asChild>
            <Link to="/o/$slug/feeds" params={{ slug }} className="[&.active]:not-hover:bg-muted">
              <MessageSquare />
              <span>Feeds</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Moderator" asChild>
            <Link to="/o/$slug/moderator" params={{ slug }} className="[&.active]:not-hover:bg-muted">
              <Shield />
              <span>Moderator</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Members" asChild>
            <Link to="/o/$slug/members" params={{ slug }} className="[&.active]:not-hover:bg-muted">
              <Users2 />
              <span>Members</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

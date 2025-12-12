import { Link, useParams } from "@tanstack/react-router";
import { MessageSquare, Shield, Users2 } from "lucide-react";
import type { ComponentProps } from "react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export default function OrganizationSidebarNav(
  props: ComponentProps<typeof SidebarGroup>,
) {
  const { orgSlug } = useParams({
    from: "/o/$orgSlug",
  });
  return (
    <SidebarGroup {...props}>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Testimonials" asChild>
            <Link
              to="/o/$orgSlug/testimonials"
              params={{ orgSlug }}
              className="[&.active]:not-hover:bg-muted"
            >
              <MessageSquare />
              <span>Testimonials</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Moderator" asChild>
            <Link
              to="/o/$orgSlug/moderator"
              params={{ orgSlug }}
              className="[&.active]:not-hover:bg-muted"
            >
              <Shield />
              <span>Moderator</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Members" asChild>
            <Link
              to="/o/$orgSlug/members"
              params={{ orgSlug }}
              className="[&.active]:not-hover:bg-muted"
            >
              <Users2 />
              <span>Members</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

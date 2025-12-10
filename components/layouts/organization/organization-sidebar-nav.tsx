import { Users2 } from "lucide-react";
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

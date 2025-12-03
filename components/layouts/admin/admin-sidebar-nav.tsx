import { Building } from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";

export default function AdminSidebarNav() {
  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Organizations" asChild>
            <Link to="/admin/organizations">
              <Building />
              <span>Organizations</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

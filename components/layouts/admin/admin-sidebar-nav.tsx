import { Link } from "@tanstack/react-router";
import { Building } from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export default function AdminSidebarNav() {
  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Organizations" asChild>
            <Link to="/admin/organizations" className="[&.active]:not-hover:bg-muted">
              <Building />
              <span>Organizations</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

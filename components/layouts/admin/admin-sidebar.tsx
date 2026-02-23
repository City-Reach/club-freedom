import { Link } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import type { ComponentProps } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import UserNavigation from "@/components/user-navigation";
import AdminSidebarNav from "./admin-sidebar-nav";

export default function AdminSidebar({
  ...props
}: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link to="/">
                <div className="border-2 border-accent flex aspect-square size-8 items-center justify-center rounded-lg p-0.5">
                  <Shield className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Admin</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <AdminSidebarNav />
      </SidebarContent>
      <SidebarFooter>
        <UserNavigation />
      </SidebarFooter>
    </Sidebar>
  );
}

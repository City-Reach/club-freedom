import type { ComponentProps } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import UserNavigation from "@/components/user-navigation";
import OrganizationSidebarHeader from "./organization-sidebar-header";
import OrganizationSidebarNav from "./organization-sidebar-nav";
import OrganizationSidebarNavSecondary from "./organization-sidebar-nav-secondary";

export default function OrganizationSidebar({
  ...props
}: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <OrganizationSidebarHeader />
      </SidebarHeader>
      <SidebarContent>
        <OrganizationSidebarNav />
        <OrganizationSidebarNavSecondary className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <UserNavigation />
      </SidebarFooter>
    </Sidebar>
  );
}

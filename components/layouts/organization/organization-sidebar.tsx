import { useRouteContext } from "@tanstack/react-router";
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
  const { user } = useRouteContext({
    from: "/o/$orgSlug/dashboard",
  });
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
        <UserNavigation user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

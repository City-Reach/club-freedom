import { useLoaderData } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import UserNavigation from "@/components/user-navigation";
import OrganizationSidebarNav from "./organization-sidebar-nav";
import OrganizationSidebarNavSecondary from "./organization-sidebar-nav-secondary";
import OrganizationSwitcher from "./organization-switcher";

export default function OrganizationSidebar({
  ...props
}: ComponentProps<typeof Sidebar>) {
  const { user } = useLoaderData({
    from: "/o/$orgSlug/_dashboard",
  });
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <OrganizationSwitcher />
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

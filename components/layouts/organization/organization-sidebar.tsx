import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ComponentProps } from "react";
import OrganizationSwitcher from "./organization-switcher";
import { useLoaderData } from "@tanstack/react-router";
import UserNavigation from "@/components/user-navigation";
import OrganizationSidebarNav from "./organization-sidebar-nav";
import OrganizationSidebarNavSecondary from "./organization-sidebar-nav-secondary";

export default function OrganizationSidebar({
  ...props
}: ComponentProps<typeof Sidebar>) {
  const { user } = useLoaderData({
    from: "/o/$slug/_dashboard",
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

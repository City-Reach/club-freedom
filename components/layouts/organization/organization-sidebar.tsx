import { ComponentProps } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useLoaderData } from "@tanstack/react-router";
import UserNavigation from "@/components/user-navigation";
import OrganizationSidebarNav from "./organization-sidebar-nav";
import OrganizationSwitcher from "./organization-switcher";

export default function OrganizationSidebar({
  ...props
}: ComponentProps<typeof Sidebar>) {
  const { user } = useLoaderData({
    from: "/o/$slug",
  });
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <OrganizationSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <OrganizationSidebarNav />
      </SidebarContent>
      <SidebarFooter>
        <UserNavigation user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

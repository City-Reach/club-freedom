import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ReactNode } from "react";
import OrganizationSidebar from "./organization-sidebar";
import UserDropDown from "@/components/user-dropdown";
import { useLoaderData } from "@tanstack/react-router";
import OrganizationInfo from "./organization-info";

export default function OrganizationLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useLoaderData({
    from: "/o/$slug/_dashboard",
  });
  return (
    <SidebarProvider>
      <OrganizationSidebar collapsible="icon" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-3">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <OrganizationInfo />
          </div>
          <div className="ml-auto">
            <UserDropDown user={user} />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

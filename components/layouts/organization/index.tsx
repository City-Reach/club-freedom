import type { ReactNode } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import UserDropDown from "@/components/user-dropdown";
import OrganizationInfo from "./organization-info";
import OrganizationSidebar from "./organization-sidebar";
import { authClient } from "@/lib/auth/auth-client";
import OrganizationUserDropdown from "@/components/organization/organization-user-dropdown";

export default function OrganizationLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { data } = authClient.useSession();
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
            {data?.user && <OrganizationUserDropdown user={data.user} />}
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

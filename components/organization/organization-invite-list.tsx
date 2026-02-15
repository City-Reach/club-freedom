import { queryOptions, useQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { Fragment } from "react";
import type { Doc } from "@/convex/betterAuth/_generated/dataModel";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "../ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "../ui/empty";
import { Separator } from "../ui/separator";
import { Spinner } from "../ui/spinner";
import OrganizationInviteListItem from "./organization-invite-list-item";

export function listInvitesQuery(organization: Doc<"organization">) {
  return queryOptions({
    queryKey: ["invitations", organization],
    queryFn: async () => {
      const { data, error } = await authClient.organization.listInvitations({
        query: {
          organizationId: organization._id,
        },
      });
      if (error) {
        throw error;
      }
      return data;
    },
  });
}

export default function OrganizationInviteList() {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });

  const { isLoading, data, refetch } = useQuery(listInvitesQuery(organization));

  if (isLoading)
    return (
      <div>
        <Spinner className="size-12 mx-auto" />
      </div>
    );

  if (data === undefined)
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle className="text-destructive">
            Failed to fetch invitations
          </EmptyTitle>
          <EmptyDescription className="text-destructive">
            An error occurred while fetching invitations.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </EmptyContent>
      </Empty>
    );

  if (data.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No invites</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ul className="grid gap-2">
      {data.map((invitation, index) => (
        <Fragment key={invitation.id}>
          <OrganizationInviteListItem invitation={invitation} />
          {index !== data.length - 1 && <Separator orientation="horizontal" />}
        </Fragment>
      ))}
    </ul>
  );
}

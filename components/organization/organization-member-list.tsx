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
import OrganizationMemberListItem from "./organization-member-list-item";

export function listMemberQuery(organization: Doc<"organization">) {
  return queryOptions({
    queryKey: ["members", organization],
    queryFn: async () => {
      const { data, error } = await authClient.organization.listMembers({
        query: {
          organizationId: organization._id,
        },
      });
      if (error) throw error;
      return data;
    },
  });
}

export default function OrganizationMemberList() {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });

  const { isLoading, data, refetch } = useQuery(listMemberQuery(organization));

  if (isLoading)
    return (
      <div>
        <Spinner className="size-12 mx-auto" />
      </div>
    );

  if (!data)
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle className="text-destructive">
            Failed to fetch members
          </EmptyTitle>
          <EmptyDescription className="text-destructive">
            An error occurred while fetching members.
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

  return (
    <ul className="grid gap-2">
      {data.members.map((member, index) => (
        <Fragment key={member.id}>
          <OrganizationMemberListItem member={member} />
          {index < data.members.length - 1 && (
            <Separator orientation="horizontal" />
          )}
        </Fragment>
      ))}
    </ul>
  );
}

import { authClient } from "@/lib/auth/auth-client";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import { Spinner } from "./ui/spinner";
import { CircleAlert } from "lucide-react";
import { Button } from "./ui/button";
import { Member } from "better-auth/plugins";
import z from "zod";
import { User } from "better-auth";
import { Fragment } from "react";
import { Separator } from "./ui/separator";

export default function MemberList() {
  const { current } = useLoaderData({
    from: "/o/$slug",
  });

  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["members", current.id],
    queryFn: async () => {
      const { data, error } = await authClient.organization.listMembers({
        query: {
          organizationId: current.id,
        },
      });
      if (error) {
        throw error;
      }
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-2 p-4">
        <Spinner className="size-4" />
        Loading...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center gap-2 p-4">
        <CircleAlert className="size-4" />
        <span className="text-sm">
          Cannot load members.{" "}
          <Button
            variant="link"
            className="p-0! cursor-pointer"
            onClick={() => refetch()}
          >
            Try again
          </Button>
        </span>
        <span>{error?.message}</span>
      </div>
    );
  }

  if (data.total === 0)
    return (
      <div className="flex flex-col items-center p-4">
        <span>No members found</span>
      </div>
    );

  return (
    <div className="flex flex-col gap-2">
      {data?.members.map((member, index) => (
        <Fragment key={member.id}>
          <MemberItemList member={member} />
          {index + 1 < data.members.length && <Separator />}
        </Fragment>
      ))}
    </div>
  );
}

type MemberItemListProps = {
  member: Member & { user: Pick<User, "name" | "email"> };
};

function MemberItemList({ member }: MemberItemListProps) {
  return (
    <div className="flex items-center">
      <div className="grow">
        <p className="font-semibold">{member.user.name}</p>
        <p className="text-sm">{member.user.email}</p>
      </div>
    </div>
  );
}

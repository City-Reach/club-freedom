import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/_generated/api";
import FormPreferenceListItem from "./form-preference-list-item";

export default function FormPreferenceList() {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });

  const { data, isLoading, refetch } = useQuery(
    convexQuery(api.formPreferences.getFormPreferenceByOrgId, {
      organizationId: organization._id,
    }),
  );

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
            Failed to fetch form preferences
          </EmptyTitle>
          <EmptyDescription className="text-destructive">
            An error occurred while fetching form preferences.
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
      {data.map((formPreference, index) => (
        <Fragment key={formPreference._id}>
          <FormPreferenceListItem formPreference={formPreference} />
          {index < data.length - 1 && (
            <Separator orientation="horizontal" />
          )}
        </Fragment>
      ))}
    </ul>
  );
}

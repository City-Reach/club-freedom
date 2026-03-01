import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { FormPreferenceContext } from "@/contexts/form-preference-context";
import { api } from "@/convex/_generated/api";
// import { hasPermissionQuery } from "@/lib/query";

type Props = {
  formPreferenceId: string;
};

export default function FormPreferenceDetail({ formPreferenceId }: Props) {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });
  const { data: formPreference } = useSuspenseQuery(
    convexQuery(api.formPreferences.getFormPreferenceByIdAndOrgId, {
      id: formPreferenceId,
      orgId: organization._id,
    }),
  );

  // const { data: canUpdate } = useSuspenseQuery(
  //   hasPermissionQuery(
  //     {
  //       organization: ["update"],
  //     },
  //     organization._id,
  //   ),
  // );

  if (!formPreference) {
    return (
      <Empty>
        <EmptyTitle>Form Preference not found.</EmptyTitle>
        <EmptyDescription>
          The form preference you are looking for could not be found. Please
          choose another one.
        </EmptyDescription>
      </Empty>
    );
  }

  return (
    <FormPreferenceContext.Provider value={{ formPreference: formPreference }}>
      <div className="flex flex-col gap-8 pb-16">
      </div>
    </FormPreferenceContext.Provider>
  );
}

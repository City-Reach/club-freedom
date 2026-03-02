import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { api } from "@/convex/_generated/api";
import FormPreferenceEditForm from "./-components/form/edit";

export const Route = createFileRoute(
  "/o/$orgSlug/dashboard/form-preferences/$id",
)({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const formPreferences = await context.queryClient.ensureQueryData(
      convexQuery(api.formPreferences.getFormPreferenceByIdAndOrgId, {
        id: params.id,
        orgId: context.organization._id,
      }),
    );

    if (!formPreferences) {
      throw notFound();
    }

    return { formPreferences };
  },
});

function RouteComponent() {
  return (
    <div className="grid max-w-3xl w-full gap-8 mx-auto p-4 pt-8">
      <h2 className="font-semibold">Edit testimonial form</h2>
      <FormPreferenceEditForm />
    </div>
  );
}

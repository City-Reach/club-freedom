import { createFileRoute } from "@tanstack/react-router";
import { getCurrentUser } from "@/app/functions/auth";
import OrganizationNavbar from "@/components/organization/organization-navbar";
import TestimonialForm from "@/components/testimonial-form";

export const Route = createFileRoute("/o/$orgSlug/")({
  component: TestimonialSubmissionPage,
  loader: async ({ context: { organization }, params }) => {
    const user = await getCurrentUser();
    return { user, orgSlug: params.orgSlug, organization };
  },
});

function TestimonialSubmissionPage() {
  const { user, organization } = Route.useLoaderData();
  return (
    <>
      <OrganizationNavbar user={user} organization={organization} />
      <main className="flex min-h-screen flex-col items-center py-24 px-8 gap-y-12 max-w-3xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold">
            Welcome to{" "}
            <span className="text-secondary">{organization.name}</span>{" "}
          </h1>
        </div>
        <TestimonialForm organizationId={organization._id} />
      </main>
    </>
  );
}

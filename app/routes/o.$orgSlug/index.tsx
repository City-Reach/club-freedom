import { createFileRoute } from "@tanstack/react-router";
import { getCurrentUser } from "@/app/functions/auth";
import TestonomialForm from "@/components/forms/testinomial-form";
import Navbar from "@/components/navbar";

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
      <Navbar user={user} organization={organization} />
      <main className="flex min-h-screen flex-col items-center py-24 px-8 gap-y-12 max-w-3xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold">
            Welcome to{" "}
            <span className="text-secondary">{organization.name}</span>{" "}
            Testimonial
          </h1>
          <p className="mt-4 text-lg">Please share your testimonial with us!</p>
          <p className="mt-4 italic text-lg text-gray-600">
            "Let your light shine before others" – Matthew 5:16
          </p>
        </div>
        <TestonomialForm organizationId={organization?._id || ""} />
      </main>
    </>
  );
}

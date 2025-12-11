import { getCurrentUser } from '@/app/functions/auth';
import { createFileRoute } from '@tanstack/react-router'
import TestonomialForm from "@/components/forms/testinomial-form";
import Navbar from "@/components/navbar";
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { NotFound } from '../__root';
import { Spinner } from '@/components/ui/spinner';
export const Route = createFileRoute('/$orgSlug/')({
  component: TestimonialSubmissionPage,
  loader: async () => {
    const user = await getCurrentUser();
    return { user };
  },
})

function TestimonialSubmissionPage() {
  const { user } = Route.useLoaderData();
  const { orgSlug } = Route.useParams()
  const orgData = useQuery(api.organizations.getOrg, { orgSlug: orgSlug });

  if (!orgData) return (
    <Spinner />
  );
  if (orgData.length > 0) {
    return (
      <>
        <Navbar user={user} />
        <main className="flex min-h-screen flex-col items-center py-24 px-8 gap-y-12 max-w-3xl mx-auto">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl font-bold">
              Welcome to <span className="text-secondary">Club Freedom</span>{" "}
              Testimonial
            </h1>
            <p className="mt-4 text-lg">Please share your testimonial with us!</p>
            <p className="mt-4 italic text-lg text-gray-600">
              "Let your light shine before others" – Matthew 5:16
            </p>
          </div>
          <TestonomialForm />
        </main>
      </>
    );
  }
  return (
    <NotFound />
  )
  
}

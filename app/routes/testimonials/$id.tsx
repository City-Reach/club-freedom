import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Suspense } from "react";
import notFound from "@/components/not-found";
import TestimonialDetail from "@/components/testimonial-detail";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { hasPermissionQuery } from "@/lib/query";
export const Route = createFileRoute("/testimonials/$id")({
  ssr: false,
  component: Component,
  loader: async (opts) => {
    const testimonial = await opts.context.queryClient.ensureQueryData(
      convexQuery(api.testimonials.getTestimonialById, {
        id: opts.params.id as Id<"testimonials">,
      }),
    );
    if (!testimonial) {
      throw notFound();
    }
    return { isApproved: testimonial.approved };
  },
});

function Component() {
  const { isApproved } = Route.useLoaderData();
  const { id } = Route.useParams();
  const { data: canView } = useSuspenseQuery(
    hasPermissionQuery({
      testimonial: ["view"],
    }),
  );
  if (!canView && !isApproved) {
    return (
      <main className="max-w-xl mx-auto py-12 px-8 flex flex-col items-center">
        <span>You do not have permission to view this testimonial.</span>
      </main>
    );
  }
  return (
    <div className="max-w-xl mx-auto py-12 px-8 space-y-4">
      <Button variant="link" className="px-0!" asChild>
        <Link to="..">
          <ChevronLeft />
          Back
        </Link>
      </Button>
      <Suspense fallback={<PendingTestimonialDetail />}>
        <TestimonialDetail id={id as Id<"testimonials">} />
      </Suspense>
    </div>
  );
}

function PendingTestimonialDetail() {
  return (
    <main className="max-w-xl mx-auto py-12 px-8 flex flex-col items-center">
      <Spinner className="size-8" />
      <span>Loading testimonial...</span>
    </main>
  );
}

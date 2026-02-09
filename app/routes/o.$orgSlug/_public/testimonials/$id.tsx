import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  notFound,
  rootRouteId,
  useMatch,
  useRouteContext,
  useRouter,
} from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Suspense } from "react";
import NotFound from "@/components/not-found";
import TestimonialApproval from "@/components/testimonial-detail/testimonial-approval";
import TestimonialDelete from "@/components/testimonial-detail/testimonial-delete";
import TestimonialDownload from "@/components/testimonial-detail/testimonial-download";
import TestimonialInfo from "@/components/testimonial-detail/testimonial-info";
import TestimonialMedia from "@/components/testimonial-detail/testimonial-media";
import TestimonialProcessingError from "@/components/testimonial-detail/testimonial-processing-error";
import TestimonialSummary from "@/components/testimonial-detail/testimonial-summary";
import TestimonialText from "@/components/testimonial-detail/testimonial-text";
import { TestimonialTitle } from "@/components/testimonial-detail/testimonial-title";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { TestimonialContext } from "@/contexts/testimonial-context";
import { api } from "@/convex/_generated/api";
import { hasPermissionQuery } from "@/lib/query";

export const Route = createFileRoute("/o/$orgSlug/_public/testimonials/$id")({
  ssr: false,
  component: Component,
  notFoundComponent: NotFound,
  loader: async ({ context, params }) => {
    const { _id } = context.organization;
    const testimonial = await context.queryClient.ensureQueryData(
      convexQuery(api.testimonials.getTestimonialByIdAndOrgId, {
        id: params.id,
        orgId: _id,
      }),
    );

    if (!testimonial) {
      throw notFound();
    }

    const canView = await context.queryClient.ensureQueryData(
      hasPermissionQuery({
        testimonial: ["view"],
      }),
    );

    if (!canView && !testimonial.approved) {
      throw notFound();
    }

    return { testimonial };
  },
});

function Component() {
  const { organization } = useRouteContext({ from: "/o/$orgSlug" });
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });
  const router = useRouter();

  const handleBack = () => {
    if (isRoot) {
      router.navigate({
        to: "/o/$orgSlug/testimonials",
        params: {
          orgSlug: organization.slug,
        },
      });
    } else {
      router.history.back();
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-8 space-y-4">
      <Button variant="link" className="px-0!" onClick={handleBack}>
        <ChevronLeft />
        Back
      </Button>
      <Suspense fallback={<Spinner className="mx-auto block" />}>
        <TestimonialDetail />
      </Suspense>
    </div>
  );
}

export default function TestimonialDetail() {
  const { id } = Route.useParams();
  const { organization } = useRouteContext({ from: "/o/$orgSlug" });
  const { testimonial: preloadTestimonial } = Route.useLoaderData();
  const { data: liveTestimonial } = useSuspenseQuery(
    convexQuery(api.testimonials.getTestimonialByIdAndOrgId, {
      id: id,
      orgId: organization._id,
    }),
  );

  const { data: canApprove } = useSuspenseQuery(
    hasPermissionQuery({
      testimonial: ["approve"],
    }),
  );

  const { data: canDownload } = useSuspenseQuery(
    hasPermissionQuery({
      testimonial: ["download"],
    }),
  );

  const { data: canDelete } = useSuspenseQuery(
    hasPermissionQuery({
      testimonial: ["delete"],
    }),
  );
  const testimonial = liveTestimonial || preloadTestimonial;

  return (
    <TestimonialContext.Provider value={{ testimonial }}>
      <div className="flex flex-col gap-8">
        {testimonial.processingStatus === "error" && (
          <TestimonialProcessingError />
        )}
        <TestimonialTitle />
        {testimonial.mediaUrl && (
          <TestimonialMedia mediaUrl={testimonial.mediaUrl} />
        )}
        <div className="flex flex-wrap gap-2">
          {canApprove && testimonial.processingStatus === "completed" && (
            <TestimonialApproval />
          )}
          {canDownload && <TestimonialDownload />}
          {canDelete && <TestimonialDelete />}
        </div>
        <TestimonialInfo />
        <TestimonialSummary />
        <TestimonialText />
      </div>
    </TestimonialContext.Provider>
  );
}

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
import { TestimonialContext } from "@/contexts/testimonial-context";
import { api } from "@/convex/_generated/api";
import { hasPermissionQuery } from "@/lib/query";
import LoadingTestimonial from "./-components/loading-testimonial";
import TestimonialDetail from "./-components/testimonial-detail";

export const Route = createFileRoute("/o/$orgSlug/dashboard/testimonials/$id")({
  ssr: false,
  component: Component,
});

function Component() {
  const { id, orgSlug } = Route.useParams();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });
  const router = useRouter();

  const handleBack = () => {
    if (isRoot) {
      router.navigate({
        to: "/o/$orgSlug/dashboard/testimonials",
        params: {
          orgSlug,
        },
      });
    } else {
      router.history.back();
    }
  };

  return (
    <div className="max-w-xl mx-auto py space-y-8 p-4">
      <Button variant="outline" onClick={handleBack}>
        <ChevronLeft />
        Back
      </Button>
      <Suspense fallback={<LoadingTestimonial />}>
        <TestimonialDetail testimonialId={id} />
      </Suspense>
    </div>
  );
}

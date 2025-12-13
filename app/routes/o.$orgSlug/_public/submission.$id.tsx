import { createFileRoute, redirect } from "@tanstack/react-router";
import { CircleAlert } from "lucide-react";
import { isTestimonialForPublicView } from "@/app/functions/testimonial";
import TestimonialDetail from "@/components/testimonial-detail";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Id } from "@/convex/_generated/dataModel";

export const Route = createFileRoute("/o/$orgSlug/_public/submission/$id")({
  component: RouteComponent,
  beforeLoad: async ({ params }) => {
    const canView = await isTestimonialForPublicView({
      data: { testimonialId: params.id },
    });
    if (!canView) {
      throw redirect({
        to: "/o/$orgSlug",
        params,
      });
    }
  },
});

function RouteComponent() {
  const { id } = Route.useParams();
  return (
    <main className="max-w-lg mx-auto py-12 px-8 space-y-4">
      <Alert>
        <CircleAlert />
        <AlertTitle>Thank you for your submission!</AlertTitle>
        <AlertDescription>
          If you leave this page, you may not be able to see this page again.
        </AlertDescription>
      </Alert>
      <TestimonialDetail id={id as Id<"testimonials">} />
    </main>
  );
}

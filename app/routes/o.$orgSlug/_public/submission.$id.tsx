import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { CircleAlert } from "lucide-react";
import { isTestimonialForPublicView } from "@/app/functions/testimonial";
import TestimonialDetail from "@/components/testimonial-detail";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Spinner } from "@/components/ui/spinner";
import NotFound from "@/components/not-found";
import Testimonial from "@/components/testimonial";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/o/$orgSlug/_public/submission/$id")({
  component: RouteComponent,
  beforeLoad: async ({ params, context }) => {
    const canView = await isTestimonialForPublicView({
      data: {
        testimonialId: params.id,
        organizationId: context.organization._id,
      },
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
  const { id, orgSlug } = Route.useParams();
  const { organization } = Route.useRouteContext();

  const testimonial = useQuery(api.testimonials.getTestimonialById, {
    id: id as Id<"testimonials">,
  });

  if (testimonial === undefined) {
    return (
      <main className="max-w-lg mx-auto py-12 px-8 space-y-4">
        <Spinner className="size-8" />
        <span>Loading testimonial</span>
      </main>
    );
  }

  if (testimonial === null) {
    return <NotFound />;
  }

  return (
    <main className="max-w-lg mx-auto py-12 px-8 space-y-4">
      <Alert>
        <CircleAlert />
        <AlertTitle>Thank you for your submission!</AlertTitle>
        <AlertDescription>
          If you leave this page, you may not be able to see this page again.
        </AlertDescription>
      </Alert>
      <Button asChild>
        <Link to="/o/$orgSlug" params={{ orgSlug }}>
          Create another testimonial
        </Link>
      </Button>
      <Testimonial testimonial={testimonial}>
        <Testimonial.Title />
        <Testimonial.Metadata />
        {testimonial.mediaUrl && (
          <Testimonial.Media mediaUrl={testimonial.mediaUrl} />
        )}
        <Testimonial.Summary />
        <Testimonial.Text />
      </Testimonial>
    </main>
  );
}

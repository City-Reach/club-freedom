import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { ChevronLeft } from "lucide-react";
import NotFound from "@/components/not-found";
import Testimonial from "@/components/testimonial";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export const Route = createFileRoute("/o/$orgSlug/_dashboard/testimonials/$id")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  const { id } = Route.useParams();
  const { organization } = Route.useRouteContext();
  const testimonial = useQuery(api.testimonials.getTestimonialById, {
    id: id as Id<"testimonials">,
  });

  if (testimonial === undefined) {
    return (
      <div className="max-w-lg mx-auto py-12 px-8 space-y-4">
        <Spinner className="size-8" />
        <span>Loading testimonial</span>
      </div>
    );
  }

  if (testimonial === null) {
    return <NotFound />;
  }

  return (
    <div className="max-w-lg mx-auto py-12 px-8 space-y-4">
      <Button variant="link" className="px-0!" asChild>
        <Link to="..">
          <ChevronLeft />
          Back
        </Link>
      </Button>
      <Testimonial testimonial={testimonial}>
        <Testimonial.Title />
        <Testimonial.Metadata />
        {testimonial.mediaUrl && (
          <Testimonial.Media mediaUrl={testimonial.mediaUrl} />
        )}
        <Testimonial.Action organization={organization}>
          <div className="flex wrap gap-4">
            <Testimonial.Action.MediaDownload />
            <Testimonial.Action.Approval />
          </div>
        </Testimonial.Action>
        <Testimonial.Summary />
        <Testimonial.Text />
      </Testimonial>
    </div>
  );
}

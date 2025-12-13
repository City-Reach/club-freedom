import { createFileRoute, Link } from "@tanstack/react-router";
import { Authenticated, Unauthenticated } from "convex/react";
import { ChevronLeft, CircleAlert } from "lucide-react";
import TestimonialDetail from "@/components/testimonial-detail";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { Id } from "@/convex/_generated/dataModel";

export const Route = createFileRoute("/o/$orgSlug/_public/submission/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { orgSlug, id } = Route.useParams();
  return (
    <main className="max-w-lg mx-auto py-12 px-8 space-y-4">
      <Unauthenticated>
        <Alert>
          <CircleAlert />
          <AlertTitle>Thank you for your submission!</AlertTitle>
          <AlertDescription>
            If you leave this page, you may not be able to see this page again.
          </AlertDescription>
        </Alert>
      </Unauthenticated>
      <Authenticated>
        <Button variant="link" className="px-0!" asChild>
          <Link to="/o/$orgSlug/testimonials" params={{ orgSlug }}>
            <ChevronLeft />
            View all posts
          </Link>
        </Button>
      </Authenticated>
      <TestimonialDetail id={id as Id<"testimonials">} />
    </main>
  );
}
